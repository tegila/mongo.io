const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
// redux store - persistence layer
const Store = require('./index');

const host = process.env.THOST || "https://localhost:3000";
console.log(host);

store = Store(host);
store.on('connect', (session) => {
  console.log('connected');
  store.on('session', (output) => {
    console.log("session callback: ", output);
    if(output.action === 'query') {
      store.delete(output.collection, output);
    } else if(output.action === 'save') {
      store.query('session', { hello: 'world2' });
    }
  });
  
  store.save('session', { hello: 'world2' });
});
