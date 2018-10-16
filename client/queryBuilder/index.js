const find = require('./find');
const insert = require('./insert');
const remove = require('./remove');
const update = require('./update');

const queryBuilder = (target) => {
  const [db, collection] = target.split("/");
  const transaction = {
    db,
    collection,
    payload: {}
  };

  return {
    remove: (order) => {

    },  
    find: (query) => find({
      ...transaction,
      payload: {
        type: 'query',
        query: query || {}
      }
    })
  }
};

module.exports = queryBuilder;