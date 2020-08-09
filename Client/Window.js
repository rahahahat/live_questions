import React from "react";
import List from "./List.js";
import Form from "./Form.js";
import io from "socket.io-client";
const socket = io("http://localhost:3000");
const Window = (props) => {
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
    texts: "",
    score: 0,
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
  # Sets specified visibility and emits the new state.
  */
  const handleSubmit = () => {
    if (obj.texts != "") {
      dataList.push(obj);
      setDataList(dataList);
      setObj({
        author: "//fetch from server//",
        texts: "",
        score: 0,
      });
    }
    handleSubmitVisibility();
    socket.emit("update-to-questions", dataList);
  };
  /* Handles changing the vote of a particular Question.
  # Gets the index of arrays.map
  # Creates a mutable copy of dataList
  # Increments the vote of the particular object queried by the index.
  # Uses setDataList to update the state
  */
  const handleVote = (index) => {
    let state = [...dataList];
    state[index] = { ...state[index], score: state[index].score + 1 };
    setDataList(state);
    socket.emit("update-to-questions", state);
  };
  /* Handles deleting a particular question object from dataList.
  # Gets the index of arrays.map
  # Creates a mutable copy of dataList
  # Deletes the desired Object using index.
  # Uses setDataList to update the state and emit to emit the change to server.
  */
  const handleDelete = (index) => {
    let state = [...dataList];
    state.splice(index, 1);
    setDataList(state);
    socket.emit("update-to-questions", state);
  };

  //Handles the Visibility after submit of form is clicked.
  const handleSubmitVisibility = () => {
    setVisibility({ form: false, list: true, post: true });
  };

  // Handles the visibility after Post a question is clicked.
  const handlePostVisibility = () => {
    setVisibility({ form: true, list: false, post: false });
  };

  // --------------------------------------------------------------SOCKETS ------------------------------------------------

  // Listens for a to-update message from the server, where-in the data is the dataList that is served to every-client.
  socket.on("to-update", (data) => {
    setDataList(data);
  });
  // --------------------------------------------------------------SOCKETS ------------------------------------------------

  return props.history.location.state.permission ? (
    <React.Fragment>
      {/*---------- Conditionally rendering the Question List both initially and after recieving data---------- */}
      {dataList.length == 0 && visibility.list ? (
        <div className={`question-container`}>
          <h1 className="no-list-text"> No Questions Yet...</h1>
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
        <div className={`btn`} onClick={handlePostVisibility}>
          Post a Question...
        </div>
      ) : null}
    </React.Fragment>
  ) : (
    <div>Error 404 not found!</div>
  );
};
export default Window;

{
  /* <div className={`btn`} onClick={() => console.log(dataList)}>
Log State
</div> */
}
