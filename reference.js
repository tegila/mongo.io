module.reference = {
  transaction: {
    action: ["find", "findone", "remove", "insert", "update"],
    collection: String,
    payload: {
      query: Object,
      order: Object,
      limit: Number,
      skip: Number
    }
  },
  signature: "sign(sha256(transaction, nonce++))"
}