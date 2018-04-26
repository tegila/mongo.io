//client.js
var socket = require('socket.io-client');
var nacl = require('tweetnacl');

var querystring = require('querystring');

var enc = nacl.util.encodeBase64;
var dec = nacl.util.decodeBase64;
let io = null;

module.exports = (url, old_keypair) => {
  const keypair = old_keypair || nacl.sign.keyPair();
  let message = new Date().toString();

  const signature = nacl.sign.detached(dec(message), keypair.secretKey);
  
  const auth = {
    signature: enc(signature),
    pubkey: enc(keypair.publicKey),
    message: message
  }
  const auth_enc = querystring.stringify(auth);

  io = socket.connect(url, { rejectUnauthorized: false, reconnect: true, query: auth_enc });

  return {
    on: (topic, callback) => {
      io.on(topic, callback);
    },
    once: (topic, callback) => {
      io.once(topic, callback);
    },
    query: (collection, payload, callback) => {
      payload_hash = nacl.hash(dec(JSON.stringify(payload)));
      const signature = enc(nacl.sign.detached(payload_hash, keypair.secretKey));
      io.emit('link', {
        action: "query",
        collection,
        payload,
        signature
      });
    },
    delete: (collection, payload, callback) => {
      payload_hash = nacl.hash(dec(JSON.stringify(payload)));
      const signature = enc(nacl.sign.detached(payload_hash, keypair.secretKey));
      io.emit('link', {
        action: "delete",
        collection,
        payload,
        signature
      });
    },
    save: (collection, payload, callback) => {
      payload_hash = nacl.hash(dec(JSON.stringify(payload)));
      const signature = enc(nacl.sign.detached(payload_hash, keypair.secretKey));
      io.emit('link', {
        action: "save",
        collection,
        payload,
        signature
      });
    },
    update: (collection, payload, callback) => {
      payload_hash = nacl.hash(dec(JSON.stringify(payload)));
      const signature = enc(nacl.sign.detached(payload_hash, keypair.secretKey));
      io.emit('link', {
        action: "update",
        collection,
        payload,
        signature
      });
    }
  }
}
