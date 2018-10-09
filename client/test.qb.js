const qb = require('./queryBuilder');

const query = qb("app/test")
  .select()
  .not('sold_quantity', { $gt: 5 })
  .toJSON();
  
console.log('obj', JSON.parse(query));
