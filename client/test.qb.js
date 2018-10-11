const qb = require('./queryBuilder');

const query = qb("app/test")
  .select()
  .not('title', /^Kit/)
  .eq('status', 'active')
  .toJSON();
  
console.log('obj', query);
