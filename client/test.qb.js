const qb = require('./queryBuilder');

qb("Collection")
  .find({valor: 1})
  .sort({id: -1})
  .skip(10)
  .limit(100);
