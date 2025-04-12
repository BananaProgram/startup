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

apiRouter.post('/auth/create', async (req, res) => {
    if (await findUser('email', req.body.email)) {
        res.status(409).send({ msg: 'Email already connected to a user.' });
    } else {
        const user = await createUser(req.body.email, req.body.password);

        setAuthCookie(res, user.token);
        res.send({ email: user.email })
    }
});

apiRouter.post('/auth/login', async (req, res) => {
    const user = await findUser('email', req.body.email);

    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            user.token = uuid.v4();
            setAuthCookie(res, user.token);
            res.send({ email: user.email });
            return;
        }
        res.status(401).send({ msg: 'Incorrect password.' });
    }
    res.status(401).send({ msg: 'No account is associated with this email.' });
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
  const user = await DB.findUserByEmail(req.params.email);
  if (user) {
    res.send({ email: user.email });
  } else {
    res.status(404).send({ msg: 'User not found' });
  }
});


const verifyAuth = async (req, res, next) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
      next();
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  };

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
        scales: 1500,
        food: 50,
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
  
  const ws = new WebSocket.Server({ noServer: true });
  const clients = new Map();
  
  ws.on('connection', (ws) => {
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
    ws.handleUpgrade(request, socket, head, (ws) => {
      ws.emit('connection', ws, request);
    });
  });
  
  server.listen(port, () => {
    console.log(`HTTP + WebSocket server listening on port ${port}`);
  });