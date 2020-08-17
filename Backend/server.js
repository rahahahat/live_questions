const express = require('express');
const http = require('http');
const path = require('path');
// -------------------------------------------
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
//  ------------------------------------------
io.on('connection', (socket) => {
	console.log('user connected');
	socket.on('disconnect', () => {
		console.log('disconnect');
	});
	// --Exclusive client sockets for handling the question object--
	socket.on('add-question', (data) => {
		socket.to(data.roomName).broadcast.emit('add-this-question', data.obj);
	});
	socket.on('queue-vote-up', (data) => {
		socket.to(data.roomName).broadcast.emit('vote-up-onIndex', data.index);
	});
	socket.on('queue-delete', (data) => {
		socket.to(data.roomName).broadcast.emit('delete-question-onIndex', data.index);
	});
	socket.on('join-room', (roomName) => {
		socket.join(roomName);
	});
	// --------------------------------------------------------------
});
// -----------s--------------------------------
server.listen(3000, () => {
	console.log('The server is running on port 3000');
});
