MongoClient = require('mongodb').MongoClient
assert = require('assert')

MongoDB = ->
  this = new Object()

  MongoClient.connect 'mongodb://192.168.1.112:27017/test', (err, db) ->
    assert.ifError err
    # Use the admin database for the operation
    adminDb = do db.admin
    assert.notEqual adminDb, null, "database: #{adminDb}, doesn\'t exists"

    chooseDb = db.db("test")
    assert.notEqual adminDb, null, "database: #{chooseDb}, doesn\'t exists"
    @db = chooseDb
    
    chooseDb.collection 'hello', {strict:true}, (err, col) ->
      #test.ok(err != null);
      console.log err
      if err?
        chooseDb.createCollection 'hello', (err,result) ->
          assert.ifError err
    do RestTest

    @close = ->      
      do @db.close
  return this    
      #else
      #  chooseDb.dropCollection 'hello', (err,result) ->
      #    assert.ifError err
      #    do db.close


rest = require("restler")
curl = require('curlrequest')
url = "https://api.mercadolibre.com/sites/MLB/search?q=raspberry%20pi&limit=10"
_ = require('underscore')

RestTest = ->
  rest.post("http://localhost:3000/test/hello/save", data: { id: 334 }).on "complete", (result) ->
    console.log result
    rest.get('http://localhost:3000/test/hello').on "complete", (result) ->
      #assert.ifError result, result.message
      if result instanceof Error
        console.log "Error:", result.message
        @retry 5000 # try again after 5 sec
      else
        console.log result
        do MongoDB.close
      return

new MongoDB
###

curl.request url, (err, response) ->
  response = JSON.parse response
  _.each response.results, (item) ->
    console.log item
###
