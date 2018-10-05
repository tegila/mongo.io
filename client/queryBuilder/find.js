let payload = {};

const Find = (query) => ({
  sort: (sort) => {
    console.log('sort');
    const key = Object.keys(sort)[0];
    const value = Object.values(sort)[0];
    payload = Object.assign({}, payload, { $sort:{ [key]: value } });
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
  payload: () => {
    return JSON.stringify(payload);
  }
});

module.exports = Find;
