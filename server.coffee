express = require 'express'
app = do express

logger = require("morgan")
methodOverride = require("method-override")
session = require("express-session")
bodyParser = require("body-parser")
multer = require("multer")
errorHandler = require("errorhandler")

config = require './config'

# express http verb setup
app.use logger("dev")
app.use methodOverride()
app.use session(
  resave: true
  saveUninitialized: true
  secret: config.express.secret
)
app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: true)
app.use multer()

app.use errorHandler
  dumpExceptions: true
  showStack: true

app.use (req, res, next) ->
  deepIterate = (obj) ->
    for k, v of obj
      console.log k, v
      if v isnt null and typeof v is 'object'
        deepIterate(v)
      else if typeof v is 'string'
        if v.match /^(\d){4}-(\d){2}-(\d){2}T(\d){2}:(\d){2}:(\d){2}.(\d){3}Z$/i
          obj[k] = new Date Date.parse(v)
  deepIterate req.body
  do next


# Mongo Connection
MongoClient = require('mongodb').MongoClient
ObjectID = require('mongodb').ObjectID

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

# HTTP Verbs 
#
# Fetch the entire collection - <Like select * from ...>
# @param {String} database - name of output database
# @param {String} collection - where to put your values
# @returns {Json} items - all the items inside the collection 

# Get All
app.get '/:database/:collection', (req, res) ->
  MongoPool(req.param "database").getConnection (db) ->
    col = db.collection req.param "collection"
    _skip = parseInt(req.param("skip"), 10) || 0
    _limit = parseInt(req.param("limit"), 10) || 10
    col.find().sort({_id: -1}).skip(_skip).limit(_limit).toArray (err, items) ->
      console.log items
      res.json items

# Get by ID
app.get '/:database/:collection/:id', (req, res) ->
  MongoPool(req.param "database").getConnection (db) ->
    col = db.collection req.param "collection"
    id = new ObjectID req.param("id")
    col.find({'_id': id}).toArray (err, items) ->
      console.log items
      res.json items

# PAGINATE
app.post '/:database/:collection', (req, res) ->
  MongoPool(req.param "database").getConnection (db) ->
    col = db.collection req.param "collection"
    _sample = req.param("sample") || {}
    _skip = parseInt(req.param("skip"), 10) || 0
    _limit = parseInt(req.param("limit"), 10) || 10
    _sort = req.param("sort") || { _id: -1 }
    col.find(_sample).sort(_sort).skip(_skip).limit(_limit).toArray (err, items) ->
      console.log items
      res.json items

# SAVE
app.put '/:database/:collection/:id', (req, res) ->
  MongoPool(req.param "database").getConnection (db) ->
    col = db.collection req.param "collection"
    col.find({'_id': req.params.id}).toArray (err, items) ->
      console.log items
      col.save req.body, {safe:true}, (err, result) ->
        console.log result.ops
        res.json result.ops

# DELETE
app.delete '/:database/:collection', (req, res) ->
  console.log req.body._id
  MongoPool(req.param "database").getConnection (db) ->
    col = db.collection req.param "collection"
    col.remove req.body, (err, results) ->
      console.log results.ops
      res.json results.ops

# AGGREGATE
app.post '/:database/:collection/aggregate', (req, res) ->
  console.log req.body
  MongoPool(req.param "database").getConnection (db) ->
    col = db.collection req.param "collection"
    col.aggregate req.body, (err, items) ->
      res.json items

on_listen = ->
  hostout = if config.express.host then config.express.host else '*'
  console.log "Started at http://#{hostout}:#{config.express.port} [#{config.express.env}]"

if config.express.host
  app.listen config.express.port, config.express.host, on_listen
else
  app.listen config.express.port, on_listen