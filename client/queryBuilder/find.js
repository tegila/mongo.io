let payload = {};

/**
 * Query and Projection Operators
 * See {@link https://docs.mongodb.com/manual/reference/operator/query/}
 */
const Find = (collection) => {
  payload = Object.assign({}, payload, { collection: collection });
  return {
    /**
     * Comparison Query Operators
     * See {@link https://docs.mongodb.com/manual/reference/operator/query-comparison/}
     */
    eq: (field, value) => {
      console.log('eq');
      payload = Object.assign({}, payload, {
        payload: Object.assign({}, payload.payload,  { [field]: value }),
      });
      return Find(collection);
    },
    gt: (field, value) => {
      console.log('gt');
      payload = Object.assign({}, payload, {
        payload: Object.assign({}, payload.payload, { [field]: { $gt: value } }),
      });
      return Find(collection);
    },
    gte: (field, value) => {
      console.log('gte');
      payload = Object.assign({}, payload, {
        payload: Object.assign({}, payload.payload, { [field]: { $gte: value } }),
      });
      return Find(collection);
    },
    in: (field, value) => {
      console.log('in');
      if (typeof value !== 'object') throw '$in needs an array';
      payload = Object.assign({}, payload, {
        payload: Object.assign({}, payload.payload, { [field]: { $in: value } }),
      });
      return Find(collection);
    },
    lt: (field, value) => {
      console.log('lt');
      payload = Object.assign({}, payload, {
        payload: Object.assign({}, payload.payload, { [field]: { $lt: value } }),
      });
      return Find(collection);
    },
    lte: (field, value) => {
      console.log('lte');
      payload = Object.assign({}, payload, {
        payload: Object.assign({}, payload.payload, { [field]: { $lte: value } }),
      });
      return Find(collection);
    },
    ne: (field, value) => {
      console.log('ne');
      payload = Object.assign({}, payload, {
        payload: Object.assign({}, payload.payload, { [field]: { $ne: value } }),
      });
      return Find(collection);
    },
    nin: (field, value) => {
      console.log('nin');
      if (typeof value !== 'object') throw '$nin needs an array';
      payload = Object.assign({}, payload, {
        payload: Object.assign({}, payload.payload, { [field]: { $nin: value } }),
      });
      return Find(collection);
    },
    /**
     * Logical Query Operators
     * See {@link https://docs.mongodb.com/manual/reference/operator/query-logical/}
     */
    not: (field, value) => {
      console.log('not');
      payload = Object.assign({}, payload, {
        payload: Object.assign({}, payload.payload, { [field]: { $not: value } }),
      });
      return Find(collection);
    },
    /**
     * @returns JSON
     */
    getPayload: () => {
      return payload;
    },
  }
};

module.exports = Find;
