const qb = require('./queryBuilder');

qb("Collection")
  .select()
  .find({valor: 1})
  .sort({ _id: -1 })
  .limit(2)
  .skip(1)
  .payload();
    
  console.log('___________');  
