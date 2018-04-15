const { MongoClient } = require('mongodb')
var io = require('socket.io')();
var tweetnacl = require('tweetnacl');

var dec = tweetnacl.util.decodeBase64;

let db = null;

const fn = {
  'query': (collection, sample) => {
    console.log(collection, sample);
  },
  'delete': (collection, sample) => {
    console.log(collection, sample);
  },
  'save': (collection, sample, callback) => {
    console.log(collection, sample);

    coll = db.collection(collection);
    coll.save(sample, (err, result) => {
      console.log("save event", collection, sample);
      console.log(result.ops);
      return err ? callback(err) : callback(result.ops);
    });
  }
}

io.on('connection', function(socket){
  console.log('new connection');

  socket.on('link', function (data) {
    console.log(data);
    // AUTHORIZATION LOGIC GOES HERE +LATER+
    if (data.action) {
      fn[data.action](data.collection, data.sample, (result) => {
        socket.emit(data.collection, result);
      });
    }
  });
});

io.use((socket, next) => {
  // AUTHENTICATION LOGIC
  const q = socket.handshake.query;
  const raw_message = new Date(q.nonce).toString();
  const message = dec(raw_message);
  const result = tweetnacl.sign.detached.verify(message, dec(q.signature), dec(q.pubkey));
  
  // return the result of next() to accept the connection.
  if (result) {
      return next();
  }
  // call next() with an Error if you need to reject the connection.
  next(new Error('Authentication error'));
});

url = "mongodb://127.0.0.1:27017/test"
MongoClient.connect(url, (err, connection) => {
  if(!connection) process.exit();
  db = connection.db('meli');
  io.listen(3000);
});
