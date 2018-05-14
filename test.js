const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
// redux store - persistence layer
const Store = require('./index');

const host = process.env.THOST || "https://localhost:3000";
console.log(host);

store = Store(host);
store.connect({
  publicKey: "MpZfc/HM0OZ5JyNRdrfQOHABhZTaIVrfaRa0VTB65DE=",
  secretKey: "45w67HOo4GfYpHiYVEF+8DdyKjrQFofKXVEFK6joOiYyll9z8czQ5nknI1F2t9A4cAGFlNohWt9pFrRVMHrkMQ=="
});

store.on('connect', (session) => {
  console.log('connected');
  store.me().then(console.log);

  store.on('test/session', (session) => {
    if (session.type !== 'lastOne') return;
    console.log("[test.js] store.on: ", session);
    store.delete('test/session', session.data).then((data) => {
      console.log("[test.js] delete: ", data);
    });
  });

  store.save('test/session', { hello: 'world' }).then((data) => {
    console.log("[test.js] save: ", data);
    delete data._id;
    data.hello = "worldxxx";
    store.update('test/session', {
      _target: {
        hello: "world"
      },
      _data: data
    }).then((update_info) => {
      console.log("[test.js] update: ", update_info);
      store.lastOne('test/session', {}).then(console.log);
    }).catch((err) => {
      console.log("err: ", err);
    });
  });
});
