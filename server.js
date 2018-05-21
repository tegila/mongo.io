const { MongoClient, ObjectID } = require('mongodb')
const socketio = require('socket.io');
const nacl = require('tweetnacl');

const fs = require('fs');
const path = require('path');
const https = require('https');

const dec = nacl.util.decodeBase64;

const db_name = process.argv[2] || 'test';
const port = process.argv[3] || 3000;

const options = {
  key: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt'))
};

const server = https.createServer(options);
const io = socketio(server);

let db = null;

/* https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder  */
function str2ab(str) {
  var buf = new Uint8Array(str.length); // 2 bytes for each char
  for (var i = 0; i < str.length; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
}

const __parse_date__ = (obj) => {
  var key, value;
  for (key in obj) {
    value = obj[key];
    if (value !== null && typeof value === 'object') {
      __parse_date__(value);
    } else if (typeof value === 'string') {
      if (value.match(/^(\d){4}-(\d){2}-(\d){2}T(\d){2}:(\d){2}:(\d){2}/i)) {
        obj[key] = new Date(Date.parse(value));
      }
    }
  }
}

const __execute__ = (socket, data) => {
  const payload = data.payload || {};
  __parse_date__(payload);
  if (payload._id) payload._id = new ObjectID(payload._id);

  const [db_name, collection] = data.path.split("/");
  let _db = db.db(db_name);
  const coll = _db.collection(collection);
  console.log(data);

  switch (data.action) {
    case 'lastOne':
      console.log('[server.js] lastOne: ', payload);
      coll.findOne(payload, {sort: {$natural: -1}}, (err, res) => {
        if (!err) socket.emit(data.path, {
          type: 'lastOne',
          data: res
        });
        socket.emit(data.signature, {
          err,
          res
        });
      });
      break;
    case 'query':
      console.log('[server.js] query: ', payload);
      coll.find(payload).toArray((err, res) => {
        /*
        if (!err) res.forEach((document) => {
          socket.emit(data.path, {
            type: `QUERY`,
            data: document
          });
        });
        */
        console.log(res.length);
        socket.emit(data.signature, {
          err,
          res
        });
      });
      break;
    case 'delete':
      console.log("[server.js] delete: ", payload);
      coll.remove({ _id: payload._id }, (err, res) => {
        if (!err) socket.emit(data.path, {
          type: 'DELETE',
          path: data.path,
          data: payload
        });
        socket.emit(data.signature, {
          err,
          res
        });
      });
      break;
    case 'save':
      console.log("[server.js] save: ", payload);
      coll.save(payload, (err, result) => {
        if (!err) socket.emit(data.path, {
          type: 'SAVE',
          path: data.path,
          data: payload
        });
        socket.emit(data.signature, {
          err,
          res: result
        });
      });
      break;
    case 'update':
      const target = payload._target ? payload._target : { _id: payload._id };
      const new_values = payload._data ? payload._data : payload;
      const ops = payload._ops? payload._ops : { w: 1 };
      console.log("[server.js] update: ", new_values.id);
      coll.update(target, { '$set': new_values }, ops, function(err, res) {
        if (!err) socket.emit(data.path, {
          type: 'UPDATE',
          path: data.path,
          data: new_values
        });
        socket.emit(data.signature, {
          err,
          res
        });
      });
      break;
    default:
      return null;
  }
}

const __authorize__ = (socket, data) => {
  // AUTHORIZATION LOGIC 
  const payload_hash = nacl.hash(str2ab(JSON.stringify(data.payload)));
  const q = socket.handshake.query;
  const _first = nacl.sign.detached.verify(payload_hash, dec(data.signature), dec(q.pubkey));
  
  const _second = socket.__auth__.restrictions.some((rule) => {
    if (!data.action) return false;
    // caso encontre o caminho no perfil do usuario
    const regex = new RegExp(rule.path);
    if (regex.test(data.path)) {
      // confere agora se tem permissão de leitura e/ou escrita
      if (data.action === 'query') {
        return (rule.permission.indexOf('r') !== -1);
      } else {
        return (rule.permission.indexOf('w') !== -1);
      }
    }
  });
  return _first && _second;
}

io.on('connection', function(socket, next) {
  console.log('[server.js] new connection');
  
  socket.on('me', function () {
    console.log('[server.js] me function');
    socket.emit('me', socket.__auth__);
  });
  
  socket.on('link', function (data) {  
    console.log("[server.js] link");
    if (!__authorize__(socket, data)) {
      return new Error('Authorization error');
    }
    __execute__(socket, data);
  });
});

// middleware para autenticar com base em chave publica/privada
io.use((socket, next) => {
  // AUTHENTICATION LOGIC
  const q = socket.handshake.query;
  const message = q.message;
  
  const signature_is_valid = nacl.sign.detached.verify(str2ab(message), dec(q.signature), dec(q.pubkey));
  if (!signature_is_valid) {
    const err = new Error('Signature isn\'t valid !!');
    console.log(err);
    next(err);
  }

  let _db = db.db("__auth__");
  const coll = _db.collection("Profiles");
  coll.findOne({pubkeys: q.pubkey}, (err, profile) => {
    if (profile) {
      console.log('[server.js] login try: ', err, profile.username);
      socket.__auth__ = profile;
      return next();
    } else {
      const err = new Error('Authentication error');
      console.log(err)
      // return the result of next() to accept the connection.
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
