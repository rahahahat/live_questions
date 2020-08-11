const express = require('express');
const http = require('http');
const path = require('path');
const { disconnect } = require('process');
// -------------------------------------------
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
//  ------------------------------------------
io.on('connection', (socket) => {
	socket.on('disconnect', () => {
		console.log('disconnect');
	});
	console.log('user connected');
	socket.on('add-question', (data) => {
		console.log('add a question');
		socket.broadcast.emit('add-this-question', data);
	});
	socket.on('queue-vote-up', (index) => {
		socket.broadcast.emit('vote-up-onIndex', index);
	});
	socket.on('queue-delete', (index) => {
		socket.broadcast.emit('delete-question-onIndex', index);
	});
});
// -----------s--------------------------------
server.listen(3000, () => {
	console.log('The server is running on port 3000');
});
