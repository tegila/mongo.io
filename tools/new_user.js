const { MongoClient, ObjectID } = require('mongodb')
const nacl = require('tweetnacl');
const util = require('tweetnacl-util');
const enc = util.encodeBase64;

const keypair = nacl.sign.keyPair();

console.log(enc(keypair.secretKey));
console.log(enc(keypair.publicKey));

const url = `mongodb://127.0.0.1:27017/__auth__`
MongoClient.connect(url, (err, connection) => {
  if(!connection) process.exit();
  console.log("MongoDB Connected");
  const db = connection.db("__auth__");
  const coll = db.collection("Profiles");
  coll.save({
    user: "password",
    pubkeys: [enc(keypair.publicKey)],
    restrictions: [{
      path: '.*',
      permission: ['r', 'w']
    }]
  }, (err, result) => {
    console.log(err, result.ops);
  });
});
