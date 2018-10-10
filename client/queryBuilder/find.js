let payload = {};

const payload_stringfy = (payload) => {
  return JSON.stringify(payload);
}

const payload_parse = (payload) => {
  return JSON.parse(payload);
}
/**
 * Query and Projection Operators
 * See {@link https://docs.mongodb.com/manual/reference/operator/query/}
 */
const Find = (query) => ({
  /**
   * Comparison Query Operators
   * See {@link https://docs.mongodb.com/manual/reference/operator/query-comparison/}
   */
  eq: (field, value) => {
    console.log('eq');
    payload = Object.assign({}, payload, { [field]: value });
    return Find(query);
  },
  gt: (field, value) => {
    console.log('gt');
    payload = Object.assign({}, payload, { [field]: { $gt: value } });
    return Find(query);
  },
  gte: (field, value) => {
    console.log('gte');
    payload = Object.assign({}, payload, { [field]: { $gte: value } });
    return Find(query);
  },
  in: (field, value) => {
    console.log('in');
    if (typeof value !== 'object') throw '$in needs an array';
    payload = Object.assign({}, payload, { [field]: { $in: value } });
    return Find(query);
  },
  lt: (field, value) => {
    console.log('lt');
    payload = Object.assign({}, payload, { [field]: { $lt: value } });
    return Find(query);
  },
  lte: (field, value) => {
    console.log('lte');
    payload = Object.assign({}, payload, { [field]: { $lte: value } });
    return Find(query);
  },
  ne: (field, value) => {
    console.log('ne');
    payload = Object.assign({}, payload, { [field]: { $ne: value } });
    return Find(query);
  },
  nin: (field, value) => {
    console.log('nin');
    if (typeof value !== 'object') throw '$nin needs an array';
    payload = Object.assign({}, payload, { [field]: { $nin: value } });
    return Find(query);
  },
  /**
   * Logical Query Operators
   * See {@link https://docs.mongodb.com/manual/reference/operator/query-logical/}
   */
  not: (field, value) => {
    console.log('not');
    payload = Object.assign({}, payload, { [field]: { $not: value } });
    return Find(query);
  },
  /**
   * @returns JSON
   */
  toJSON: () => {
    return JSON.stringify(payload);
  },
});

module.exports = Find;
