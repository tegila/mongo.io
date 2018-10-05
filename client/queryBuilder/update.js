let payload = {};

const Update = () => ({
  currentDate: (value) => {
    console.log('currentDate');
    if (typeof value === 'boolean' && value) {
      payload = Object.assign({}, payload, { $currentDate: value });
    } else {
      payload = Object.assign({}, payload, {
        $currentDate: { $type: value.toLowerCase() }
      });
    }
    return Update();
  },
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
  toJSON: () => {
    return payload;
  }
});

module.exports = Update;
