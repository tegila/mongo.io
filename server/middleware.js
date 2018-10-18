const mongo = require('./mongo');
const Auth = require('../common/auth');
const Rules = require('../common/rules');

const auth = (socket, next) => {
  const q = socket.handshake.query;
  const message = q.message;

  if (!Auth.__check_signature__(message, q.signature, q.pubkey)) {
    console.log('[ERROR]: Check Signature');
    return next(false);
  }
  mongo.__profile__(q.pubkey, (err, profile) => {
    if (err) {
      console.log('[ERROR]: User not found');
      return next(err);
    }
    console.log(`User found: ${profile.user}`);
    socket.__auth__ = profile;
    return next();
  })
}

export const __execute__ = (data, callback) => {
  const payload = data.payload || {};
  const actions = ["findOne", "query", "remove", "save", "update"];

  if (actions.indexOf(data.action) > -1) {
    console.log(data.action);
    const [dbname, collection] = data.collection.split("/");
    const coll = mongo.select_collection(dbname, collection);
    mongo.__fix_id__(data.payload);
    mongo.__parse_date__(data.payload);
    return mongo[data.action](coll, data.payload.payload, callback);
  }
}

export const link = (io, socket, data) => {
  console.log("[server.js] link");
  if (Rules.__authorize__(socket, data)) {
    __execute__(data, (err, res) => {
      const broadcast = Object.assign({}, data, { err, res });
      // broadcast to all connected clients
      // TODO: (fix to specific channel)
      io.sockets.emit(data.payload.collection, broadcast);
      // emit to specific client
      socket.emit(data.signature, { err, res }); 
    });
  }
}

module.exports = {
  auth,
  link,
}
