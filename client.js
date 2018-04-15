//client.js
var socket = require('socket.io-client');
var tweetnacl = require('tweetnacl');
var querystring = require('querystring');

var enc = tweetnacl.util.encodeBase64;
var dec = tweetnacl.util.decodeBase64;

const keypair = tweetnacl.sign.keyPair();
const raw = new Date().toString();
const message = dec(raw);
const signature = tweetnacl.sign.detached(message, keypair.secretKey);

var auth = {
  signature: enc(signature),
  pubkey: enc(keypair.publicKey),
  nonce: raw
}
const auth_enc = querystring.stringify(auth);

var io = socket.connect("http://127.0.0.1:3000/", { reconnect: true, query: auth_enc });

// Add a connect listener
io.on('connect', function (socket) {
  console.log('Connected!');
});

io.on('link', function (payload) {
  console.log('link: ', payload);
});

io.on('session', function (payload) {
  console.log('session: ', payload);
  io.emit('link', {
    action: "delete",
    collection: "session",
    sample: payload
  });
});

io.emit('link', {
  action: "save",
  collection: "session",
  sample: {
    hello: 'world'
  }
});

io.emit('link', {
  action: "query",
  collection: "session",
  sample: {
    hello: 'world'
  }
});