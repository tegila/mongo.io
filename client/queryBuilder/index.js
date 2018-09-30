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
<<<<<<< HEAD

  return this;
};

export const find = query
action: ["find", "findone", "remove", "insert", "update"],
payload: {
  query: Object,
  order: Object,
  limit: Number,
  skip: Number
}



new queryBuilder().find({ id: _id }).order({ id: -1 }).skip(300).limit(300)
=======
module.exports = queryBuilder;
>>>>>>> cdfb6ca1f7f512bb04a0b12f9abdfe6021181075
