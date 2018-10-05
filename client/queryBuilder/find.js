let payload = {};

const Find = (query) => ({
  /** Query Selectors - Comparison */
  eq: (obj) => {
    console.log('eq');
    const field = Object.keys(obj)[0];
    const value = Object.values(obj)[0];
    payload = Object.assign({}, payload, { [field]: { $eq: value } });
    return Find(query);
  },
  gt: (obj) => {
    console.log('gt');
    const field = Object.keys(obj)[0];
    const value = Object.values(obj)[0];
    payload = Object.assign({}, payload, { [field]: { $gt: value } });
    return Find(query);
  },
  gte: (obj) => {
    console.log('gte');
    const field = Object.keys(obj)[0];
    const value = Object.values(obj)[0];
    payload = Object.assign({}, payload, { [field]: { $gte: value } });
    return Find(query);
  },
  lt: (obj) => {
    console.log('lt');
    const field = Object.keys(obj)[0];
    const value = Object.values(obj)[0];
    payload = Object.assign({}, payload, { [field]: { $lt: value } });
    return Find(query);
  },
  lte: (obj) => {
    console.log('lte');
    const field = Object.keys(obj)[0];
    const value = Object.values(obj)[0];
    payload = Object.assign({}, payload, { [field]: { $lte: value } });
    return Find(query);
  },
  ne: (obj) => {
    console.log('ne');
    const field = Object.keys(obj)[0];
    const value = Object.values(obj)[0];
    payload = Object.assign({}, payload, { [field]: { $ne: value } });
    return Find(query);
  },
  nin: (obj) => {
    console.log('nin');
    const field = Object.keys(obj)[0];
    const value = Object.values(obj)[0];
    payload = Object.assign({}, payload, { [field]: { $nin: value } });
    return Find(query);
  },
  in: (obj) => {
    console.log('in');
    const field = Object.keys(obj)[0];
    const value = Object.values(obj)[0];
    payload = Object.assign({}, payload, { [field]: { $in: value } });
    return Find(query);
  },
  sort: (sort) => {
    console.log('sort');
    const field = Object.keys(sort)[0];
    const value = Object.values(sort)[0];
    payload = Object.assign({}, payload, { $sort:{ [field]: value } });
    return Find(query);
  },
  limit: (number) => {
    console.log('limit');
    payload = Object.assign({}, payload, { $limit: number });
    return Find(query);
  },
  skip: (number) => {
    console.log('skip');
    payload = Object.assign({}, payload, { $skip: number });
    return Find(query);
  },
  toJSON: () => {
    return JSON.stringify(payload);
  }
});

module.exports = Find;
