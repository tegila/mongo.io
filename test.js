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
  store.on('test/session', (output) => {
    console.log("session callback: ", output);
    if(output.action === 'query') {
      store.delete(output.collection, output.payload);
    } else if(output.action === 'save') {
      store.update('test/session', { 
        target: {
          hello: 'world'
        },
        data: {
          hello: 'world22'
        },
        ops: {
          upsert:true, 
          w: 1,
          multi:true
        }
      });
    } else if(output.action === 'update') {
      store.query('test/session', { hello: 'world22' });
    }
  });
  
  store.save('test/session', { hello: 'world' });
});
