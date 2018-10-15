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
    return new queryBuilder();
  }
};

  queryBuilder.prototype.remove = () => {
    return remove();
  };
  
  queryBuilder.prototype.select = (collection) => {
    return find(collection);
  };

  queryBuilder.prototype.insert = () => {
    return insert();
  };

  queryBuilder.prototype.update = () => {
    return update();
  }

module.exports = queryBuilder;