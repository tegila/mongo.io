//client.js
var socket = require('socket.io-client');
var tweetnacl = require('tweetnacl');
var querystring = require('querystring');

var enc = tweetnacl.util.encodeBase64;
var dec = tweetnacl.util.decodeBase64;
let io = null;

const MongoIOClient = {
  on: (collection, sample, callback) => {
    io.on(collection, function (payload) {
      callback(payload);
    });

    io.emit('link', {
      action: "query",
      collection,
      sample
    });
  },
  once: (collection, sample, callback) => {
    io.once(collection, function (payload) {
      callback(payload);
    });

    io.emit('link', {
      action: "query",
      collection,
      sample
    });
  },
  delete: (collection, sample, callback) => {
    io.emit('link', {
      action: "delete",
      collection,
      sample
    });
  },
  save: (collection, sample, callback) => {
    io.emit('link', {
      action: "save",
      collection,
      sample
    });
  }
}

module.exports = (url, old_keypair) => {
  const keypair = old_keypair || tweetnacl.sign.keyPair();
  const raw = new Date().toString();
  const message = dec(raw);
  const signature = tweetnacl.sign.detached(message, keypair.secretKey);
  
  const auth = {
    signature: enc(signature),
    pubkey: enc(keypair.publicKey),
    nonce: raw
  }
  const auth_enc = querystring.stringify(auth);
  
  io = socket.connect(url, { reconnect: true, query: auth_enc });

  // Add a connect listener
  io.on('connect', function (socket) {
    console.log('Connected!');
  });

  io.on('link', function (payload) {
    console.log('link: ', payload);
  });

  return MongoIOClient;
}