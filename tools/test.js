// redux store - persistence layer
const Store = require('../client/index');

store = Store("http://localhost:3000");
store.connect("42EvDFt4KTG84dblNQ+Kgj8bv0H4T0+vWMJ0DXTFzLRFM4I06+/eoeOL8J1MbEwUD9Dm4KORNr5QBZDDhlp0ZQ==");

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
