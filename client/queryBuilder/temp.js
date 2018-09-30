
// chainnable methods


const Find = () => {
  Find.prototype.query()
  Find.prototype.sort()
  Find.prototype.skip()
  Find.prototype.limit()
}

const Remove = () => {
  Remove.prototype.remove()
}

const Update = (query) => {
  const globalUpdateObject = Object.assign({}, { query });
  Update.prototype.isUpset = () => {
    globalUpdateObject.isUpset = true;
    return this;
  }

  return this;
}

const queryBuilder = () => {
  queryBuilder.prototype.find = () => {
    return Find;
  }
}
