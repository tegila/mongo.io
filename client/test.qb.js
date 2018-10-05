const qb = require('./queryBuilder');

const query = qb("app/test")
                  .update()
                  .currentDate(true)
                  .increment('quantity', 2)
                  .multiplay('quantity', 2)
                  .rename('quantity', 'amount')
                  .set('amount', 100)
                  .setOnInsert('defaultQty', 100)
                  .unset('user')
                  .toJSON();

console.log('update', query);
