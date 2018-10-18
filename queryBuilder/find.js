/**
 * Query and Projection Operators
 * See {@link https://docs.mongodb.com/manual/reference/operator/query/}
 */
const Find = (transaction) => {
  return self = {
    /**
     * Comparison Query Operators
     * See {@link https://docs.mongodb.com/manual/reference/operator/query-comparison/}
    **/
    eq: (field, value) => {
      console.log('eq');
      Object.assign(transaction.payload.query, { [field]: value });
      return self;
    },
    gt: (field, value) => {
      console.log('gt');
      Object.assign(transaction.payload.query, { [field]: { $gt: value }});
      return self;
    },
    gte: (field, value) => {
      console.log('gte');
      Object.assign(transaction.payload.query, { [field]: { $gte: value }});
      return self;
    },
    in: (field, value) => {
      console.log('in');
      if (typeof value !== 'object') throw '$in needs an array';
      Object.assign(transaction.payload.query, { [field]: { $in: value }});
      return self;
    },
    lt: (field, value) => {
      console.log('lt');
      Object.assign(transaction.payload.query, { [field]: { $lt: value }});
      return self;
    },
    lte: (field, value) => {
      console.log('lte');
      Object.assign(transaction.payload.query, { [field]: { $lte: value }});
      return self;
    },
    ne: (field, value) => {
      console.log('ne');
      Object.assign(transaction.payload.query, { [field]: { $ne: value }});
      return self;
    },
    nin: (field, value) => {
      console.log('nin');
      if (typeof value !== 'object') throw '$nin needs an array';
      Object.assign(transaction.payload.query, { [field]: { $nin: value }});
      return self;
    },
    /**
     * Logical Query Operators
     * See {@link https://docs.mongodb.com/manual/reference/operator/query-logical/}
     */
    not: (field, value) => {
      console.log('not');
      Object.assign(transaction.payload.query, { [field]: { $not: value } });
      return self;
    },
    /**
     * @returns JSON
     */
    getPayload: () => {
      return transaction;
    }
  }
};

module.exports = Find;
