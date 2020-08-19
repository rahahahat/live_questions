import React from "react";
import ReactDOM from "react-dom";
import Window from "./components/Window.js";
import CreateRoom from "./components/CreateRoom";
import Nav from "./components/Nav.js";
import JoinRoom from "./components/JoinRoom.js";
import SetUsername from "./components/SetUsername.js";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import io from "socket.io-client";
const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/join-room" component={JoinRoom} />
        <Route path="/questions/:room" component={Window} />
        <Route path="/create-room" component={CreateRoom} />
        <Route path="/" component={Nav} />
        <Route path="set-user-name" component={SetUsername} />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
