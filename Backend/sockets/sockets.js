const Room = require('../models/room');
const Question = require('../models/question');
var Filter = require('bad-words');

var CLIENTS = {};
//global entry point for socket.io connections

var socketAuth = require('../middleware/socket-auth');

module.exports = (io) => {
	io.use(socketAuth.socketIsAuthenticated).on('connection', (socket) => {

		//console.log("Socket cookie", socket.handshake.headers.cookie);
		//Triggered when joinform is submitted
		//console.log(`Socket connected id ${socket.id}`);

		//------------MODERATOR TOOLS--------------
		//mod joins admin panel
		socket.on('moderator-join', (roomUrl) => {
			socket.username = 'Moderator';
			socket.questionRoom = roomUrl;
			socket.join(roomUrl);
			// console.log(CLIENTS[roomUrl]);
			if (roomUrl in CLIENTS) {
				socket.emit('update-user-list', CLIENTS[roomUrl]);
			}
			Room.findOne({ url: roomUrl }).populate('questions').exec((err, result) => {
				if (err || !result) {
					err ? console.error(err) : console.log('room not found in moderator-join', roomUrl);
					socket.emit('room-not-found');
				} else {
					socket.emit('sending-questions', result.questions);
				}
			});
		});

		socket.on('toggle-questions', (onOrOff) => {
			let switchText = onOrOff ? 'turning questions on' : 'turning questions off';
			console.log(switchText + `in room ${socket.questionRoom}`);
			socket.to(socket.questionRoom).emit('toggle-questions', onOrOff);
		});

		socket.on('kick-user', (id) => {
			console.log('kicking', id);
			io.to(id).emit('kicked', 'You were kicked by a moderator');
		});

		socket.on('add-answer', (answer) => {
			console.log(answer);
			Question.findByIdAndUpdate(answer.id, { answer: answer.answer }, { new: true }).then((result) => {
				io.to(answer.roomUrl).emit('add-the-answer', result);
			});
		});

		//-----------JOIN ROOM
		//TODO: Auth token
		socket.on('join-room', ({ roomUrl, user }) => {
			//find room in db to check it exists before creating
			Room.findOne({
				url: roomUrl
			})
				.populate('questions') //turns list of question ids into list of question objects
				.exec((err, result) => {
					if (err || !result) {
						err ? console.log(err) : console.log('Room not found', roomUrl);
						socket.emit('room-not-found');
					} else {

						//TODO: find user from DB and set their username to that

						socket.join(roomUrl);
						socket.username = user;
						socket.questionRoom = roomUrl;
						socket.emit('acknowledge-join', result);

						//--utilities for moderator panel--
						let userInfo = {
							id: socket.id,
							username: socket.username
						};
						!(roomUrl in CLIENTS) && (CLIENTS[roomUrl] = []);
						CLIENTS[roomUrl].push(userInfo);
						socket.to(roomUrl).emit('update-user-list', CLIENTS[socket.questionRoom]);
						//----------------------------------

						//console.log(`${Date.now()}: ${user} joined room ${roomUrl}`);
					}
				});
		});
		//when someone submits a new question
		socket.on('add-question', (newQuestion) => {
			console.log(`${Date.now()}: ${newQuestion.author} asks ${newQuestion.text} in room ${newQuestion.room}`);

			//Find the room in the db
			Room.findOne({
				url: newQuestion.room
			})
				.then((room) => {
					//create question object
					let question = new Question({
						author: newQuestion.author,
						text: room.profanityFilter
							? new Filter().clean(newQuestion.text) //filter profanity if setting is true for this room
							: newQuestion.text,
						score: 0
					});
					console.log(question);

					question.save()
					room.questions.push(question)
					room.save()
					//createQuestion(room._id, question);

					//emit question to room
					io.to(room.url).emit('add-question', question);
				})
				.catch((err) => {
					console.error(err);
				});
		});

		//VOTE UP
		socket.on('vote-up', ({ id, roomUrl }) => {
			//increment question score in DB
			incrementQuestionScoreById(id);

			Question.findById(id).then((record) => {
				if (record == null) {
					console.error('Could not update score');
				} else {
					//update the question on clientside
					socket.to(roomUrl).broadcast.emit('vote-up', id);
				}
			});
		});

		//DELETE
		socket.on('delete-question', ({ id, roomUrl }) => {
			console.log(`Deleting question ${id} from ${roomUrl}`);
			//remove reference from room
			Room.findOneAndUpdate({ url: roomUrl }, { $pull: { questions: id } }, { new: true }, (err, doc) => {
				if (err) {
					console.error(err);
				}
			});

			//then delete question from db
			Question.findByIdAndRemove(id, (err, doc) => {
				if (err) {
					console.error(err);
				}
			});
			socket.to(roomUrl).emit('delete-question', id);
		});

		socket.on('disconnect', () => {
			//console.log(`${socket.username} disconnected from ${socket.questionRoom}`);

			//--for moderator user list--
			//console.log(CLIENTS, socket.id);

			//client may not always be in room (they may connect and never set display name) so this must be handled
			if (socket.questionRoom in CLIENTS) {
				CLIENTS[socket.questionRoom] = CLIENTS[socket.questionRoom].filter((client) => client.id != socket.id);
				//console.log(CLIENTS);
				socket.to(socket.questionRoom).emit('update-user-list', CLIENTS[socket.questionRoom]);
			}

			//---------------------------
		});

	});

};

const createQuestion = function (roomId, question) {
	return Question.create(question).then((docQuestion) => {
		return Room.findByIdAndUpdate(
			roomId,
			{
				$push: {
					questions: docQuestion._id
				}
			},
			{
				new: true,
				useFindAndModify: false
			}
		);
	});
};

function incrementQuestionScoreById(questionId) {
	console.log('Incrementing score');

	Question.findByIdAndUpdate(
		questionId,
		{
			$inc: {
				score: 1
			}
		},
		{
			new: true
		},
		function (err, response) {
			if (err) {
				console.log(err);
			}
		}
	);
}
