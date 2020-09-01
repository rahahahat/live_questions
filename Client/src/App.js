import React from 'react';
import ReactDOM from 'react-dom';
import Window from './components/Window.js';
import CreateRoom from './components/CreateRoom';
import Nav from './components/Nav.js';
import JoinRoom from './components/JoinRoom.js';
import SetUsername from './components/SetUsername.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Loading from './components/Loading.js';
import QuestionUser from './components/QuestionUser.js';
import QuestionAdmin from './components/QuestionAdmin.js';
// import { FiEdit } from "react-icons/fi";
var content =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec pulvinar justo. Curabitur eget congue libero. Praesent nisl leo, condimentum in ipsum et, fermentum tincidunt elit. Morbi odio ipsum, sollicitudin vel nisi sed, rhoncus fermentum nunc. Aliquam bibendum quam nibh, sed iaculis orci dignissim id. Pellentesque condimentum porta lectus, ac malesuada leo auctor quis. Cras pulvinar venenatis orci sit amet fermentum. Aenean dapibus justo laoreet quam varius rutrum. Nunc diam tellus, molestie sed ex  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec pulvinar justo. Curabitur eget congue libero. Praesent nisl leo, condimentum in ipsum et, fermentum tincidunt elit. Morbi odio ipsum, sollicitudin vel nisi sed, rhoncus fermentum nunc. Aliquam bibendum quam nibh, sed iaculis orci dignissim id. Pellentesque condimentum porta lectus, ac malesuada leo auctor quis. Cras pulvinar venenatis orci sit amet fermentum. Aenean dapibus justo laoreet quam varius rutrum. Nunc diam tellus, molestie sed ex vel, vehicula feugiat mavel, vehicula feugiat mauris.';
var data = {
	author: 'test',
	text: 'what is a question',
	score: 35,
	answer: 'none yet'
};
const App = () => {
	return (
		<Router>
			<Switch>
				<Route path="/room/:roomUrl" component={Window} />
				<Route path="/set-username" component={SetUsername} />
				<Route path="/Join" component={JoinRoom} />
				<Route path="/create" component={CreateRoom} />
				<Route path="/" component={Nav} />
			</Switch>
		</Router>
		// <QuestionAdmin question={data} />
	);
};
ReactDOM.render(<App />, document.getElementById('root'));
