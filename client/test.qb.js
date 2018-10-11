const qb = require('./queryBuilder');

const query = qb("app/test")
  .select()
  .not('title', /^Kit/)
  .eq('status', 'active')
  .getPayload();
  
console.log('obj', query);
