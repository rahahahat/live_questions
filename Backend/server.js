if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(bodyParser.json());

//MONGODB/MONGOOSE
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.set('useFindAndModify', false);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to mongose'));

//ROUTING
var routes = require('./routes/other')
var validateRoutes = require('./routes/validate')
app.use('/', routes)
app.use('/validate', validateRoutes)

//SOCKETIO
require('./sockets/sockets.js')(io);

http.listen(process.env.PORT || 3000, function () {
	console.log('Hello World, lisening on 3000');
});

