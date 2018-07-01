import { MongoClient, ObjectID } from 'mongodb';

export let db = null;

export const connect = (url, port) => {
  MongoClient.connect(url, (err, connection) => {
    if(!connection) process.exit();
    console.log("MongoDB Connected");
    db = connection.db(db_name);
  });
}

export const find_profile = (q, callback) => {
  let _db = db.db("__auth__");
  const coll = _db.collection("Profiles");
  coll.findOne({ pubkeys: q.pubkey }, (err, profile) => {
    if (profile) {
      console.log('[server.js] login try: ', err, profile.username);
      callback(profile);
    } else {
      const err = new Error('Authentication error');
      console.log(err)
      // return the result of next() to accept the connection.
      callback(err);
    }
  });
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

export const __execute__ = (socket, data) => {
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
        socket.emit(data.signature, {
          err,
          res
        });
      });
      break;
    case 'query':
      console.log('[server.js] query: ', payload);
      coll.find(payload).toArray((err, res) => {
        socket.emit(data.signature, {
          err,
          res
        });
      });
      break;
    case 'delete':
      console.log("[server.js] delete: ", payload);
      return new Promise((resolve, reject) => {
        coll.remove({ _id: payload._id }, (err, res) => {
          if (err) reject(err);
          if (res) resolve(res);
        
        if (!err) io.sockets.emit(data.path, {
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
        if (!err) io.sockets.emit(data.path, {
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
      
        if (!err) io.sockets.emit(data.path, {
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


const select_collection = (dbname, collection) => {
  return db.db(db_name).collection(collection);
}

const update = (dbname, collection, payload) => {
  const payload = data.payload || {};
  __parse_date__(payload);
  if (payload._id) payload._id = new ObjectID(payload._id);

  
  

  const target = payload._target ? payload._target : { _id: payload._id };
  const new_values = payload._data ? payload._data : payload;
  const ops = payload._ops? payload._ops : { w: 1 };
  console.log("[server.js] update: ", new_values.id);
  coll.update(target, { '$set': new_values }, ops, function(err, res) {
  });
}