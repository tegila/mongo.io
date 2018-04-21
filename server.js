const { MongoClient, ObjectID } = require('mongodb')
var io = require('socket.io');
var tweetnacl = require('tweetnacl');

var fs = require('fs');
var https = require('https');

var options = {
  key: fs.readFileSync('./cert.pem'),
  cert: fs.readFileSync('./cert.crt')
};

var server = https.createServer(options);
var io = io(server);

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
      return err ? callback(err) : callback('query', results);
    });
  },
  'delete': (collection, sample, callback) => {
    // console.log(collection, sample);
    if(sample._id) sample._id = new ObjectID(sample._id);
    delete sample._id;
    coll = db.collection(collection);
    
    coll.remove({hello: "world2"}, (err, result) => {
      console.log("delete: ", collection, sample);
      // console.log(numberOfRemovedDocs.result);
      return err ? callback(err) : callback('delete', result);
    });
  },
  'save': (collection, sample, callback) => {
    // console.log(collection, sample);
    if(sample._id) sample._id = new ObjectID(sample._id);

    coll = db.collection(collection);
    coll.save(sample, (err, result) => {
      // console.log("save: ", collection, sample);
      console.log('save', err, result.ops);
      return err ? callback(err) : callback('save', result.ops);
    });
  }
}

io.on('connection', function(socket){
  console.log('new connection');

  socket.on('link', function (data) {
    // console.log(data);
    // AUTHORIZATION LOGIC GOES HERE +LATER+
    if (data.action) {
      fn[data.action](data.collection, data.sample, (action, result) => {
        if (result && result.constructor === Array) {
          result.forEach((item) => {
            console.log(`emit[array]:`, data.collection, item);
            socket.emit(data.collection, {
              action: data.action,
              collection: data.collection,
              item
            });
          });
        } else {
          console.log(`emit[object]: ${result}`);
          socket.emit(data.collection, {
            action: data.action,
            collection: data.collection,
            item: result
          });
        }
      });
    }
  });
});

io.use((socket, next) => {
  console.log("io.use");
  // AUTHENTICATION LOGIC
  const q = socket.handshake.query;
  const message = dec(q.nonce);
  const result = tweetnacl.sign.detached.verify(message, dec(q.signature), dec(q.pubkey));
  console.log(result);
  // return the result of next() to accept the connection.
  if (result) {
      return next();
  }
  const err = new Error('Authentication error');
  console.log(err)
  // call next() with an Error if you need to reject the connection.
  next(err);
});

url = `mongodb://127.0.0.1:27017/${db_name}`
MongoClient.connect(url, (err, connection) => {
  console.log("MongoDB Connected");
  if(!connection) process.exit();
  db = connection.db(db_name);
  server.listen(port);
  console.log(`listening socket.io on port ${port}`);
});
