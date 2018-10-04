/* eslint-disable */
const authenticate = require('./auth');
const socket = require('socket.io-client');
export let io = null;

module.exports = () => ({
  /* https://localhost/socket.io?query={signature=...&pubkey=...&message=...} */
  connect: (url, secretKey) => {
    const auth_enc = authenticate(secretKey);
    io = socket.connect(url, { rejectUnauthorized: false, reconnect: true, query: auth_enc });
  },
  whoami: () => {
    return new Promise((resolve) => {
      io.once('whoami', data => resolve(data));
      io.emit('whoami');
    });
  },
  raw_sync: (action, collection, payload) => {
    return new Promise((resolve, reject) => {
      const signature = auth.sign_transaction(transaction);
      io.once(signature, (data) => {
        if (data.err) reject(data.err);
        if (data.res) resolve(data.res);
      });
      io.emit('link', {
        transaction: {
          action,
          collection,
          payload
        },
        signature
      });
    });
  },
  find: (collection, payload) => raw_sync("find", collection, payload),
  findOne: (collection, payload) => raw_sync("findOne", collection, payload),
  insert: (collection, payload) => raw_sync("insert", collection, payload),
  update: (collection, payload) => raw_sync("update", collection, payload),
  remove: (collection, payload) => raw_sync("remove", collection, payload)
});
