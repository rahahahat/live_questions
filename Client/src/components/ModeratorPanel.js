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
	const [visibility, setVisibility] = React.useState({ loading: true, passwordForm: false });
	const [allowQuestions, setAllowQuestions] = React.useState(true); //BUG: will cause errors if false by default
	const [title, setTitle] = React.useState("");
	const [clientList, setClientList] = React.useState([]);
	const [questionList, setQuestionList] = React.useState([]);
	const [adminPassword, setAdminPassword] = React.useState("");

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
	const handlePasswordSubmit = (event) => {
		event.preventDefault()

		fetch(`${API_URL}/room/${roomUrl}/admin`, {
			method: 'POST',
			body: JSON.stringify({ password: adminPassword.adminPassword }),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => {
			if (res.ok) return res.json();
			return false;
		}).then(response_body => {
			if (response_body) {

				//todo: handle tokens

				setVisibility({ loading: false, passwordForm: false, room_id: '' });
				setAdminPassword({});
				socket.emit('moderator-join', roomUrl);
			} else {
				alert("login failed")
			}
		})

	}


	//};
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

		//INITIAL FETCH CHECKS IF ROOM IS REAL
		fetch(`${API_URL}/room/${roomUrl}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => {
			if (res.ok) return res.json();
			return false;
		}).then(response_body => {
			if (response_body) {
				setTitle(response_body.title)

				//room exists so show password 
				setVisibility({ loading: false, passwordForm: true })
			} else {
				alert("404: room not found")
			}
		})

	}, []);

	return <React.Fragment>
		{visibility.loading && <Loading />}

		{visibility.passwordForm &&
			<div className="admin-pass-container">
				<form className="admin-pass-form" onSubmit={handlePasswordSubmit}>
					<input
						type="password"
						placeholder="Enter Admin Password"
						name="adminPassword"
						className="room-input admin-pass-input"
						onChange={(event) => {
							setAdminPassword({ [event.target.name]: event.target.value });
						}}
					/>
					<div className="btn">Submit</div>
				</form>
			</div>
		}

		{(!visibility.passwordForm && !visibility.loading) &&
			<div className="moderator-main">
				<div className="moderator-controls">
					<div className="panel-heading mod-child">
						<h2>Admin Panel</h2>
						<p>Join Code (click to join)= <a href={"/room/" + roomUrl}>{roomUrl}</a> </p>
						<p>{title}</p>
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
		}
	</React.Fragment>
};

export default ModeratorPanel;
