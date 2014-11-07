# Mongo Connection
MongoClient = require('mongodb').MongoClient
ObjectID = require('mongodb').ObjectID

MongoPool = (name) ->
  return MongoPool::_singletonInstance if MongoPool::_singletonInstance
  MongoPool::_singletonInstance = this
  
  connection = null

  @getConnection = (callback) ->
    return callback @connection if @connection
    url = "mongodb://192.168.1.112:27017/#{name}"
    MongoClient.connect url, (err, db) ->
      callback @connection = db

  @getDatabase = (name, callback) ->
    return @connection.db(name) if @connection
    @getConnection (conn) ->
      callback conn.db(name)
  
  return this

exports = module.exports = MongoPool