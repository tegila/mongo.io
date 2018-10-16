const qb = require('./queryBuilder');

const query = qb('app/test').find()
  .not('title', /^Kit/)
  .eq('status', 'active')
  .getPayload();
  
console.dir(query);
