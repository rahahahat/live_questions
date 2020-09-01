import React from "react";
import io from "socket.io-client";
import { useParams, useHistory } from "react-router-dom";
import UserList from "./UserList";

let socket;

const ModeratorPanel = () => {
  let routerparams = useParams();
  let roomUrl = routerparams.roomUrl;
  const [clientList, setClientList] = React.useState([]);
  React.useEffect(() => {
    socket = io("http://localhost:3000");
    // Listening Sockets------------------------------------------
    socket.on("connect", () => {
      console.log("Connected to server: ", socket.connected); // true
      socket.emit("moderator-join", roomUrl);
    });

    socket.on("update-user-list", (clients) => {
      console.log(clients);
      setClientList(clients);
    });

    console.log("Clients", clientList);
  }, []);

  function kick(id) {
    console.log("Kicking user ", id);
    socket.emit("kick-user", id);
  }

  const [allowQuestions, setAllowQuestions] = React.useState(true); //BUG: will cause errors if false by default

  function toggleAllowQuestions() {
    console.log(allowQuestions);
    socket.emit("toggle-questions", !allowQuestions);
    setAllowQuestions(!allowQuestions);
  }
  return (
    <React.Fragment>
      <h1>Moderator Panel - {roomUrl}</h1>
      <div>
        <h2>User List</h2>
        <p>{clientList.length} users connected</p>
        <div className="moderator-user-list-wrapper">
          <UserList clientList={clientList} kick={kick} />
        </div>
      </div>
      <div>
        <h2>Room Controls</h2>

        <button onClick={toggleAllowQuestions}>
          {allowQuestions
            ? "Close Room for Questions"
            : "Open Room for Questions"}
        </button>
      </div>
    </React.Fragment>
  );
};

export default ModeratorPanel;
