fs = require('fs')
path = require 'path'
util = require 'util'
_ = require 'underscore'

express = require 'express'
app = do express

logger = require("morgan")
methodOverride = require("method-override")
session = require("express-session")
bodyParser = require("body-parser")
multer = require("multer")
errorHandler = require("errorhandler")

# express http verb setup
app.use logger("dev")
app.use methodOverride()
app.use session(
  resave: true
  saveUninitialized: true
  secret: "IAE/dha98123yja8"
)
app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: true)
app.use multer()

app.use errorHandler
  dumpExceptions: true
  showStack: true

# Mongo Connection
MongoClient = require('mongodb').MongoClient
ObjectID = require('mongodb').ObjectID

MongoPool = (name) ->
  return MongoPool::[name] if MongoPool::[name]
  MongoPool::[name] = this
  
  connection = null

  @getConnection = (callback) ->
    return callback @connection if @connection
    url = "mongodb://192.168.1.112:27017/#{name}"
    MongoClient.connect url, (err, db) ->
      callback @connection = db

  return this

# HTTP Verbs 
#
# Fetch the entire collection - <Like select * from ...>
# @param {String} database - name of output database
# @param {String} collection - where to put your values
# @returns {Json} items - all the items inside the collection 
app.post '/:dbId/:colId', (req, res) ->
  MongoPool(req.param "dbId").getConnection (db) ->
    col = db.collection req.param "colId"
    _sample = req.param("sample") || {}
    _skip = parseInt(req.param("skip"), 10) || 0
    _limit = parseInt(req.param("limit"), 10) || 10
    col.find(_sample).skip(_skip).limit(_limit).toArray (err, items) ->
      console.log items
      res.json items

app.get '/:dbId/:colId/:id', (req, res) ->
  MongoPool(req.param "dbId").getConnection (db) ->
    col = db.collection req.param "colId"
    id = new ObjectID req.param("id")
    col.find({'_id': id}).toArray (err, items) ->
      console.log items
      res.json items

app.post '/:dbId/:colId/:id', (req, res) ->
  MongoPool(req.param "dbId").getConnection (db) ->
    col = db.collection req.param "colId"
    col.find({'_id': req.params.id}).toArray (err, items) ->
      console.log items
      col.save req.body, {safe:true}, (err, result) ->
        console.log result.ops
        res.json result.ops

app.del '/:dbId/:colId', (req, res) ->
  console.log req.body._id
  MongoPool(req.param "dbId").getConnection (db) ->
    col = db.collection req.param "colId"
    col.remove req.body, (err, results) ->
      console.log results.ops
      res.json results.ops

# all environments
env = process.env.NODE_ENV || 'development'
port = process.env.PORT || 3000
host = process.env.HOST || null

on_listen = ->
  hostout = if host then host else '*'
  console.log "Started at http://#{hostout}:#{port} [#{process.env.NODE_ENV}]"

if host
  app.listen port, host, on_listen
else
  app.listen port, on_listen