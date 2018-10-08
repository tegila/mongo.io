const qb = require('./queryBuilder');

const query = qb("app/test")
  .select()
  .not({ title: '/^Kit/' })
  .gte('base_price', 82.90)
  .eq('status', 'active')
  .toJSON();
  
console.log('obj', JSON.parse(query));
