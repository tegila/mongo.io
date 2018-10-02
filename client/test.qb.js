const qb = require('./queryBuilder');

qb("Collection")
  .select()
  .findOne({ qty: { $gt: 4 } })
  .sort({ _id: -1 })
  .limit(2)
  .skip(1)
  .payload();
    