let payload = {};
const Find = (query) => ({
  find: (query) => {
    console.log('find');
    payload = Object.assign({}, payload, { find: query });
    return Find(query);
  },
  findOne: (query) => {
    console.log('findOne');
    payload = Object.assign({}, payload, { findOne: query });
    return Find(query);
  },
  sort: (sort) => {
    console.log('sort');
    payload = Object.assign({}, payload, { sort: sort });
    return Find(query);
  },
  order: (order) => {
    console.log('order');
    payload = Object.assign({}, payload, { order: order });
    return Find(query);
  },
  limit: (limit) => {
    console.log('limit');
    payload = Object.assign({}, payload, { limit: limit});
    return Find(query);
  },
  skip: (skip) => {
    console.log('skip');
    payload = Object.assign({}, payload, { skip: skip});
    return Find(query);
  },
  payload: () => {
    console.log('payload', payload);
    return payload;
  }
});

module.exports = Find;
