let payload = {};
const Update = () => ({
  updateOne: (operator, data) => {
    console.log('updateOne');
    payload = Object.assign({}, payload, { operator: operator, updateOne: data });
    return Update();
  },
  updateMany: (operator, data) => {
    console.log('updateMany');
    payload = Object.assign({}, payload, { operator: operator, updateMany: data });
    return Update();
  },
  replaceOne: (operator, data) => {
    console.log('replaceOne');
    payload = Object.assign({}, payload, { operator: operator, replaceOne: data });
    return Update();
  },
  payload: () => {
    console.log('payload', payload);
    return payload;
  }
});

module.exports = Update;
