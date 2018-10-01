const find = require('./find');
//const remove = require('./remove');

const load = { 
  transaction: {
    collection,
    payload: {}
  }
};
const queryBuilder = (collection) => {
  const load = { 
    transaction: {
      collection,
      payload: {}
    }
  };



  if (this instanceof queryBuilder) {
    console.log('instanceOf');
    return this.queryBuilder;
  } else {
    console.log('new');
    const _current = new queryBuilder();
    _current.transaction = { collection };
    return _current;
  }  
};

  queryBuilder.prototype.remove = (order) => {
    Object.assign(load.payload, { order });
    return this;
  };
  
  queryBuilder.prototype.find = (query) => {
    return find(query);
  };
module.exports = queryBuilder;