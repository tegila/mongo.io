/* eslint-disable */

const socket = require('socket.io-client');
const nacl = require('tweetnacl');
const querystring = require('querystring');

const enc = nacl.util.encodeBase64;
const dec = nacl.util.decodeBase64;
let io = null;

/* https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder  */
function str2ab(str) {
  const buf = new Uint8Array(str.length); // 2 bytes for each char
  for (let i = 0; i < str.length; i += 1) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
}

// https://stackoverflow.com/questions/12075927/serialization-of-regexp
const __parse_regex__ = (obj) => {
  var key, value;
  for (key in obj) {
    value = obj[key];
    if (value !== null && value instanceof RegExp) {
      obj[key] = ("__REGEXP " + value.toString());
    } else if (typeof value === 'object') {
      __parse_regex__(value);
    }
  }
}

module.exports = (url) => {
  let keypair = {};

  return {
    me: () => {
      return new Promise((resolve) => {
        io.once('me', (data) => {
          console.log("[index.js] ONCE ME");
          if (data) resolve(data);
        });
        io.emit('me');
      });
    },
    generate_key: () => {
      return nacl.sign.keyPair().secretKey;
    },
    connect: (secretKey) => {
      if (!secretKey) return;

      keypair = nacl.sign.keyPair.fromSecretKey(dec(secretKey));
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
    close: () => {
      io.close();
    },
    on: (topic, callback) => {
      io.on(topic, callback);
    },
    once: (topic, callback) => {
      io.once(topic, callback);
    },
    lastOne: (path, payload) => {
      return new Promise((resolve, reject) => {
        const payload_hash = nacl.hash(str2ab(JSON.stringify(payload)));
        const signature = enc(nacl.sign.detached(payload_hash, keypair.secretKey));
        io.once(signature, (data) => {
          const _local = Object.assign({}, data);
          console.log("[index.js] ONCE lastOne", _local);
          if (_local.err) reject(_local.err);
          if (_local.res) resolve(_local.res);
        });
        io.emit('link', {
          action: "lastOne",
          path,
          payload,
          signature
        });
      });
    },
    query: (path, payload) => {
      __parse_regex__(payload);
      console.log(payload);
      return new Promise((resolve, reject) => {
        const payload_hash = nacl.hash(str2ab(JSON.stringify(payload)));
        const signature = enc(nacl.sign.detached(payload_hash, keypair.secretKey));
        io.once(signature, (data) => {
          const _local = Object.assign({}, data);
          // console.log("[index.js] ONCE QUERY", _local);
          if (_local.err) reject(_local.err);
          if (_local.res) resolve(_local.res);
        });
        io.emit('link', {
          action: "query",
          path,
          payload,
          signature
        });
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
