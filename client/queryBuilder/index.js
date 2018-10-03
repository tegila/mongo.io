const find = require('./find');
const insert = require('./insert');
const remove = require('./remove');

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

  queryBuilder.prototype.remove = () => {
    return remove();
  };
  
  queryBuilder.prototype.select = () => {
    return find();
  };

  queryBuilder.prototype.insert = () => {
    return insert();
  };

module.exports = queryBuilder;