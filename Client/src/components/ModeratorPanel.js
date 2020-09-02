import React from "react";
import io from "socket.io-client";
import { useParams, useHistory } from "react-router-dom";
import UserList from "./UserList";
import QuestionAdmin from "./QuestionAdmin.js";
import "../css/moderator.css";
let socket;

const ModeratorPanel = () => {
  let routerparams = useParams();
  let roomUrl = routerparams.roomUrl;
  const [clientList, setClientList] = React.useState([]);
  const [questionList, setQuestionList] = React.useState([]);
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
    console.log("hi");
    socket.emit("add-answer", { answer, id, roomUrl });
  };
  const handleQuestionDelete = (id, roomUrl) => {
    let state = [...questionList];
    let index = state.findIndex((question) => {
      return question._id == id;
    });
    state.splice(index, 1);
    setQuestionList(state);
    socket.emit("delete-question", { id, roomUrl });
  };
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
    socket.on("sending-questions", (room) => {
      setQuestionList(room.questions);
    });
    socket.on("add-question", (data) => {
      console.log("new question", data);
      setQuestionList((questionList) => [data, ...questionList]);
    });
    socket.on("vote-up", (id) => {
      console.log("vote up from socket");
      setQuestionList((questionList) => setVote(questionList, id));
    });
    socket.on("room-not-found", () => {
      history.push("/");
    });
    socket.on("add-the-answer", (result) => {
      setQuestionList((questionList) =>
        setAnswer(result.answer, questionList, result._id)
      );
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
  console.log(questionList);
  return (
    <div className="moderator-main">
      <div className="moderator-controls">
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
      </div>
      <div className="mod-question-section">
        {questionList
          .sort((a, b) => b.score - a.score)
          .map((questions, index) => (
            <li key={questions._id}>
              <QuestionAdmin
                question={questions}
                index={index}
                onEdit={handleAnswerSubmit}
                onDelete={handleQuestionDelete}
                roomUrl={roomUrl}
              />
            </li>
          ))}
      </div>
    </div>
  );
};

export default ModeratorPanel;
