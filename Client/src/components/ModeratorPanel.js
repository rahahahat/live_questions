import React from 'react';
import io from 'socket.io-client';
import { useParams, useHistory } from 'react-router-dom';
import UserList from './UserList';
import QuestionAdmin from './QuestionAdmin.js';
import '../css/moderator.css';
import Loading from './Loading';
const API_URL = 'http://localhost:3000';
let socket;
const ModeratorPanel = () => {
	let history = useHistory();
	let routerparams = useParams();
	console.log(routerparams);
	let roomUrl = routerparams.roomUrl;
	const [validate, setValidate] = React.useState({ loading: true, passwordForm: false, room_id: '' });
	const [allowQuestions, setAllowQuestions] = React.useState(true); //BUG: will cause errors if false by default
	const [title, setTitle] = React.useState({ title: 'not-set-yet' });
	const [clientList, setClientList] = React.useState([]);
	const [questionList, setQuestionList] = React.useState([]);
	const [adminPassword, setAdminPassword] = React.useState({});
	const setVote = (dataList, id) => {
		let state = [...dataList];
		//locate the question in the state by id
		let index = state.findIndex((question) => {
			return question._id == id;
		});
		state[index] = { ...state[index], score: state[index].score + 1 };
		return state;
	};
	const setAnswer = (answer, dataList, id) => {
		let state = [...dataList];
		let index = state.findIndex((question) => {
			return question._id == id;
		});
		state[index] = { ...state[index], answer: answer };
		return state;
	};
	const handleAnswerSubmit = (id, answer, roomUrl) => {
		console.log('hi');
		socket.emit('add-answer', { answer, id, roomUrl });
	};
	const handleQuestionDelete = (id, roomUrl) => {
		let state = [...questionList];
		let index = state.findIndex((question) => {
			return question._id == id;
		});
		state.splice(index, 1);
		setQuestionList(state);
		socket.emit('delete-question', { id, roomUrl });
	};

	const kick = (id) => {
		console.log('Kicking user ', id);
		socket.emit('kick-user', id);
	};
	const toggleAllowQuestions = () => {
		console.log(allowQuestions);
		socket.emit('toggle-questions', !allowQuestions);
		setAllowQuestions(!allowQuestions);
	};
	const handlePasswordSubmit = () => {
		console.log(validate);
		fetch(`${API_URL}/validate/admin-pass`, {
			method: 'POST',
			body: JSON.stringify({ password: adminPassword.adminPassword, id: validate.room_id }),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => {
			res.text().then((res) => {
				if (JSON.parse(res)) {
					setValidate({ loading: false, passwordForm: false, room_id: '' });
					setAdminPassword({});
					socket.emit('moderator-join', roomUrl);
				} else {
					alert('Wrong password');
				}
			});
			// console.log(res.text());
		});
	};
	React.useEffect(() => {
		socket = io('http://localhost:3000');
		// Listening Sockets------------------------------------------
		socket.on('connect', () => {
			console.log('Connected to server: ', socket.connected); // true
		});
		socket.on('update-user-list', (clients) => {
			console.log(clients);
			setClientList(clients);
		});
		socket.on('sending-questions', (questions) => {
			setQuestionList(questions);
		});
		socket.on('add-question', (data) => {
			console.log('new question', data);
			setQuestionList((questionList) => [data, ...questionList]);
		});
		socket.on('vote-up', (id) => {
			console.log('vote up from socket');
			setQuestionList((questionList) => setVote(questionList, id));
		});
		socket.on('room-not-found', () => {
			history.push('/');
		});
		socket.on('add-the-answer', (result) => {
			setQuestionList((questionList) => setAnswer(result.answer, questionList, result._id));
		});
		if (history.location.state == null) {
			fetch(`${API_URL}/validate/admin-url`, {
				method: 'POST',
				body: JSON.stringify({ roomUrl: roomUrl }),
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((res) => {
					res.text().then((result) => {
						var check = JSON.parse(result);
						if (check.validate) {
							setValidate({ loading: false, passwordForm: true, room_id: check.id });
						} else {
							alert('Wrong Moderator panel URL');
							history.push('/');
						}
					});
				})
				.catch((err) => {
					console.error(err);
				});
		} else {
			socket.emit('moderator-join', roomUrl);
			setValidate({ loading: false, passwordForm: false });
		}
	}, []);
	React.useEffect(() => {
		fetch(`${API_URL}/title`, {
			method: 'POST',
			body: JSON.stringify({ roomUrl: roomUrl }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => {
				res.text().then((result) => {
					setTitle(JSON.parse(result));
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	return validate.loading ? (
		<Loading />
	) : validate.passwordForm ? (
		<div className="admin-pass-container">
			<form className="admin-pass-form">
				<input
					type="password"
					placeholder="Enter Admin Password"
					name="adminPassword"
					className="room-input admin-pass-input"
					onChange={(event) => {
						setAdminPassword({ [event.target.name]: event.target.value });
					}}
				/>
				<div className="btn" onClick={handlePasswordSubmit}>
					Submit
				</div>
			</form>
		</div>
	) : (
				<div className="moderator-main">
					<div className="moderator-controls">
						<div className="panel-heading mod-child">
							Moderator Panel
					<br />
					URL:{roomUrl}
							{title.title == 'not-set-yet' ? null : <br />}
							{title.title == 'not-set-yet' ? null : `Room title: ${title.title}`}
						</div>

						<div className="room-control-heading mod-child">Room Controls</div>
						<div className="room-controls mod-child">
							<div className="connected-users">Users connected: {clientList.length} </div>
							<UserList clientList={clientList} kick={kick} />
							<button className="toggle-allow-questions" onClick={toggleAllowQuestions}>
								{allowQuestions ? 'Close Room for Questions' : 'Open Room for Questions'}
							</button>
						</div>
					</div>
					<div className="mod-question-section">
						{questionList.length == 0 ? (
							<div className="mod-loading">LOADING</div>
						) : (
								questionList.sort((a, b) => b.score - a.score).map((questions, index) => (
									<li key={questions._id}>
										<QuestionAdmin
											question={questions}
											index={index}
											onEdit={handleAnswerSubmit}
											onDelete={handleQuestionDelete}
											roomUrl={roomUrl}
										/>
									</li>
								))
							)}
					</div>
				</div>
			);
};

export default ModeratorPanel;
