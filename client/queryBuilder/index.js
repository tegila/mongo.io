const find = require('./find');
//const remove = require('./remove');

function queryBuilder(collection) {
  this.load = {
    transaction: {
      collection,
      payload: {}
    }
  };

  if (this instanceof queryBuilder) {
    console.log('instanceOf QueryBuilder');
    return this;
  } else {
    console.log('new QueryBuilder');
    const _current = new queryBuilder(collection);
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