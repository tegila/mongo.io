const find = require('./find');

module.exports = () => {
  return {
    queryBuilder: (collection) => {
      const load = {
        transaction: {
          collection,
          payload: {}
        }
      }

      if (this instanceof queryBuilder) {
        return this.queryBuilder;
      } else {
        const _current = new queryBuilder();
        _current.transaction = { collection };
        return _current;
      }
    },
    find: (query) => {
      return find(query);
    }
  }
}
