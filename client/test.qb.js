const qb = require('./queryBuilder');
const Store = require('./index');

store = Store('http://localhost');
store.connect('Kz4JQuFiq7gXvbBLKGdtqhRG9JS56gtScriE4vviCnRzHTVCkrxw');

store.on('connect', (session) => {
  console.log('connected');
  store.me().then(console.log);

  store.on('test/session', (session) => {
    console.log("GLOBAL [test.js] store.on: ", session);
  });
});
