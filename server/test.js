// redux store - persistence layer
const Store = require('../client/index');

store = Store("http://localhost");
store.connect("Kz4JQuFiq7gXvbBLKGdtqhRG9JS56gtScriE4vviCnRzHTVCkrxw");

store.on('connect', (session) => {
  console.log('connected');
  store.me().then(console.log);

  store.on('test/session', (session) => {
    console.log("GLOBAL [test.js] store.on: ", session);
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
      store.findOne('test/session', {}).then((session) => {
        console.log(data);
        store.remove('test/session', data).then((data) => {
          console.log("[test.js] delete: ", data);
        });
      });
    }).catch((err) => {
      console.log("err: ", err);
    });
  });
});
