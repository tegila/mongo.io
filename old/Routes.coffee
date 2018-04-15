MongoPool = require "./MongoPool.coffee"
ObjectID = require('mongodb').ObjectID

# HTTP Verbs 
#
# Fetch the entire collection - <Like select * from ...>
# @param {String} database - name of output database
# @param {String} collection - where to put your values
# @returns {Json} items - all the items inside the collection 
module.exports = (app) ->
  # Get All
  app.get '/:database/:collection', (req, res) ->
    MongoPool(req.params["database"]).getConnection (db) ->
      col = db.collection req.params["collection"]
      _skip = parseInt(req.params["skip"], 10) || 0
      _limit = parseInt(req.params["limit"], 10) || 10
      col.find().sort({_id: -1}).skip(_skip).limit(_limit).toArray (err, items) ->
        console.log items
        res.json items

  # Get by ID
  app.get '/:database/:collection/:id', (req, res) ->
    MongoPool(req.params["database"]).getConnection (db) ->
      col = db.collection req.params["collection"]
      id = new ObjectID req.params["id"]
      col.find({'_id': id}).toArray (err, items) ->
        console.log items
        res.json items

  # PAGINATE
  app.post '/:database/:collection/paginate', (req, res) ->
    MongoPool(req.params["database"]).getConnection (db) ->
      col = db.collection req.params["collection"]
      _sample = req.params["sample"] || {}
      _skip = parseInt(req.params["skip"], 10) || 0
      _limit = parseInt(req.params["limit"], 10) || 10
      _sort = req.params["sort"] || { _id: -1 }
      col.find(_sample).sort(_sort).skip(_skip).limit(_limit).toArray (err, items) ->
        console.log err
        res.json items

  # SAVE
  app.post '/:database/:collection', (req, res) ->
    MongoPool(req.params["database"]).getConnection (db) ->
      col = db.collection req.params["collection"]
      col.save req.body, {safe:true}, (err, result) ->
          console.log result.ops
          res.json result.ops

  # UPDATE
  app.put '/:database/:collection/:id', (req, res) ->
    MongoPool(req.params["database"]).getConnection (db) ->
      col = db.collection req.params["collection"]
      col.find({'_id': req.params["id"]}).toArray (err, items) ->
        console.log items
        col.save req.body, {safe:true}, (err, result) ->
          console.log result.ops
          res.json result.ops

  # DELETE
  app.delete '/:database/:collection', (req, res) ->
    console.log req.body["_id"]
    MongoPool(req.params["database"]).getConnection (db) ->
      col = db.collection req.params["collection"]
      col.remove req.body, (err, results) ->
        console.log results.ops
        res.json results.ops

  # AGGREGATE
  app.post '/:database/:collection/aggregate', (req, res) ->
    console.log req.body
    MongoPool(req.params "database").getConnection (db) ->
      col = db.collection req.params["collection"]
      col.aggregate req.body, (err, items) ->
        res.json items