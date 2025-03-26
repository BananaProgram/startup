const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');
const users = db.collection('user');

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
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


module.exports = {
  getUser,
  getUserByToken,
  addUser
};
