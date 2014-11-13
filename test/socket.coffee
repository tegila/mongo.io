chai = require('chai')
expect = chai.expect
should = chai.should()
Socket = require('socket.io-client')

describe 'Socket.io test', ->
  socket = null
  
#  before (done) ->
#    do done

  it 'Testa conexão com banco de dados', (done) ->
    socket = Socket 'http://mongo.tegila.com.br:80'
    socket.on 'connect', ->
      do done

  it 'Testa conexão com fetch banco inteiro (/)', (done) ->
    socket.emit 'test collection', {obj: "param"}
    socket.on 'collection', (data) ->
      console.log data
      socket.removeListener 'collection'
      do done

  it 'Salvar um objeto na colleção', (done) ->
    socket.emit 'save test collection', {obj: "param"}
    socket.on 'collection', (data) ->
      console.log data
      socket.removeListener 'collection'
      do done

  it 'Atualizar um objeto na colleção', (done) ->
    socket.emit 'save test collection', {obj: "param"}
    socket.on 'collection', (data) ->
      console.log data
      socket.removeListener 'collection'
      do done

  it 'Consulta complexa usando query NoSQL', (done) ->
    socket.emit 'test collection', {obj: "param"}
    socket.on 'collection', (data) ->
      console.log data
      socket.removeListener 'collection'
      do done

  it 'Remove um objeto da colleção', (done) ->
    socket.emit 'remove test collection', {obj: "param"}
    socket.on 'collection', (data) ->
      console.log data
      socket.removeListener 'collection'
      do done

#  it 'Testa desconexão', (done) ->
#    do socket.disconnect
#    socket.on 'disconnect', ->
#      do done