import React from "react";
import List from "./List.js";
import Form from "./Form.js";
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
    author: "//fetch from server//",
    text: "",
    score: 0,
    voted: false,
    room: "",
  });
  // ---------------------------------------------- Handler Functions ----------------------------------------

  /* Handles the change in the form component.
  # Updates the tempObj using setObj everytime a change happens in the Question Form
  */
  const handleOnChange = (event) => {
    setObj({
      ...obj,
      [event.target.name]: event.target.value,
    });
  };
  /* Handles the submit in the form component.
  # Gets the Obj and pushes it to the dataList
  # Uses setDataList to update dataList and render
  # Uses setObj and pushes and empty question-object to be used by handleOnchange
  # Sets specified visibility.
  */
  const handleSubmit = () => {
    console.log("addition to state");
    if (obj.texts != "") {
      socket.emit("add-question", obj);
      console.log(obj);
      // setDataList((dataList) => [obj, ...dataList]);
      setObj({
        ...obj,
        text: "",
        score: 0,
        voted: false,
      });
    }
    handleSubmitVisibility();
    console.log("render from handleSubmit");
  };
  /* Handles changing the vote of a particular Question.
  # Gets the index of arrays.map
  # Creates a mutable copy of dataList
  # Increments the vote of the particular object queried by the index.
  # Uses setDataList to update the state
  */
  const handleVote = (index) => {
    socket.emit("queue-vote-up", { index, roomName });
    let state = [...dataList];
    state[index] = {
      ...state[index],
      score: state[index].score + 1,
      voted: true,
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
    socket.emit("queue-delete", { index, roomName });
    let state = [...dataList];
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
  const setVote = (dataList, index) => {
    let state = [...dataList];
    state[index] = { ...state[index], score: state[index].score + 1 };
    return state;
  };
  // Helper function for sokcet to delete item.
  const deleteItem = (dataList, index) => {
    let state = [...dataList];
    state.splice(index, 1);
    return state;
  };
  // --------------------------------------------------------------SOCKETS ------------------------------------------------
  React.useEffect(() => {
    socket = io("http://localhost:3000");
    // roomName = `${props.match.params.roomName}/${props.match.params.id}`;
    roomName = room.roomName;
    userName = history.location.state.username;
    setObj({ ...obj, author: userName, room: roomName });
    // Initiate client-side connection----------------------------
    socket.emit("join-room", { roomName, userName });
    // Listening Sockets------------------------------------------
    socket.on("acknowledgeJoin", (roomData) => {
      console.log("Socket Acknowledged");
      // add error boundary for invalid roomData--
      setDataList(roomData.questions);
    });
    socket.on("add-this-question", (data) => {
      console.log(data);
      console.log("addition from server");
      setDataList((dataList) => [data, ...dataList]);
    });
    socket.on("vote-up-onIndex", (index) => {
      setDataList((dataList) => setVote(dataList, index));
    });
    socket.on("delete-question-onIndex", (index) => {
      setDataList((dataList) => deleteItem(dataList, index));
    });
  }, []);
  // --------------------------------------------------------------SOCKETS ------------------------------------------------

  return (
    <React.Fragment>
      {/*---------- Conditionally rendering the Question List both initially and after recieving data---------- */}
      {dataList.length == 0 && visibility.list ? (
        <div className={`question-container`}>
          <div className="no-list-text"> No questions yet</div>
        </div>
      ) : visibility.list ? (
        <List
          dataList={dataList}
          handleVote={handleVote}
          handleDelete={handleDelete}
        />
      ) : null}

      {/*------------------------------------- Conditionally rendering the form ------------------------------*/}
      {visibility.form ? (
        <Form
          obj={obj}
          handleOnChange={handleOnChange}
          handleSubmit={handleSubmit}
        />
      ) : null}
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
