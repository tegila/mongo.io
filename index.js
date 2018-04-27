const socket = require('socket.io-client');
const nacl = require('tweetnacl');
const _buffer = require('Buffer');
const querystring = require('querystring');

const enc = nacl.util.encodeBase64;
const dec = nacl.util.decodeBase64;
let io = null;

module.exports = (url, old_keypair) => {
  let keypair = {};
  if (old_keypair) {
    keypair.secretKey = dec(old_keypair.secretKey);
    keypair.publicKey = dec(old_keypair.publicKey);
  } else {
    keypair = nacl.sign.keyPair();
  }
  console.log(_buffer);
  console.log(enc(keypair.publicKey));
  console.log(enc(keypair.secretKey));
  const message = new Date().toString();

  const signature = nacl.sign.detached(new Uint8Array(message), keypair.secretKey);

  const auth = {
    signature: enc(signature),
    pubkey: enc(keypair.publicKey),
    message
  };
  const auth_enc = querystring.stringify(auth);

  // https://localhost/socket.io?query={signature=...&pubkey=...&message=...}
  io = socket.connect(url, { rejectUnauthorized: false, reconnect: true, query: auth_enc });

  return {
    on: (topic, callback) => {
      io.on(topic, callback);
    },
    once: (topic, callback) => {
      io.once(topic, callback);
    },
    query: (collection, payload) => {
      const payload_hash = nacl.hash(new Uint8Array(JSON.stringify(payload)));
      const signature = enc(nacl.sign.detached(payload_hash, keypair.secretKey));
      io.emit('link', {
        action: "query",
        collection,
        payload,
        signature
      });
    },
    delete: (collection, payload) => {
      const payload_hash = nacl.hash(new Uint8Array(JSON.stringify(payload)));
      const signature = enc(nacl.sign.detached(payload_hash, keypair.secretKey));
      io.emit('link', {
        action: "delete",
        collection,
        payload,
        signature
      });
    },
    save: (collection, payload) => {
      const payload_hash = nacl.hash(new Uint8Array(JSON.stringify(payload)));
      const signature = enc(nacl.sign.detached(payload_hash, keypair.secretKey));
      io.emit('link', {
        action: "save",
        collection,
        payload,
        signature
      });
    },
    update: (collection, payload) => {
      const payload_hash = nacl.hash(new Uint8Array(JSON.stringify(payload)));
      const signature = enc(nacl.sign.detached(payload_hash, keypair.secretKey));
      io.emit('link', {
        action: "update",
        collection,
        payload,
        signature
      });
    }
  };
};
