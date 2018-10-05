let payload = {};
const Find = (query) => ({
  find: (find) => {
    console.log('find');
    payload = Object.assign({}, payload, { find });
    return Find(query);
  },
  findOne: (findOne) => {
    console.log('findOne');
    payload = Object.assign({}, payload, { findOne });
    return Find(query);
  },
  sort: (sort) => {
    console.log('sort');
    payload = Object.assign({}, payload, { $sort:{ sort } });
    return Find(query);
  },
  order: (order) => {
    console.log('order');
    payload = Object.assign({}, payload, { order });
    return Find(query);
  },
  limit: (limit) => {
    console.log('limit');
    payload = Object.assign({}, payload, { limit });
    return Find(query);
  },
  skip: (skip) => {
    console.log('skip');
    payload = Object.assign({}, payload, { skip });
    return Find(query);
  },
  payload: () => {
    return JSON.stringify(payload);
  }
});

module.exports = Find;
