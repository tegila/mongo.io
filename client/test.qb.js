const qb = require('./queryBuilder');

qb("Collection")
  .find({valor: 1})
  .limit(2)
  .sort({ _id: -1 })
  .payload();

  console.log('___________');
