import React from "react";
import ReactDOM from "react-dom";
import Window from "./Window.js";
import CreateRoom from "./CreateRoom";
import Nav from "./Nav.js";
import JoinRoom from "./JoinRoom.js";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import io from "socket.io-client";
const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/join-room" component={JoinRoom} />
        <Route path="/questions" component={Window} />
        <Route path="/create-room" component={CreateRoom} />
        <Route path="/" component={Nav} />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
