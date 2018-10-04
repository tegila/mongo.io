let payload = {};
const Find = (query) => ({
  find: (query) => {
    console.log('find');
    payload = Object.assign({}, payload, { action: 'find', payload:query });
    return Find(query);
  },
  findOne: (query) => {
    console.log('findOne');
    payload = Object.assign({}, payload, { action: 'findOne', payload:query });
    return Find(query);
  },
  sort: (query) => {
    console.log('sort');
    payload = Object.assign({}, payload, { action: 'sort', payload:query });
    return Find(query);
  },
  order: (query) => {
    console.log('order');
    payload = Object.assign({}, payload, { action: 'order', payload:query });
    return Find(query);
  },
  limit: (query) => {
    console.log('limit');
    payload = Object.assign({}, payload, { action: 'limit', payload:query });
    return Find(query);
  },
  skip: (query) => {
    console.log('skip');
    payload = Object.assign({}, payload, { action: 'skip', payload:query });
    return Find(query);
  },
  payload: () => {
    return payload;
  }
});

module.exports = Find;
