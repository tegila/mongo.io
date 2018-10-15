const qb = require('./queryBuilder');

const query = qb()
  .select('app/test')
  .not('title', /^Kit/)
  .eq('status', 'active')
  .getPayload();
  
console.log('obj', query);
