const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
// redux store - persistence layer
const Store = require('./index');
const config = require('./config');


store = Store(config.host);
store.connect(config.keychain);

store.on('connect', (session) => {
  console.log('connected');
  store.me().then(console.log);

  store.on('test/session', (session) => {
    console.log("[test.js] store.on: ", session);
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
      store.lastOne('test/session', {}).then((session) => {
        console.log(data);
        store.delete('test/session', session.data).then((data) => {
          console.log("[test.js] delete: ", data);
        });
      });
    }).catch((err) => {
      console.log("err: ", err);
    });
  });
});
