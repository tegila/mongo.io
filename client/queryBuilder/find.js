function Find(query) {
  if (this instanceof Find) {
    console.log('instanceOf Find');
    return this;
  } else {
    console.log('new Find');
    const _current = new Find();
    _current.payload = { query };
    return _current;
  }  
}

Find.prototype.sort = (sort) => {
  console.log('sort');
  this.payload = Object.assign({}, this.payload, { sort });
  console.dir(this);
  return this;
};

Find.prototype.order = (order) => {
  console.log('order');
  this.payload = { order };
  return this;
};

Find.prototype.limit = (limit) => {
  console.log('limit');
  this.payload = { limit };
  return this;
};

Find.prototype.skip = (skip) => {
  console.log('skip');
  this.payload = { skip };
  return this;
};

Find.prototype.getPayload = () => {
  console.log('payload');
  return this.payload;
};

module.exports = Find;
