const { MongoClient, ObjectID } = require('mongodb')
var io = require('socket.io')();
var tweetnacl = require('tweetnacl');

var dec = tweetnacl.util.decodeBase64;

let db = null;

const db_name = process.argv[2] || 'test';
const port = process.argv[3] || 3000;

const fn = {
  'query': (collection, sample, callback) => {
    // console.log(collection, sample);
    if(sample._id) delete sample._id;
    coll = db.collection(collection);
    coll.find(sample).toArray((err, results) => {
      // console.log("query: ", collection, sample);
      console.log('query: ', err, results);
      return err ? callback(err) : callback(results);
    });
  },
  'delete': (collection, sample, callback) => {
    // console.log(collection, sample);
    if(sample._id) sample._id = new ObjectID(sample._id);

    coll = db.collection(collection);
    
    coll.remove(sample, (err, numberOfRemovedDocs) => {
      console.log("delete: ", collection, sample);
      // console.log(numberOfRemovedDocs.result);
      return err ? callback(err) : callback(numberOfRemovedDocs);
    });
  },
  'save': (collection, sample, callback) => {
    // console.log(collection, sample);

    coll = db.collection(collection);
    coll.save(sample, (err, result) => {
      // console.log("save: ", collection, sample);
      console.log('save', err, result.ops);
      return err ? callback(err) : callback(result.ops.pop());
    });
  }
}

io.on('connection', function(socket){
  console.log('new connection');

  socket.on('link', function (data) {
    // console.log(data);
    // AUTHORIZATION LOGIC GOES HERE +LATER+
    if (data.action) {
      fn[data.action](data.collection, data.sample, (result) => {
        if (result && result.constructor === Array) {
          result.forEach((item) => {
            console.log(item);
            socket.emit(data.collection, item);  
          });
        } else {
          socket.emit('link', result);
        }
      });
    }
  });
});

io.use((socket, next) => {
  // AUTHENTICATION LOGIC
  const q = socket.handshake.query;
  const message = dec(q.nonce);
  const result = tweetnacl.sign.detached.verify(message, dec(q.signature), dec(q.pubkey));
  
  // return the result of next() to accept the connection.
  if (result) {
      return next();
  }
  const err = new Error('Authentication error');
  console.log(err)
  // call next() with an Error if you need to reject the connection.
  next(err);
});

url = "mongodb://127.0.0.1:27017/test"
MongoClient.connect(url, (err, connection) => {
  if(!connection) process.exit();
  db = connection.db(db_name);
  io.listen(port);
});
