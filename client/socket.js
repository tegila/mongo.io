/* eslint-disable */

const socket = require('socket.io-client');

export let io = null;

// https://localhost/socket.io?query={signature=...&pubkey=...&message=...}
export const connect = (url, secretKey) => {
  const auth_enc = authenticate(secretKey);
  io = socket.connect(url, { rejectUnauthorized: false, reconnect: true, query: auth_enc });
}

export const whoami = () => {
  return new Promise((resolve) => {
    io.once('whoami', data => resolve(data));
    io.emit('whoami');
  });
}

export const raw_sync = (action, collection, payload) => {
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
};

export const find = (collection, payload) => raw_sync("find", collection, payload);
export const findOne = (collection, payload) => raw_sync("findOne", collection, payload);
export const insert = (collection, payload) => raw_sync("insert", collection, payload);
export const update = (collection, payload) => raw_sync("update", collection, payload);
export const remove = (collection, payload) => raw_sync("remove", collection, payload);
