config = require './config'

## Mongo.DB Related ##
MongoClient = require('mongodb').MongoClient

# Mongo Connection
MongoPool = (name) ->
  return MongoPool::[name] if MongoPool::[name]
  MongoPool::[name] = this
  
  connection = null

  @getConnection = (callback) ->
    return callback @connection if @connection
    url = "mongodb://#{config.mongo.url}:#{config.mongo.port}/#{name}"
    MongoClient.connect url, (err, db) ->
      callback @connection = db

  return this

module.exports = MongoPool