import React from "react";
import ReactDOM from "react-dom";
import Window from "./components/Window.js";
import CreateRoom from "./components/CreateRoom";
import Nav from "./components/Nav.js";
import JoinRoom from "./components/JoinRoom.js";
import SetUsername from "./components/SetUsername.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import io from "socket.io-client";
import Loading from "./components/Loading.js";
import ModeratorPanel from "./components/ModeratorPanel";
const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/room/:roomUrl/admin" component={ModeratorPanel} />
        <Route path="/room/:roomUrl" component={Window} />
        <Route path="/set-username" component={SetUsername} />
        <Route path="/Join" component={JoinRoom} />
        <Route path="/create" component={CreateRoom} />
        <Route path="/" component={Nav} />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
