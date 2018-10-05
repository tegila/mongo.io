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
  increment: (obj) => {
    console.log('increment');
    const field = Object.keys(obj)[0];
    const value = Object.values(obj)[0];
    payload = Object.assign({}, payload, { $inc: { [field]: value } });
    return Update();
  },
  min: (obj) => {
    console.log('min');
    const field = Object.keys(obj)[0];
    const value = Object.values(obj)[0];
    payload = Object.assign({}, payload, { $min: { [field]: value } });
    return Update();
  },
  max: (obj) => {
    console.log('min');
    const field = Object.keys(obj)[0];
    const value = Object.values(obj)[0];
    payload = Object.assign({}, payload, { $max: { [field]: value } });
    return Update();
  },
  multiplay: (field, value) => {
    console.log('multiplay');
    payload = Object.assign({}, payload, { $mu: { [field]: value } });
    return Update();
  },
  toJSON: () => {
    return payload;
  }
});

module.exports = Update;
