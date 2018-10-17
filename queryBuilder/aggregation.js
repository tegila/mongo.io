let payload = {};

const payload_stringfy = (payload) => {
  return JSON.stringify(payload);
}

const payload_parse = (payload) => {
  return JSON.parse(payload);
}

/**
 * Aggregation Pipeline Stages
 * See {@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/}
 */
const Aggregation = () => ({
  sort: (sort) => {
    console.log('sort');
    const field = Object.keys(sort)[0];
    const value = Object.values(sort)[0];
    payload = Object.assign({}, payload, { $sort:{ [field]: value } });
    return Find(query);
  },
  limit: (number) => {
    console.log('limit');
    payload = Object.assign({}, payload, { $limit: number });
    return Find(query);
  },
  skip: (number) => {
    console.log('skip');
    payload = Object.assign({}, payload, { $skip: number });
    return Find(query);
  },
  toJSON: () => {
    return JSON.stringify(payload);
  }
});