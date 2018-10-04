const qb = require('./queryBuilder');
const Store = require('./index');

store = Store('http://localhost');
store.connect('FKRz1v/vlFL3Y65LLxIZlxJTc4zD5jPUWLGzqC7BQZgTnxjkoGxPB6tLfi0KXU1u5q+zycqqBSjMhKSBUfvgWw==');

store.on('connect', (session) => {
  console.log('connected');
  store.me().then(console.log);

  store.on('test/session', (session) => {
    console.log("GLOBAL [test.js] store.on: ", session);
  });
});
