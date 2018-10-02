let payload = {};
const Insert = (obj) => ({
  insertOne: (obj) => {
    console.log('insertOne');
    payload = Object.assign({}, payload, { data: obj });
    return Insert(obj);
  },
  payload: () => {
    console.log('payload', payload);
    return payload;
  }
});

module.exports = Insert;
