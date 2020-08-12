import React from 'react';
import List from './List.js';
import Form from './Form.js';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';
let socket;
let roomName;
const Window = (props) => {
	// State that handles conditional rendering for components -----------------------------------------------
	const [ visibility, setVisibility ] = React.useState({
		form: false,
		list: true,
		post: true
	});
	// The dataList State which handles all the questions -----------------------------------------------------
	const [ dataList, setDataList ] = React.useState([]);

	// Temporary state for appending new entries to dataList --------------------------------------------------
	const [ obj, setObj ] = React.useState({
		author: '//fetch from server//',
		texts: '',
		score: 0,
		voted: false
	});
	// ---------------------------------------------- Handler Functions ----------------------------------------

	/* Handles the change in the form component.
  # Updates the tempObj using setObj everytime a change happens in the Question Form
  */
	const handleOnChange = (event) => {
		setObj({
			...obj,
			[event.target.name]: event.target.value
		});
	};
	/* Handles the submit in the form component.
  # Gets the Obj and pushes it to the dataList
  # Uses setDataList to update dataList and render
  # Uses setObj and pushes and empty question-object to be used by handleOnchange
  # Sets specified visibility.
  */
	const handleSubmit = () => {
		if (obj.texts != '') {
			socket.emit('add-question', { obj, roomName });
			setDataList((dataList) => [ obj, ...dataList ]);
			setObj({
				author: '//fetch from server//',
				texts: '',
				score: 0,
				voted: false
			});
		}
		handleSubmitVisibility();
		console.log('render from handleSubmit');
	};
	/* Handles changing the vote of a particular Question.
  # Gets the index of arrays.map
  # Creates a mutable copy of dataList
  # Increments the vote of the particular object queried by the index.
  # Uses setDataList to update the state
  */
	const handleVote = (index) => {
		socket.emit('queue-vote-up', { index, roomName });
		let state = [ ...dataList ];
		state[index] = {
			...state[index],
			score: state[index].score + 1,
			voted: true
		};
		setDataList(state);
	};
	/* Handles deleting a particular question object from dataList.
  # Gets the index of arrays.map
  # Creates a mutable copy of dataList
  # Deletes the desired Object using index.
  # Uses setDataList to update the state.
  */
	const handleDelete = (index) => {
		socket.emit('queue-delete', { index, roomName });
		let state = [ ...dataList ];
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
	const setVote = (dataList, index) => {
		let state = [ ...dataList ];
		state[index] = { ...state[index], score: state[index].score + 1 };
		return state;
	};

	const deleteItem = (dataList, index) => {
		let state = [ ...dataList ];
		state.splice(index, 1);
		return state;
	};
	// --------------------------------------------------------------SOCKETS ------------------------------------------------
	React.useEffect(() => {
		roomName = props.match.params.room;
		socket = io('http://localhost:3000');
		socket.emit('join-room', roomName);
		socket.on('add-this-question', (data) => {
			setDataList((dataList) => [ data, ...dataList ]);
		});
		socket.on('vote-up-onIndex', (index) => {
			setDataList((dataList) => setVote(dataList, index));
		});
		socket.on('delete-question-onIndex', (index) => {
			setDataList((dataList) => deleteItem(dataList, index));
		});
	}, []);
	// --------------------------------------------------------------SOCKETS ------------------------------------------------

	return (
		<React.Fragment>
			{/*---------- Conditionally rendering the Question List both initially and after recieving data---------- */}
			{dataList.length == 0 && visibility.list ? (
				<div className={`question-container`}>
					<div className="no-list-text"> No Questions Yet</div>
				</div>
			) : visibility.list ? (
				<List dataList={dataList} handleVote={handleVote} handleDelete={handleDelete} />
			) : null}

			{/*------------------------------------- Conditionally rendering the form ------------------------------*/}
			{visibility.form ? <Form obj={obj} handleOnChange={handleOnChange} handleSubmit={handleSubmit} /> : null}
			{visibility.post ? (
				<React.Fragment>
					<div className={`btn`} onClick={handlePostVisibility}>
						Post a Question...
					</div>
					<div className={`btn`} onClick={() => console.log(dataList)}>
						Log State
					</div>
				</React.Fragment>
			) : null}
		</React.Fragment>
	);
};
export default Window;
