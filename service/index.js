const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const http = require('http');
const server = http.createServer(app);
const DB = require('./database.js');
const WebSocket = require('ws');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
}

const authCookieName = 'token';

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

var apiRouter = express.Router();
app.use('/api', apiRouter);

const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

apiRouter.post('/auth/create', async (req, res) => {
    if (await findUser('email', req.body.email)) {
        res.status(409).send({ msg: 'Email already connected to a user.' });
    } else {
        const user = await createUser(req.body.email, req.body.password);

        setAuthCookie(res, user.token);
        res.send({
          email: user.email,
          balances: user.balances,
          dinos: user.dinos,
        });
    }
});

apiRouter.post('/auth/login', async (req, res) => {
    const user = await findUser('email', req.body.email);

    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            user.token = uuid.v4();
            setAuthCookie(res, user.token);

            const now = new Date();
            const lastLogin = new Date(user.lastLogin || now);
            const minutesOffline = Math.floor((now - lastLogin) / (1000 * 60));

            if (!user.dinos) {
              user.dinos = [{ id: 1, name: 'T-Rex', health: 90, happiness: 75 }];
            }

            const updatedDinos = user.dinos.map(dino => {
              const scalesGained = minutesOffline * 1; // 1 scale/minute
              const healthLost = minutesOffline * 0.2;  // 0.2 health/minute

              return {
                ...dino,
                health: Math.max(dino.health - healthLost, 0),
              };
            });

            const totalScalesGained = minutesOffline * updatedDinos.length;

            user.balances = {
              food: (user.balances?.food ?? user.food ?? 100),
              scales: (user.balances?.scales ?? user.scales ?? 1500),
            }
            
            if (!user.dinos) user.dinos = [{ id: 1, name: 'T-Rex', health: 90, happiness: 75 }];
            if (!user.lastLogin) user.lastLogin = new Date();

            // Update balances and dinos
            user.balances.scales += totalScalesGained;
            user.dinos = updatedDinos;
            user.lastLogin = now;

            await DB.updateUser(user);
            res.send({
              email: user.email,
              balances: user.balances,
              dinos: user.dinos,
            });
            return;
        }
        res.status(401).send({ msg: 'Incorrect password.' });
    }
    res.status(401).send({ msg: 'No account is associated with this email.' });
});

apiRouter.post('/user/save', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    user.dinos = req.body.dinos;
    user.balances = req.body.balances;
    user.lastLogin = new Date();
    await DB.updateUser(user);
    res.status(200).send({ msg: 'Saved successfully' });
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});


apiRouter.delete('/auth/logout', async (req, res) => {
    const user = await findUser('token', req.cookies[authCookieName])

    if (user) {
        delete user.token;
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
});

apiRouter.get('/user/:email', async (req, res) => {
  const user = await DB.getUser(req.params.email);
  if (user) {
    res.send({
      email: user.email,
      balances: user.balances,
      dinos: user.dinos
    });
  } else {
    res.status(404).send({ msg: 'User not found' });
  }
});

app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
  });

app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
  });

async function createUser(email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = {
        email: email,
        password: passwordHash,
        token: uuid.v4(),
        balances: { food: 100, scales: 1500 },
        dinos: [{ id: 1, name: 'T-Rex', health: 90, happiness: 75 }],
        lastLogin: new Date(),
    };
    await DB.addUser(user);
    return user;
}

async function findUser(field, value) {
    if (!value) {
        return null;
    }

    if (field === 'token') {
        return DB.getUserByToken(value);
    }
    return DB.getUser(value);
}

function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    });
  }
  
  const wss = new WebSocket.Server({ noServer: true });
  const clients = new Map();
  
  wss.on('connection', (ws) => {
    let email = null;
  
    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      const { type, target } = msg;
  
      if (type === 'identify') {
        email = msg.email;
        clients.set(email, ws);
        console.log(`${email} connected`);
        return;
      }
  
      if (!email) {
        ws.send(JSON.stringify({ type: 'error', msg: 'You must identify first.' }));
        return;
      }
  
      if (type === 'view-enclosure') {
        const targetWs = clients.get(target);
        if (targetWs) {
          targetWs.send(JSON.stringify({
            type: 'request-enclosure',
            from: email,
          }));
        } else {
          ws.send(JSON.stringify({
            type: 'error',
            msg: `User ${target} is not online.`,
          }));
        }
      }
  
      if (type === 'enclosure-data') {
        const to = msg.to;
        const targetWs = clients.get(to);
        if (targetWs) {
          targetWs.send(JSON.stringify({
            type: 'enclosure-data',
            data: msg.data,
          }));
        }
      }
    });
  
    ws.on('close', () => {
      if (email) {
        clients.delete(email);
        console.log(`${email} disconnected`);
      }
    });
  });
  
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
  
  server.listen(port, () => {
    console.log(`HTTP + WebSocket server listening on port ${port}`);
  });