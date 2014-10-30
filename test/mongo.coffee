MongoClient = require('mongodb').MongoClient
test = require('assert')

MongoClient.connect 'mongodb://192.168.1.112:27017/test', (err, db) ->

  # Use the admin database for the operation
  adminDb = do db.admin
  test.ok adminDb isnt null

  chooseDb = db.db("mercadolivre")

  chooseDb.collection 'hello', {strict:true}, (err, col) ->
    #test.ok(err != null);
    console.log err
    if err isnt null
      chooseDb.createCollection 'hello', (err,result) ->
        do db.close
    else
      chooseDb.dropCollection 'hello', (err,result) ->
        do db.close