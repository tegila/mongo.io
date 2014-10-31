chai = require('chai')
expect = chai.expect
should = chai.should()

mongo = require('mongodb')
MongoClient = mongo.MongoClient
ObjectID = mongo.ObjectID

describe 'Mongo', ->
  db = null
  
  before (done) ->
    MongoClient.connect 'mongodb://192.168.1.112:27017/test', (err, tempDb) ->
      db = tempDb
      do done
    
  it 'Deve alternar entre os diferentes bancos do mongodb', (done) ->
    #console.log expect
    adminDb = do db.admin
    expect(adminDb).to.not.be.a('null')
    chooseDb = db.db("test")
    expect(chooseDb).to.not.be.a('null')
    db = chooseDb
    do done

  it 'Deve se conectar a uma coleção e cria-la caso não exista', (done) ->
    db.collection 'hello', {strict:true}, (error, col) ->
      should.not.exist error
      if err?
        db.createCollection 'hello', (error,result) ->
          should.not.exist error
          do done
      else do done

###
exports = (scope) ->
  @init = ->
      # Use the admin database for the operation
      
      assert.notEqual adminDb, null, "database: #{adminDb}, doesn\'t exists"

      chooseDb = db.db("test")
      assert.notEqual adminDb, null, "database: #{chooseDb}, doesn\'t exists"
      scope.db = scope.parent.db = chooseDb
      
      chooseDb.collection 'hello', {strict:true}, (err, col) ->
        #test.ok(err != null);
        console.log err
        if err?
          chooseDb.createCollection 'hello', (err,result) ->
            assert.ifError err
  @close = ->
    do scope.db.close
###