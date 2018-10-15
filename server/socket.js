const http = require('http');
const socketio = require('socket.io');

const auth = require('./auth');
const mongo = require('./mongo');

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

export const enable = (port) => {
  const server = http.createServer();
  const io = socketio(server);
  server.listen(port);
  console.log(`listening socket.io on port ${port}`);

  io.on('connection', function(socket, next) {
    console.log('[server.js] new connection');
    
    // ------------ ME() --------------
    socket.on('me', function () {
      console.log('[server.js] me function');
      socket.emit('me', socket.__auth__);
    });
    
    // ------------ LINK() --------------
    socket.on('link', function (data) {  
      console.log("[server.js] link");
      if (auth.__authorize__(socket, data)) {
        __execute__(data, (err, res) => {
          const broadcast = Object.assign({}, data, { err, res });
          // broadcast to all connected clients
          // TODO: (fix to specific channel)
          io.sockets.emit(data.payload.collection, broadcast);
          // emit to specific client
          socket.emit(data.signature, { err, res }); 
        });
      }
      
    });
  });
  /** https://stackoverflow.com/questions/33906921/socket-io-not-disconnecting-xhr-polling-400-bad-request */
  io.set('transports', [ 'websocket', 'flashsocket', 'polling' ] );

  // AUTHENTICATION LOGIC
  io.use((socket, next) => {
    const q = socket.handshake.query;
    const message = q.message;

    if (!auth.__check_signature__(message, q.signature, q.pubkey)) 
      return next(false);

    auth.__profile__(q.pubkey, (err, profile) => {
      if (err) return next(err);
      socket.__auth__ = profile;
      return next();
    })
  });
};
