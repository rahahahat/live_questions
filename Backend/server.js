if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

var express = require('express');
var app = express();
var routes = require('./controllers')
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var cors = require('cors');
const bodyParser = require('body-parser');
var Filter = require('bad-words');
var randomWords = require('random-words');
const bcrypt = require('bcrypt');

const Room = require('./models/room');
const Question = require('./models/question');

app.use(cors());
app.use(express.static('public'));
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to mongose'));

var routes = require('./routes/all')
app.use('/', routes)

// app.get('/', (req, res) => {

// });

//mostly for debugging api
// app.get('/info', (req, res) => {
// 	let data = [];
// 	var sockets = io.sockets.sockets;
// 	for (var socketId in sockets) {
// 		var s = sockets[socketId];
// 		data.push({
// 			id: s.id,
// 			name: s.username,
// 			qroom: s.questionRoom
// 		});
// 		console.log(s);
// 	}

// 	res.json(data);
// });

//inserts a new room into db - accessed by CreateRoom.js
// 


// app.post('/validate-join', (req, res) => {
// 	Room.findOne({ url: req.body.room })
// 		.then((room) => {
// 			if (!room) res.send(false);
// 			return room;
// 		})
// 		.then((room) => {
// 			if (room.requirePassword) {
// 				console.log(room);
// 				bcrypt.compare(req.body.password, room.password, (err, result) => {
// 					console.log(result);
// 					res.send(result);
// 				});
// 			} else {
// 				res.send(true);
// 			}
// 		});
// });

// app.post('/validate-url', (req, res) => {
// 	console.log(req.body.room);
// 	Room.find({ url: req.body.room }).then((room) => {
// 		if (!room) {
// 			res.send(false);
// 		} else {
// 			res.send({ needPassword: room[0].requirePassword, roomID: room[0]._id });
// 		}
// 	});
// });

// app.post('/validate-password', (req, res) => {
// 	Room.findById(req.body.id).then((room) => {
// 		bcrypt.compare(req.body.password, room.password, (err, result) => {
// 			console.log(result);
// 			res.send(result);
// 		});
// 	});
// });

// app.post('/title', (req, res) => {
// 	Room.findOne({ url: req.body.roomUrl }).then((result) => {
// 		if (!result) {
// 			console.log('Room not found in app.post(/title)');
// 		} else {
// 			res.send(JSON.stringify({ title: result.title }));
// 		}
// 	});
// });

// app.post('/validate-admin-url', (req, res) => {
// 	Room.findOne({ url: req.body.roomUrl }).then((result) => {
// 		if (!result) {
// 			res.send({ validate: false });
// 		} else {
// 			res.send({ validate: true, id: result._id });
// 		}
// 	});
// });

// app.post('/validate-admin-pass', (req, res) => {
// 	console.log(req.body);
// 	Room.findById(req.body.id).then((result) => {
// 		if (!result) {
// 			res.send('Room not found');
// 		} else {
// 			bcrypt.compare(req.body.password, result.adminPassword).then((result) => {
// 				res.send(result);
// 			});
// 		}
// 	});
// });
//include all the socket.io code
require('./src/sockets.js')(io);

http.listen(process.env.PORT || 3000, function () {
	console.log('Hello World, lisening on 3000');
});

const generateUrl = () => {
	//do some error handling here to prevent duplicate url
	return randomWords({ exactly: 3, join: '-' });
};
