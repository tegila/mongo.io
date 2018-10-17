/**
 * Query and Projection Operators
 * See {@link https://docs.mongodb.com/manual/reference/operator/query/}
 */
const Find = (transaction) => ({
  /**
   * Comparison Query Operators
   * See {@link https://docs.mongodb.com/manual/reference/operator/query-comparison/}
  **/
  eq: (field, value) => {
    console.log('eq');
    Object.assign(transaction.payload.query, { [field]: value });
    return Find(transaction);
  },
  gt: (field, value) => {
    console.log('gt');
    Object.assign(transaction.payload.query, { [field]: { $gt: value }});
    return Find(transaction);
  },
  gte: (field, value) => {
    console.log('gte');
    Object.assign(transaction.payload.query, { [field]: { $gte: value }});
    return Find(transaction);
  },
  in: (field, value) => {
    console.log('in');
    if (typeof value !== 'object') throw '$in needs an array';
    Object.assign(transaction.payload.query, { [field]: { $in: value }});
    return Find(transaction);
  },
  lt: (field, value) => {
    console.log('lt');
    Object.assign(transaction.payload.query, { [field]: { $lt: value }});
    return Find(transaction);
  },
  lte: (field, value) => {
    console.log('lte');
    Object.assign(transaction.payload.query, { [field]: { $lte: value }});
    return Find(transaction);
  },
  ne: (field, value) => {
    console.log('ne');
    Object.assign(transaction.payload.query, { [field]: { $ne: value }});
    return Find(transaction);
  },
  nin: (field, value) => {
    console.log('nin');
    if (typeof value !== 'object') throw '$nin needs an array';
    Object.assign(transaction.payload.query, { [field]: { $nin: value }});
    return Find(transaction);
  },
  /**
   * Logical Query Operators
   * See {@link https://docs.mongodb.com/manual/reference/operator/query-logical/}
   */
  not: (field, value) => {
    console.log('not');
    Object.assign(transaction.payload.query, { [field]: { $not: value } });
    return Find(transaction);
  },
  /**
   * @returns JSON
   */
  getPayload: () => {
    return transaction;
  }
});

module.exports = Find;
