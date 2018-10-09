const qb = require('./queryBuilder');

const query = qb("app/test")
  .select()
  .eq('status', 'active')
  .not('title', { $eq: '/^Kit/' })
  .toJSON();
  
console.log('obj', JSON.parse(query));
