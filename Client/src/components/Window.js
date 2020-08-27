import React from "react";
import List from "./List.js";
import QuestionForm from "./QuestionForm.js";
import io from "socket.io-client";
import { useParams, useHistory } from "react-router-dom";

const API_URL = "http://localhost:3000";
let socket;
//let roomUrl = "DEFAULT";
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
  const [questionState, setquestionState] = React.useState({
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
    setquestionState({
      ...questionState,
      [event.target.name]: event.target.value,
    });
  };

  //Handles the submit in the form component.
  const handleSubmit = (event) => {
    event.preventDefault();
    if (questionState.text != "") {
      socket.emit("add-question", questionState);
      console.log(questionState);
      setquestionState({
        ...questionState,
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
    socket.emit("vote-up", { id, roomUrl });
    state[index] = {
      ...state[index],
      score: state[index].score + 1,
      voted: true,
    };
    setDataList(state);
  };

  //Handles deleting a particular question questionStateect from dataList.
  const handleDelete = (index) => {
    let state = [...dataList];
    const id = state[index]._id;
    socket.emit("delete-question", { id, roomUrl });
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
    let roomUrl = room.roomUrl;
    userName = history.location.state.username;

    socket = io("http://localhost:3000");

    setquestionState({ ...questionState, author: userName, room: roomUrl });

    // Initiate client-side connection----------------------------
    socket.emit("join-room", { roomUrl, userName });
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
      console.log(room, roomUrl);
      //history.push("/");
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
      {visibility.form && <QuestionForm questionState={questionState} handleOnChange={handleOnChange} handleSubmit={handleSubmit} />}
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

      <div
        className="btn"
        onClick={() => {
          socket.emit("disconnect");
          history.push("/");
        }}
      >
        Leave Room
      </div>
    </React.Fragment>
  );
};
export default Window;
