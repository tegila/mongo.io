/* eslint-disable */
const Auth = require('./auth');
const socket = require('socket.io-client');

const wss = (url, secretKey) => {
  const auth = Auth(secretKey);
  /* https://stackoverflow.com/questions/33906921/socket-io-not-disconnecting-xhr-polling-400-bad-request */
  /* http(s)://<host>/socket.io?query={signature=...&pubkey=...&message=...} */
  const io = socket.connect(url, {
    rejectUnauthorized: false,
    transports: [ 
        "flashsocket",
        "polling",
        "websocket"
      ],
    reconnect: true,
    query: auth.auth_string()
  });

  return {
    whoami: () => {
      return new Promise((resolve) => {
        io.once('whoami', data => resolve(data));
        io.emit('whoami');
      });
    },
    send: (transaction) => {
      return new Promise((resolve, reject) => {
        const signature = auth.sign_transaction(transaction);
        io.once(signature, (data) => {
          if (data.err) reject(data.err);
          if (data.res) resolve(data.res);
        });
        io.emit('link', {
          transaction,
          signature
        });
      });
    }
  }
};

module.exports = wss;
