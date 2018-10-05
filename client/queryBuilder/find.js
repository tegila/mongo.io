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
    const key = Object.keys(sort)[0];
    const value = Object.values(sort)[0];
    payload = Object.assign({}, payload, { $sort:{ [key]: value } });
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
  skip: (number) => {
    console.log('skip');
    payload = Object.assign({}, payload, { $skip: number });
    return Find(query);
  },
  payload: () => {
    return JSON.stringify(payload);
  }
});

module.exports = Find;
