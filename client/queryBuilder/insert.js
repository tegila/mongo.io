let payload = {};
const Insert = (data) => ({
  insertOne: (data) => {
    console.log('insertOne');
    payload = Object.assign({}, payload, { insertOne: data });
    return Insert(data);
  },
  insertMany: (data) => {
    console.log('insertMany');
    payload = Object.assign({}, payload, { insertMany: data });
    return Insert(data);
  },
  payload: () => {
    console.log('payload', payload);
    return payload;
  }
});

module.exports = Insert;
