const qb = require('./queryBuilder');

const query = qb("app/test")
  .select()
  .nin('qty', [25, 100])
  .toJSON();
  
console.log('obj', JSON.parse(query));
