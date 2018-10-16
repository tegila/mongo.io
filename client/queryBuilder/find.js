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
    transaction.payload = Object.assign({}, transaction.payload, { [field]: { $gt: value } });
    return Find(transaction);
  },
  gte: (field, value) => {
    console.log('gte');
    payload = Object.assign({}, payload, {
      payload: Object.assign({}, payload.payload, { [field]: { $gte: value } }),
    });
    return Find(transaction);
  },
  in: (field, value) => {
    console.log('in');
    if (typeof value !== 'object') throw '$in needs an array';
    payload = Object.assign({}, payload, {
      payload: Object.assign({}, payload.payload, { [field]: { $in: value } }),
    });
    return Find(transaction);
  },
  lt: (field, value) => {
    console.log('lt');
    payload = Object.assign({}, payload, {
      payload: Object.assign({}, payload.payload, { [field]: { $lt: value } }),
    });
    return Find(transaction);
  },
  lte: (field, value) => {
    console.log('lte');
    payload = Object.assign({}, payload, {
      payload: Object.assign({}, payload.payload, { [field]: { $lte: value } }),
    });
    return Find(transaction);
  },
  ne: (field, value) => {
    console.log('ne');
    payload = Object.assign({}, payload, {
      payload: Object.assign({}, payload.payload, { [field]: { $ne: value } }),
    });
    return Find(transaction);
  },
  nin: (field, value) => {
    console.log('nin');
    if (typeof value !== 'object') throw '$nin needs an array';
    payload = Object.assign({}, payload, {
      payload: Object.assign({}, payload.payload, { [field]: { $nin: value } }),
    });
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
