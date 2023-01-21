#!/usr/bin/env nodejs
const http = require('http')
const express = require('express')
const path = require('path')
const app = express()
const publicPath = path.join(__dirname, 'public')

let players = []

console.log(publicPath)

app.use("/node_modules", express.static(path.join(__dirname , "/node_modules")));
app.use('/js',express.static(path.join(__dirname, 'public')))
app.use(express.static(publicPath))


app.set('port', '8080')

const server = http.createServer(app)
server.on('listening', () => {
 console.log('Listening on port 8080')
})

// Web sockets
const io = require('socket.io')(server, {
	cors: {
		origin: '*'
	}
})

io.sockets.on('connection', (socket) => {
	console.log('Client connected: ' + socket.id)

	players.push({
		id: socket.id,
		score: 0
	})

	console.log(players.length)
	
	socket.emit('init', {
		players: players
	})
	socket.broadcast.emit('init', {
		players: players
	})

	
	socket.on('disconnect', () => {
		console.log('Client has disconnected')
		let index = players.findIndex(a=>a.id === socket.id)
		players = players.slice(index, 1)
		socket.broadcast.emit("quit", {
			id:socket.id
		});
	})

	socket.on('hit', ()=>{
		let i = players.findIndex(a=>a.id === socket.id)
		console.log(i)
		players[i].score++;
		socket.emit('hit', players[i])
		socket.broadcast.emit('hit', players[i])
	})
})

server.listen('8080', '0.0.0.0')