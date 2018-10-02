let payload = {};
const Find = (query) => ({
  sort: (sort) => {
    console.log('sort');
    payload = Object.assign({}, payload, { query: query, sort: sort });
    return Find(query);
  },
  order: () => {
    console.log('order');
    return Find(query);
  },
  limit: (limit) => {
    console.log('limit');
    payload = Object.assign({}, payload, { query: query, limit: limit});
    return Find(query);
  },
  skip: (skip) => {
    console.log('skip');
    payload = Object.assign({}, payload, { query: query, skip: skip});
    return Find(query);
  },
  payload: () => {
    console.log('payload', payload);
    return payload;
  }
});

module.exports = Find;
