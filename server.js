const { MongoClient, ObjectID } = require('mongodb')
const socketio = require('socket.io');
const nacl = require('tweetnacl');

const fs = require('fs');
const path = require('path');
const https = require('https');

const options = {
  key: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt'))
};

const server = https.createServer(options);
const io = socketio(server);

const dec = nacl.util.decodeBase64;

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
      console.log(result);
      console.log('save', err, result.ops);
      return err ? callback(err) : callback('save', result.ops);
    });
  },
  'update': (db_name, collection, payload, callback) => {
    // console.log(collection, payload);
    if(payload._id) payload._id = new ObjectID(payload._id);
    console.log(payload);
    let _db = db.db(db_name);
    const coll = _db.collection(collection);
    coll.update(payload.target, { '$set': payload.data }, payload.ops, function(err, res) {
      // console.log("save: ", collection, payload);
      console.log('update', err, res);
      return err ? callback(err) : callback('update', res.result);
    });
  },
}

io.on('connection', function(socket, next){
  console.log('new connection');
  const q = socket.handshake.query;
  console.log(q);
  socket.on('link', function (data) {
    const [db_name, collection] = data.collection.split("/");
    // console.log(data);
    // AUTHORIZATION LOGIC GOES HERE +LATER+
    const payload_hash = nacl.hash(Buffer.from(JSON.stringify(data.payload)));
    const _match = nacl.sign.detached.verify(payload_hash, dec(data.signature), dec(q.pubkey));

    const _validate = socket.__auth__.restrictions.some((item) => {
      if(!data.action) return false;
      // caso encontre o caminho no perfil do usuario
      if(item.path.localeCompare(data.collection)) {
        // confere agora se tem permissão de leitura e/ou escrita
        if(data.action === 'query') {
          return (item.permission.indexOf('r') !== -1);
        } else {
          return (item.permission.indexOf('w') !== -1);
        }
      }
    });
    
    if(!_validate) {
      throw new Error('Authorization error');
    }

    /* -- END AUTH -- */

    fn[data.action](db_name, collection, data.payload, (action, result) => {
      if (result && result.constructor === Array) {
        result.forEach((payload) => {
          console.log(`emit[array]:`, data.collection, payload);
          io.emit(data.collection, {
            action: data.action,
            collection: data.collection,
            payload
          });
        });
      } else {
        console.log(`emit[object]: ${result}`);
        io.emit(data.collection, {
          action: data.action,
          collection: data.collection,
          payload: result
        });
      }
    });
  });
});

io.use((socket, next) => {
  console.log("---- io.use ----");
  // AUTHENTICATION LOGIC
  const q = socket.handshake.query;

  const message = q.message;
  const signature_is_valid = nacl.sign.detached.verify(new Uint8Array(message), dec(q.signature), dec(q.pubkey));
  console.log(signature_is_valid);
  // return the result of next() to accept the connection.
  
  let _db = db.db("__auth__");
  const coll = _db.collection("Profiles");
  coll.findOne({pubkeys: q.pubkey}, (err, profile) => {
    if (profile) {
      console.log('query: ', err, profile);
      socket.__auth__ = profile;
      return next();
    } else if (signature_is_valid) {
      const err = new Error('Signature is valid but can\'t find the user');
      console.log(err)
      next(err);
    } else {
      const err = new Error('Authentication error');
      console.log(err)
      next(err);
    }
  });
});

const url = `mongodb://127.0.0.1:27017/${db_name}`
MongoClient.connect(url, (err, connection) => {
  if(!connection) process.exit();
  console.log("MongoDB Connected");
  db = connection.db(db_name);
  server.listen(port);
  console.log(`listening socket.io on port ${port}`);
});
