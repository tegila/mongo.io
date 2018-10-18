const io = require('socket.io')(3000);
const middleware = require('./middleware');
// const redisAdapter = require('socket.io-redis');
// io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

server.listen(port);
console.log(`listening socket.io on port ${port}`);

io.on('connection', (socket) => {
  console.log('new socket.io client');
  
  socket.on('whoami', () => socket.emit('whoami', socket.__auth__));
  socket.on('link', (data) => middleware.link(io, socket, data));
});

/** https://stackoverflow.com/questions/33906921/socket-io-not-disconnecting-xhr-polling-400-bad-request */
io.set('transports', [
  'websocket',
  'flashsocket',
  'polling'
]);

// AUTHENTICATION LOGIC
io.use(middleware.auth);
