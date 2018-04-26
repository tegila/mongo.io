const { MongoClient, ObjectID } = require('mongodb')
var io = require('socket.io');
var nacl = require('tweetnacl');

var fs = require('fs');
var path = require('path');
var https = require('https');

var options = {
  key: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt'))
};

var server = https.createServer(options);
var io = io(server);

var dec = nacl.util.decodeBase64;

let db = null;

const db_name = process.argv[2] || 'test';
const port = process.argv[3] || 3000;

const fn = {
  'query': (db_name, collection, payload, callback) => {
    // console.log(collection, payload);
    if(payload._id) delete payload._id;
    let _db = db.db(db_name);
    const coll = _db.collection(collection);
    coll.find(payload).toArray((err, results) => {
      // console.log("query: ", collection, payload);
      console.log('query: ', err, results);
      return err ? callback(err) : callback('query', results);
    });
  },
  'delete': (db_name, collection, payload, callback) => {
    // console.log(collection, payload);
    if(payload._id) payload._id = new ObjectID(payload._id);

    console.log("payload: ", payload);
    let _db = db.db(db_name);
    const coll = _db.collection(collection);
    
    coll.remove(payload, (err, result) => {
      console.log("delete: ", collection, payload);
      // console.log(numberOfRemovedDocs.result);
      return err ? callback(err) : callback('delete', result);
    });
  },
  'save': (db_name, collection, payload, callback) => {
    // console.log(collection, payload);
    if(payload._id) payload._id = new ObjectID(payload._id);

    let _db = db.db(db_name);
    const coll = _db.collection(collection);
    coll.save(payload, (err, result) => {
      // console.log("save: ", collection, payload);
      console.log('save', err, result.ops);
      return err ? callback(err) : callback('save', result.ops);
    });
  },
  'update': (db_name, collection, payload, callback) => {
    // console.log(collection, payload);
    if(payload._id) payload._id = new ObjectID(payload._id);

    let _db = db.db(db_name);
    const coll = _db.collection(collection);
    coll.update(payload.target, { '$set': payload.data }, payload.ops, function(err, res) {
      // console.log("save: ", collection, payload);
      console.log('update', err, res.result);
      return err ? callback(err) : callback('update', res.result);
    });
  },
}

io.on('connection', function(socket, next){
  console.log('new connection');
  const q = socket.handshake.query;
  console.log(q);
  socket.on('link', function (data) {
    // console.log(data);
    // AUTHORIZATION LOGIC GOES HERE +LATER+
    console.log(data);
    const payload_hash = nacl.hash(dec(JSON.stringify(data.payload)));
    const _match = nacl.sign.detached.verify(payload_hash, dec(data.signature), dec(q.pubkey));
    if(!_match) {
      const err = new Error('Authentication error');
      return err;
    }

    if (data.action) {
      const [db_name, collection] = data.collection.split("/");
      fn[data.action](db_name, collection, data.payload, (action, result) => {
        if (result && result.constructor === Array) {
          result.forEach((payload) => {
            console.log(`emit[array]:`, data.collection, payload);
            socket.emit(data.collection, {
              action: data.action,
              collection: data.collection,
              payload
            });
          });
        } else {
          console.log(`emit[object]: ${result}`);
          socket.emit(data.collection, {
            action: data.action,
            collection: data.collection,
            payload: result
          });
        }
      });
    }
  });
});

io.use((socket, next) => {
  console.log("---- io.use ----");
  // AUTHENTICATION LOGIC
  const q = socket.handshake.query;

  const message = q.message;
  const result = nacl.sign.detached.verify(dec(message), dec(q.signature), dec(q.pubkey));
  console.log(result);
  // return the result of next() to accept the connection.
  
  /*
  let _db = db.db("__auth__");
  const coll = _db.collection("Profiles");
  coll.find({pubkey: q.pubkey}).toArray((err, results) => {
    // console.log("query: ", collection, payload);
    console.log('query: ', err, results);
    return err ? callback(err) : callback('query', results);
  });
  */

  if (result) {
      return next();
  }

  const err = new Error('Authentication error');
  console.log(err)
  // call next() with an Error if you need to reject the connection.
  next(err);
});

const url = `mongodb://127.0.0.1:27017/${db_name}`
MongoClient.connect(url, (err, connection) => {
  console.log("MongoDB Connected");
  if(!connection) process.exit();
  db = connection.db(db_name);
  server.listen(port);
  console.log(`listening socket.io on port ${port}`);
});
