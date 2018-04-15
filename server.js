var io = require('socket.io')();
var tweetnacl = require('tweetnacl');

var dec = tweetnacl.util.decodeBase64;

io.on('connection', function(socket){
  console.log('new connection');
  socket.emit('hello', 'me2', 'mario');
  socket.on('hello', function (socket) {
    console.log(socket);
  });
});

io.use((socket, next) => {
  const q = socket.handshake.query;
  console.log(q);
  const raw_message = new Date(q.nonce).toString();
  const message = dec(raw_message);
  const result = tweetnacl.sign.detached.verify(message, dec(q.signature), dec(q.pubkey));
  // return the result of next() to accept the connection.
  console.log(result);
  if (result) {
      return next();
  }
  // call next() with an Error if you need to reject the connection.
  next(new Error('Authentication error'));
});

io.listen(3000);