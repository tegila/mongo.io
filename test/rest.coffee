###
chai = require('chai')
expect = chai.expect
should = chai.should()

request = require('supertest')

describe 'Rest API test', ->
  req = null
  
  before (done) ->
    req = request('http://localhost:3000')
    do done

  it 'O servidor deve retornar 404 para uma chamada ROOT(/)', (done) ->
    req  
      .get('/')
      .set('Accept', 'application/html')
      .expect('Content-Type', /html/)
      .expect(404, done)

  it 'Inclui um objeto na collection test', (done) ->
    req
      .post('/test/hello/save')
      .send({ name: 'Manny', species: 'cat' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end (error, result) ->
        should.not.exist error
        # console.log result
        expect(result.body).to.not.be.empty
        do done


  it 'Consulta toda a collection test buscando pelo menos um resultado', (done) ->
    req
      .get('/test/hello')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end (error, result) ->
        should.not.exist error
        expect(result.body).to.not.be.empty
        do done
###
