const find = require('./find');
const insert = require('./insert');
const remove = require('./remove');
const update = require('./update');

let load = {
  transaction: {
    payload: {}
  }
};

function queryBuilder(collection) {
  if (this instanceof queryBuilder) {
    console.log('instanceOf QueryBuilder');
    load.transaction = { collection };
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
    load.transaction.payload = find();
    return find();
  };

  queryBuilder.prototype.insert = () => {
    return insert();
  };

  queryBuilder.prototype.update = () => {
    return update();
  }

module.exports = queryBuilder;