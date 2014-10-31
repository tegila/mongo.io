fs = require('fs')
path = require 'path'
util = require 'util'
_ = require 'underscore'

express = require 'express'
app = do express
server = require('http').Server(app)
io = require('socket.io')(server)

logger = require("morgan")
methodOverride = require("method-override")
session = require("express-session")
bodyParser = require("body-parser")
multer = require("multer")
errorHandler = require("errorhandler")

# all environments
process.execPath = 'coffee'
env = process.env.NODE_ENV || 'development'
port = process.env.PORT || 3000
host = process.env.HOST || null

# express http verb setup
app.set "port", process.env.PORT or 3000
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
app.get '/:dbId/:colId', (req, res) ->
  MongoPool(req.param "dbId").getConnection (db) ->
    col = db.collection req.param "colId"
    col.find({}).toArray (err, items) ->
      #console.log items
      res.json items

app.get '/:dbId/:colId/:id', (req, res) ->
  MongoPool(req.param "dbId").getConnection (db) ->
    col = db.collection req.param "colId"
    id = new ObjectID req.param("id")
    col.find({'_id': id}).toArray (err, items) ->
      #console.log items
      res.json items

app.post '/:dbId/:colId/save', (req, res) ->
  MongoPool(req.param "dbId").getConnection (db) ->
    col = db.collection req.param "colId"
    col.save req.body, (err, result) ->
      console.log result.ops
      res.json result.ops

app.post '/:dbId/:colId/remove', (req, res) ->
  console.log req.body._id
  MongoPool(req.param "dbId").getConnection (db) ->
    col = db.collection req.param "colId"
    col.remove req.body, (err, results) ->
      console.log results
      res.json results

on_listen = ->
  hostout = if host then host else '*'
  console.log "Started at http://#{hostout}:#{port} [production]"

if host
  server.listen port, host, on_listen
else
  server.listen port, on_listen
