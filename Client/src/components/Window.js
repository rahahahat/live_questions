import React from "react";
import List from "./List.js";
import QuestionForm from "./QuestionForm.js";
import io from "socket.io-client";
import { useParams, useHistory } from "react-router-dom";

const API_URL = "http://localhost:3000";
let socket;
let roomName = "DEFAULT";
let userName = "DEFAULT_USERNAME";

const Window = () => {
  const history = useHistory();
  const room = useParams();

  // State that handles conditional rendering for components -----------------------------------------------
  const [visibility, setVisibility] = React.useState({
    form: false,
    list: true,
    post: true,
  });
  // The dataList State which handles all the questions -----------------------------------------------------
  const [dataList, setDataList] = React.useState([]);

  // Temporary state for appending new entries to dataList --------------------------------------------------
  const [obj, setObj] = React.useState({
    _id: "0",
    author: "//fetch from server//",
    text: "",
    score: 0,
    voted: false,
    room: "",
  });
  // ---------------------------------------------- Handler Functions ----------------------------------------

  // Handles the change in the form component.
  const handleOnChange = (event) => {
    setObj({
      ...obj,
      [event.target.name]: event.target.value,
    });
  };

  //Handles the submit in the form component.
  const handleSubmit = () => {
    if (obj.text != "") {
      socket.emit("add-question", obj);
      console.log(obj);
      setObj({
        ...obj,
        text: "",
        score: 0,
        voted: false,
      });
    }
    handleSubmitVisibility();
  };

  // Handles changing the vote of a particular Question.
  const handleVote = (index) => {
    let state = [...dataList];
    const id = state[index]._id;
    console.log("Upvoting", id);
    socket.emit("vote-up", { id, roomName });
    state[index] = {
      ...state[index],
      score: state[index].score + 1,
      voted: true,
    };
    setDataList(state);
  };

  //Handles deleting a particular question object from dataList.
  const handleDelete = (index) => {
    let state = [...dataList];
    const id = state[index]._id;
    socket.emit("delete-question", { id, roomName });
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
    roomName = room.roomName;
    userName = history.location.state.username;

    socket = io("http://localhost:3000");

    setObj({ ...obj, author: userName, room: roomName });

    // Initiate client-side connection----------------------------
    socket.emit("join-room", { roomName, userName });
    // Listening Sockets------------------------------------------
    socket.on("connect", () => {
      console.log("Connected to server: ", socket.connected); // true
    });

    socket.on("acknowledge-join", (roomData) => {
      console.log("Socket Acknowledged");
      // add error boundary for invalid roomData--
      setDataList(roomData.questions);
    });

    //if server could not find room then redirect to home page
    socket.on("room-not-found", () => {
      history.push("/");
    });

    //add a question
    socket.on("add-question", (data) => {
      console.log("new question", data);
      setDataList((dataList) => [data, ...dataList]);
    });

    //vote up question
    socket.on("vote-up", (id) => {
      console.log("vote up from socket");
      setDataList((dataList) => setVote(dataList, id));
    });

    //delete question
    socket.on("delete-question", (id) => {
      console.log("delete from socket");
      setDataList((dataList) => deleteItem(dataList, id));
    });

    socket.on("disconnect", () => {
      console.log("Connected to server: ", socket.connected); // false
    });
  }, []);

  //--------------------------rendering---------------------------------
  return (
    <React.Fragment>
      {visibility.list && <List dataList={dataList} handleVote={handleVote} handleDelete={handleDelete} />}
      {visibility.form && <QuestionForm obj={obj} handleOnChange={handleOnChange} handleSubmit={handleSubmit} />}
      {visibility.post && (
        <React.Fragment>
          <div className={`btn`} onClick={handlePostVisibility}>
            Post a Question...
          </div>
          <div className={`btn`} onClick={() => console.log(dataList)}>
            Log State
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default Window;
