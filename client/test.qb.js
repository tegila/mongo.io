const qb = require('./queryBuilder');

const load = qb("app/test")
  .select()
  .find({valor: 1})
  .sort({id: -1})
  .skip(10)
  .limit(100)
  .payload();

  console.log('load', load);
  
