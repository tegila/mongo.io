const find = require('./find');
const insert = require('./insert');
const remove = require('./remove');
const update = require('./update');

function queryBuilder() {
  if (this instanceof queryBuilder) {
    console.log('instanceOf QueryBuilder');
    return this;
  } else {
    console.log('new QueryBuilder');
    const _current = new queryBuilder();
    return _current;
  }
};

  queryBuilder.prototype.remove = () => {
    return remove();
  };
  
  queryBuilder.prototype.find = () => {
    return find();
  };

  queryBuilder.prototype.insert = () => {
    return insert();
  };

  queryBuilder.prototype.update = () => {
    return update();
  }

module.exports = queryBuilder;