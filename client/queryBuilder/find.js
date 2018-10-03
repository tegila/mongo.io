let payload = {};
const Find = (query) => ({
  find: (query) => {
    console.log('find');
    const key = Object.keys(query)[0];
    const val = Object.values(query)[0];
    console.log('key', key);
    console.log('val', val);
    payload = Object.assign({}, payload, { query });
    return Find(query);
  },
  findOne: (query) => {
    console.log('findOne');
    payload = Object.assign({}, payload, { query });
    return Find(query);
  },
  sort: (sort) => {
    console.log('sort');
    payload = Object.assign({}, payload, { sort });
    return Find(query);
  },
  order: (order) => {
    console.log('order');
    payload = Object.assign({}, payload, { order });
    return Find(query);
  },
  limit: (limit) => {
    console.log('limit');
    payload = Object.assign({}, payload, { limit});
    return Find(query);
  },
  skip: (skip) => {
    console.log('skip');
    payload = Object.assign({}, payload, { skip});
    return Find(query);
  },
  payload: () => {
    return payload;
  }
});

module.exports = Find;
