import { MongoClient, ObjectID } from 'mongodb';

export let db = null;

export const enable = (url, callback) => {
  MongoClient.connect(url, (err, connection) => {
    if (!connection) process.exit();
    console.log("MongoDB Connected");
    db = connection.db("test");
    callback();
  });
}

export const __parse_date__ = (obj) => {
  var key, value;
  for (key in obj) {
    value = obj[key];
    if (value !== null && typeof value === 'object') {
      __parse_date__(value);
    } else if (typeof value === 'string') {
      if (value.match(/^(\d){4}-(\d){2}-(\d){2}T(\d){2}:(\d){2}:(\d){2}/i)) {
        obj[key] = new Date(Date.parse(value));
      } else if (value.indexOf("__REGEXP ") == 0) {
        var m = value.split("__REGEXP ")[1].match(/\/(.*)\/(.*)?/);
        obj[key] = new RegExp(m[1], m[2] || "");
      }
    }
  }
}

export const select_collection = (dbname, collection) => {
  return db.db(dbname).collection(collection);
}

export const __fix_id__ = (obj) => { 
  if(obj._id) obj._id = new ObjectID(obj._id) 
};

export const findOne = (coll, payload, callback) => {
  coll.findOne(payload, {sort: {$natural: -1}}, callback);
}

export const query = (coll, payload, callback) => {
  coll.find(payload).toArray(callback);
}

export const remove = (coll, payload, callback) => {
  coll.remove({ _id: payload._id }, callback);
}

export const save = (coll, payload, callback) => {
  coll.save(payload, (err, status) => {
    callback(err, { status, res: payload });
  });
}

export const update = (coll, payload, callback) => {
  const target = payload._target ? payload._target : { _id: payload._id };
  const new_values = payload._data ? payload._data : payload;
  const ops = payload._ops? payload._ops : { w: 1 };

  coll.update(target, { '$set': new_values }, ops, (err, status) => {
    callback(err, { status, res: new_values });
  });
}