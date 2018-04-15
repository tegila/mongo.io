io = require("socket.io")(3000)
router = require("socket.io-events")()

chai = require('chai')
expect = chai.expect

mongo = require('mongodb')
MongoClient = mongo.MongoClient

db = null 

## TODO: SAVE / UPDATE
router.on "save *", (sock, args, next) ->
  [action, dbName, collection] = args.shift().split(" ")
  obj = do args.shift

  db.db dbName
  coll = db.collection collection
  coll.save obj, (err, result) ->
    console.log "save event", action, dbName, collection, obj
    sock.emit collection, result.ops
    do next

## TODO: REMOVE
router.on "remove *", (sock, args, next) ->
  [action, dbName, collection] = args.shift().split(" ")
  obj = do args.shift
  
  db.db dbName
  coll = db.collection collection
  coll.remove obj, (err, results) ->
    console.log "remove event", action, dbName, collection, obj
    sock.emit collection, results
    do next

## TODO: QUERY 
router.on "*", (sock, args, next) ->
  [dbName, collection] = args.shift().split(" ")
  sample = do args.shift || {}

  db.db dbName
  coll = db.collection collection
  coll.find(sample).toArray (err, items) ->
    console.log "* event", dbName, collection, sample
    sock.emit collection, items
    do next


url = "mongodb://192.168.1.112:27017/test"
MongoClient.connect url, (err, connection) ->
  expect(connection).not.to.be.null
  db = connection
  
  console.log "Server in production mode"
  io.enable "browser client minification" # send minified client
  io.enable "browser client etag" # apply etag caching logic based on version number
  io.enable "browser client gzip" # the file
  io.set "log level", 1 # logging
  io.set "transports", [ # all transports (optional if you want flashsocket)
    "websocket"
    "flashsocket"
    "htmlfile"
    "xhr-polling"
    "jsonp-polling"
  ]

  io.set "origins", "*:*" 
  io.use router