const qb = require('../../queryBuilder');
const wss = require('../wss');

const payload = qb('app/test').find()
  .not('title', /^Kit/)
  .eq('status', 'active')
  .getPayload();

const transport = wss(
  'http://localhost:3000/',
  '42EvDFt4KTG84dblNQ+Kgj8bv0H4T0+vWMJ0DXTFzLRFM4I06+/eoeOL8J1MbEwUD9Dm4KORNr5QBZDDhlp0ZQ=='
);

transport.whoami()
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
  
console.dir(payload);
