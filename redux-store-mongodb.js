//client.js
var socket = require('socket.io-client');
var tweetnacl = require('tweetnacl');
var querystring = require('querystring');

var enc = tweetnacl.util.encodeBase64;
var dec = tweetnacl.util.decodeBase64;
let io = null;

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

  return {
    on: (topic, callback) => {
      io.on(topic, callback);
    },
    once: (topic, callback) => {
      io.once(topic, callback);
    },
    query: (collection, sample, callback) => {
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
      // payload_hash = nacl.hash(JSON.stringify(payload));
      io.emit('link', {
        action: "save",
        collection,
        sample
      });
    }
  }
}
