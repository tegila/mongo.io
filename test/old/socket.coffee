socket = require('socket.io-client')('http://192.168.1.112:3000/query')
socket.on 'connect', ->
	#console.log socket
	socket.on 'new connection', (data) -> 
		console.log data
		do socket.disconnect
	socket.on 'disconnect', (data) ->
		console.log data