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
  increment: (field, value) => {
    console.log('increment');
    payload = Object.assign({}, payload, { $inc: { [field]: value } });
    return Update();
  },
  min: (field, value) => {
    console.log('min');
    payload = Object.assign({}, payload, { $min: { [field]: value } });
    return Update();
  },
  max: (field, value) => {
    console.log('min');
    payload = Object.assign({}, payload, { $max: { [field]: value } });
    return Update();
  },
  multiplay: (field, value) => {
    console.log('multiplay');
    payload = Object.assign({}, payload, { $mu: { [field]: value } });
    return Update();
  },
  rename: (field, value) => {
    console.log('rename');
    payload = Object.assign({}, payload, { $rename: { [field]: value } });
    return Update();
  },
  set: (field, value) => {
    console.log('set');
    payload = Object.assign({}, payload, { $set: { [field]: value } });
    return Update();
  },
  toJSON: () => {
    return JSON.stringify(payload);
  }
});

module.exports = Update;
