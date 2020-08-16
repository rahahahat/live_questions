import React from 'react';
import ReactDOM from 'react-dom';
import Window from './components/Window.js';
import CreateRoom from './components/CreateRoom';
import Nav from './components/Nav.js';
import JoinRoom from './components/JoinRoom.js';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import io from 'socket.io-client';
const App = () => {
	return (
		<Router>
			<Switch>
				<Route path="/join-room" component={JoinRoom} />
				<Route path="/questions/:room/:id" component={Window} />
				<Route path="/create-room" component={CreateRoom} />
				<Route path="/" component={Nav} />
			</Switch>
		</Router>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
