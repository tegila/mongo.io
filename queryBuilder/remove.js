let payload = {};
const Delete = () => ({
  deleteOne: (query) => {
    console.log('deleteOne');
    payload = Object.assign({}, payload, { query: query });
    return Delete();
  },
  deleteMany: (query) => {
    console.log('deleteMany');
    payload = Object.assign({}, payload, { query: query });
    return Delete();
  },
  payload: () => {
    console.log('payload', payload);
    return payload;
  }
});

module.exports = Delete;
