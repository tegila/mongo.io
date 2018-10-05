let payload = {};

const Find = (query) => ({
  /** Query Selectors - Comparison */
  eq: (obj) => {
    console.log('obj');
    const field = Object.keys(obj)[0];
    const value = Object.values(obj)[0];
    payload = Object.assign({}, payload, { [field]: { $eq: value } });
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
