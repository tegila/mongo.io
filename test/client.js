const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

const MongoIOClient = require('../client');
const host = process.env.KEY;

describe('Socket.io test', () => {
  var io = null;
  
  before((done) => {
    io = MongoIOClient(host);
    done();
  });

  it('Primeiro vamos salvar um item { hello: `world` }', (done) => {
    io.save('session', { hello: 'world2' });
    done();
  });

  it('Depois vamos consultar pra ver se deu certo { hello: `world` }', (done) => {
    io.once('session', { hello: 'world2' }, (session) => {
      console.log(session);
      done();
    })
  }).timeout(5000);

});
