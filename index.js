const socket = require('socket.io-client');
const nacl = require('tweetnacl');
const querystring = require('querystring');

const enc = nacl.util.encodeBase64;
const dec = nacl.util.decodeBase64;
let io = null;


/* https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder  */
function str2ab(str) {
  const buf = new ArrayBuffer(str.length); // 2 bytes for each char
  for (let i = 0; i < str.length; i += 1) {
    buf[i] = str.charCodeAt(i);
  }
  return new Uint8Array(buf);
}

module.exports = (url) => {
  let keypair = {};

  return {
    connect: (old_keypair) => {
      if (old_keypair) {
        keypair.secretKey = dec(old_keypair.secretKey);
        keypair.publicKey = dec(old_keypair.publicKey);
      } else {
        keypair = nacl.sign.keyPair();
      }

      const message = new Date().toString();

      const signature = nacl.sign.detached(str2ab(message), keypair.secretKey);

      const auth = {
        signature: enc(signature),
        pubkey: enc(keypair.publicKey),
        message
      };
      const auth_enc = querystring.stringify(auth);

      // https://localhost/socket.io?query={signature=...&pubkey=...&message=...}
      io = socket.connect(url, { rejectUnauthorized: false, reconnect: true, query: auth_enc });
    },
    on: (topic, callback) => {
      io.on(topic, callback);
    },
    once: (topic, callback) => {
      io.once(topic, callback);
    },
    query: (path, payload) => {
      const payload_hash = nacl.hash(str2ab(JSON.stringify(payload)));
      const signature = enc(nacl.sign.detached(payload_hash, keypair.secretKey));
      io.emit('link', {
        action: "query",
        path,
        payload,
        signature
      });
    },
    delete: (path, payload) => {
      return new Promise((resolve, reject) => {
        const payload_hash = nacl.hash(str2ab(JSON.stringify(payload)));
        const signature = enc(nacl.sign.detached(payload_hash, keypair.secretKey));
        io.once(signature, (data) => {
          console.log("[index.js] ONCE DELETE");
          if (data.err) reject(data.err);
          if (data.res) resolve(data.res);
        });
        io.emit('link', {
          action: "delete",
          path,
          payload,
          signature
        });
      });
    },
    save: (path, payload) => {
      return new Promise((resolve, reject) => {
        const payload_hash = nacl.hash(str2ab(JSON.stringify(payload)));
        const signature = enc(nacl.sign.detached(payload_hash, keypair.secretKey));
        console.log('[index.js] save', path, signature);
        io.once(signature, (data) => {
          console.log("[index.js] ONCE SAVE");
          if (data.err) reject(data.err);
          if (data.res) resolve(data.res);
        });
        io.emit('link', {
          action: "save",
          path,
          payload,
          signature
        });
      });
    },
    update: (path, payload) => {
      return new Promise((resolve, reject) => {
        const payload_hash = nacl.hash(str2ab(JSON.stringify(payload)));
        const signature = enc(nacl.sign.detached(payload_hash, keypair.secretKey));
        console.log('[index.js] update', path, signature);
        io.once(signature, (data) => {
          console.log("[index.js] ONCE UPDATE");
          if (data.err) reject(data.err);
          if (data.res) resolve(data.res);
        });
        io.emit('link', {
          action: "update",
          path,
          payload,
          signature
        });
      });
    }
  };
};
