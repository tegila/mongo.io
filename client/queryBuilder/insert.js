let payload = {};
const Insert = () => ({
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
