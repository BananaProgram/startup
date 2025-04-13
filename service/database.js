const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const users = db.collection('user');

console.log('Database module loaded');

(async function testConnection() {
  try {
    console.log(`Connecting to database at ${url}`);
    await db.command({ ping: 1 });
    console.log(`Connected to database`);
  } catch (ex) {
    console.error(`Unable to connect to database: ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(email) {
  return users.findOne({ email: email });
}

function getUserByToken(token) {
  return users.findOne({ token: token });
}

async function addUser(user) {
  await users.insertOne(user);
}

async function updateUser(user) {
  await users.updateOne({ email: user.email }, { $set: user });
}

async function updateLastLogin(email, date) {
  await users.updateOne({ email }, { $set: { lastLogin: date } });
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  updateLastLogin
};
