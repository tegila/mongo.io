const fs = require('fs');
const path = require('path');

// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('babel-register')({
  presets: [ 'env' ]
});

const socket = require('./socket');
const mongo = require('./mongo');

const options = {
  key: fs.readFileSync(path.resolve(__dirname, './sample/cert.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, './sample/cert.crt'))
};
const port = process.argv[3] || 3000;

const url = `mongodb://mongo:27017/`

mongo.enable(url, () => {
  socket.enable(options, port);
});
