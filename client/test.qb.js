const qb = require('./queryBuilder');

const query = qb("app/test")
  .select()
  .not({ 'title':'/^Kit/' })
  .toJSON();

console.log('update', query);
