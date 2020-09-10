import React from 'react';
import List from './List.js';
import QuestionForm from './QuestionForm.js';
import io from 'socket.io-client';
import { useParams, useHistory } from 'react-router-dom';
import RoomLogin from './RoomLogin';

const API_URL = 'http://localhost:3000';
let socket;
let roomUrl = 'DEFAULT';
let id;

const Window = () => {
	const history = useHistory();
	const room = useParams();

	const [loggedIn, setLoggedIn] = React.useState(false)
	// state for password -----------------------------------------------------------------------------------
	const [requirePassword, setRequirePassword] = React.useState(false);
	// State for username -----------------------------------------------------------------------------------
	const [displayName, setDisplayName] = React.useState("");
	// State that handles conditional rendering for components -----------------------------------------------
	const [visibility, setVisibility] = React.useState({
		form: false,
		list: false,
		post: false
	});
	// The dataList State which handles all the questions -----------------------------------------------------
	const [dataList, setDataList] = React.useState([]);

	// Temporary state for appending new entries to dataList --------------------------------------------------
	const [questionState, setQuestionState] = React.useState({
		_id: '0',
		author: '',
		text: '',
		score: 0,
		voted: false,
		room: '',
		answer: ''
	});

	//whether or not questions are allowed in the room at this time
	const [allowQuestions, setAllowQuestions] = React.useState(true);

	const [loginInputs, setLoginInputs] = React.useState({
		name: "",
		password: ""
	})

	// ---------------------------------------------- Handler Functions ----------------------------------------
	const handleLoginInputChange = (event) => {
		setLoginInputs({ ...loginInputs, [event.target.name]: event.target.value });
	}

	const handleLoginSubmit = (event) => {
		event.preventDefault()

		fetch(`${API_URL}/room/${roomUrl}/login`, {
			method: 'POST',
			body: JSON.stringify(loginInputs),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => {
			if (res.ok && res.json()) { //room found & ok
				console.log("200", res)

				//TODO: STORE ACCESS TOKEN
				setDisplayName(loginInputs.name)
				setQuestionState((questionState) => ({
					...questionState,
					author: loginInputs.name,
					room: roomUrl
				}))
				setVisibility({ form: false, list: true, post: true });
				setLoggedIn(true) //set logged in to true

				socket.emit('join-room', { roomUrl, user: loginInputs.name });


			} else { //login failed
				console.log("401:", res)
				alert("login failed")
				return false
			}
		})
	}
	// Handles the change in the form component.
	const handleQuestionFormOnChange = (event) => {
		setQuestionState({
			...questionState,
			[event.target.name]: event.target.value
		});
	};

	//Handles the submit in the form component.
	const handleQuestionFormSubmit = (event) => {
		event.preventDefault();
		if (questionState.text != '') {
			socket.emit('add-question', questionState);
			console.log(questionState);
			setQuestionState({
				...questionState,
				text: '',
				score: 0,
				voted: false
			});
		}
		handleSubmitVisibility();
	};

	// Handles changing the vote of a particular Question.
	const handleVote = (index) => {
		let state = [...dataList];
		const id = state[index]._id;
		console.log('Upvoting', id);
		socket.emit('vote-up', { id, roomUrl });
		state[index] = {
			...state[index],
			score: state[index].score + 1,
			voted: true
		};
		setDataList(state);
	};

	//Handles deleting a particular question questionStateect from dataList.
	const handleDelete = (index) => {
		let state = [...dataList];
		const id = state[index]._id;
		socket.emit('delete-question', { id, roomUrl });
		state.splice(index, 1);
		setDataList(state);
	};
	//Handles the Visibility after submit of form is clicked.
	const handleSubmitVisibility = () => {
		setVisibility({ form: false, list: true, post: true });
	};

	// Handles the visibility after Post a question is clicked.
	const handlePostVisibility = () => {
		setVisibility({ form: true, list: false, post: false });
	};

	// Helper function for socket to update vote.
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
	// Helper function for sokcet to delete item.
	const deleteItem = (dataList, id) => {
		let state = [...dataList];
		//locate the question in the state by id
		let index = state.findIndex((question) => {
			return question._id == id;
		});
		state.splice(index, 1);
		return state;
	};

	// --------------------------------------------------------------SOCKETS ------------------------------------------------
	React.useEffect(() => {
		roomUrl = room.roomUrl;

		//INITIAL FETCH CHECKS IF ROOM IS REAL AND IF PASSWORD IS REQUIRED
		fetch(`${API_URL}/room/${roomUrl}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => {
			if (res.ok) return res.json(); //room found - return response body
			return false // else return false
		}).then(response_body => {
			if (response_body) {
				console.log(response_body.requirePassword);
				//TODO: If password is required then look for access/refresh tokens
				//...if token found then authenticate and join - otherwise show login form
				setRequirePassword(response_body.requirePassword)
			} else {
				alert("room doesnt exist")
			}
		})

		socket = io('http://localhost:3000');
		// Listening Sockets------------------------------------------
		socket.on('connect', () => {
			console.log('Connected to server: ', socket.connected); // true
		});
		socket.on('acknowledge-join', (roomData) => {
			console.log('Socket Acknowledged');
			// add error boundary for invalid roomData--
			setDataList(roomData.questions);
		});
		//if server could not find room then redirect to home page
		socket.on('room-not-found', () => {
			history.push('/');
		});
		//add a question
		socket.on('add-question', (data) => {
			console.log('new question', data);
			setDataList((dataList) => [data, ...dataList]);
		});
		//vote up question
		socket.on('vote-up', (id) => {
			console.log('vote up from socket');
			setDataList((dataList) => setVote(dataList, id));
		});
		//delete question
		socket.on('delete-question', (id) => {
			console.log('delete from socket');
			setDataList((dataList) => deleteItem(dataList, id));
		});

		socket.on('kicked', (msg) => {
			alert(msg);
			socket.disconnect();
			history.push('/');
		});
		socket.on('add-the-answer', (result) => {
			console.log('working');
			setDataList((questionList) => setAnswer(result.answer, questionList, result._id));
		});
		//moderator turns questions on or off for a room
		socket.on('toggle-questions', (onOrOff) => {
			console.log('Toggling questions', onOrOff);
			setAllowQuestions(onOrOff);
		});

		socket.on('disconnect', () => {
			console.log('Connected to server: ', socket.connected); // false
		});
	}, []);

	//--------------------------rendering---------------------------------
	return (
		<React.Fragment>

			{!loggedIn ? //TODO ?? : changed to (loggenIn && isAuthenticated) 
				< RoomLogin requirePassword={requirePassword} handleInputChange={handleLoginInputChange} handleSubmit={handleLoginSubmit} />

				: <React.Fragment>
					{visibility.list && <List dataList={dataList} handleVote={handleVote} handleDelete={handleDelete} />}
					{visibility.form && (
						<QuestionForm
							questionState={questionState}
							handleOnChange={handleQuestionFormOnChange}
							handleSubmit={handleQuestionFormSubmit}
						/>
					)}
					{visibility.post && (
						<React.Fragment>
							<button className={`btn`} onClick={handlePostVisibility}>Post a Question...</button>
							<button className={`btn`} onClick={() => console.log(dataList)}>Log State</button>
						</React.Fragment>
					)}

					<h1>Questions allowed? : {allowQuestions ? 'Yes' : 'No'}</h1>
				</React.Fragment>



			}




			{/* <div
				className="btn"
				onClick={() => {
					socket.disconnect();
					history.push('/');
				}}
			>
				Leave Room
			</div> */}
		</React.Fragment>
	);
};
export default Window;