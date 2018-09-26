
export default (collection) => {
  const load = { 
    transaction: {
      collection,
      payload: {}
    }
  };

  this.prototype.order = (order) => {
    Object.assign(load.payload, { order });
    return this;
  };
  
  this.prototype.find = (query) => {
    Object.assign(load.payload, { query });
    return this;
  };

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