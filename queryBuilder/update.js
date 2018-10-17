let payload = {};

const Update = () => ({
  /** Field Update Operators */
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
  setOnInsert: (field, value) => {
    console.log('setOnInsert');
    payload = Object.assign({}, payload, { $setOnInsert: { [field]: value } }, { upsert: true });
    return Update();
  },
  unset: (field) => {
    console.log('unset');
    payload = Object.assign({}, payload, { $unset: { [field]: '' } });
    return Update();
  },
  /** Array Update Operators */
  addToSet: (field, value) => {
    console.log('addToSet');
    payload = Object.assign({}, payload, { $addToSet: { [field]: value } });
    return Update();
  },
  pop: (obj) => {
    console.log('pop');
    const field = Object.keys(obj).shift();
    const value = Object.values(obj).shift();
    payload = Object.assign({}, payload, { $pop: { [field]: value } });
    return Update();
  },
  pull: (obj) => {
    console.log('pull');
    const field = Object.keys(obj).shift();
    const value = Object.values(obj).shift();
    payload = Object.assign({}, payload, { $pull: { [field]: value } });
    return Update();
  },
  toJSON: () => {
    return JSON.stringify(payload);
  }
});

module.exports = Update;
