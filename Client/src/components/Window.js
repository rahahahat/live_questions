import React from "react";
import List from "./List.js";
import QuestionForm from "./QuestionForm.js";
import io from "socket.io-client";
import { useParams, useHistory } from "react-router-dom";
import SetDisplayName from "./setDisplayName.js";
import { set } from "mongoose";
import { on } from "../../../Backend/models/room.js";

const API_URL = "http://localhost:3000";
let socket;
let roomUrl = "DEFAULT";
let id;

const Window = () => {
  const history = useHistory();
  const room = useParams();
  // state for password -----------------------------------------------------------------------------------
  const [password, setPassword] = React.useState({ show: false, key: "" });
  // State for username -----------------------------------------------------------------------------------
  const [displayName, setDisplay] = React.useState({ name: "", isSet: true });
  // State that handles conditional rendering for components -----------------------------------------------
  const [visibility, setVisibility] = React.useState({
    form: false,
    list: false,
    post: false,
  });
  // The dataList State which handles all the questions -----------------------------------------------------
  const [dataList, setDataList] = React.useState([]);

  // Temporary state for appending new entries to dataList --------------------------------------------------
  const [questionState, setQuestionState] = React.useState({
    _id: "0",
    author: "//fetch from server//",
    text: "",
    score: 0,
    voted: false,
    room: "",
  });

  //whether or not questions are allowed in the room at this time
  const [allowQuestions, setAllowQuestions] = React.useState(true);

  // ---------------------------------------------- Handler Functions ----------------------------------------

  // Handles the change in the form component.
  const handleQuestionFormOnChange = (event) => {
    setQuestionState({
      ...questionState,
      [event.target.name]: event.target.value,
    });
    socket;
    let roomUrl = "DEFAULT";
    let userName = "DEFAULT_USERNAME";
  };

  //Handles the submit in the form component.
  const handleQuestionFormSubmit = (event) => {
    event.preventDefault();
    if (questionState.text != "") {
      socket.emit("add-question", questionState);
      console.log(questionState);
      setQuestionState({
        ...questionState,
        text: "",
        score: 0,
        voted: false,
        room: roomName,
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

  // handle submit for display name;
  const handleDisplaySubmit = () => {
    event.preventDefault();
    var user = displayName.name;
    setQuestionState((questionState) => ({
      ...questionState,
      author: user,
      room: roomUrl,
    }));
    socket.emit("join-room", { roomUrl, user });
    setVisibility({
      form: false,
      list: true,
      post: true,
    });
    setDisplay({ ...displayName, isSet: true });
  };
  // handle change for display name
  const handleDisplayChange = (event) => {
    setDisplay({ ...displayName, [event.target.name]: event.target.value });
  };
  // handle submit for password
  const handlePasswordSubmit = () => {
    event.preventDefault();
    fetch(`${API_URL}/validate-password`, {
      method: "POST",
      body: JSON.stringify({ password: password.key, id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.text().then((result) => {
        if (JSON.parse(result)) {
          setPassword({ show: false });
          setDisplay({ ...displayName, isSet: false });
        } else {
          alert("Wrong Password");
        }
      });
    });
  };
  // handle change for password
  const handlePasswordChange = (event) => {
    setPassword({ ...password, [event.target.name]: event.target.value });
  };
  // --------------------------------------------------------------SOCKETS ------------------------------------------------
  React.useEffect(() => {
    roomUrl = room.roomUrl;
    // User-Validation conditional fetch
    if (history.location.state == null) {
      fetch(`${API_URL}/validate-url`, {
        method: "POST",
        body: JSON.stringify({ room: roomUrl }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log("a");
          res
            .text()
            .then((result) => {
              console.log(typeof result);
              if (!JSON.parse(result)) {
                history.push("/");
              } else {
                console.log(JSON.parse(result));
                return JSON.parse(result);
              }
            })
            .then((roomData) => {
              console.log(roomData);
              id = roomData.roomID;
              console.log(roomData.needPassword);
              if (roomData.needPassword) {
                setPassword((password) => ({ ...password, show: true }));
              } else {
                setDisplay({ ...displayName, isSet: false });
              }
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setDisplay({ ...displayName, isSet: false });
    }
    socket = io("http://localhost:3000");
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

    socket.on("kicked", (msg) => {
      alert(msg);
      socket.disconnect();
      history.push("/");
    });

    //moderator turns questions on or off for a room
    socket.on("toggle-questions", (onOrOff) => {
      console.log("Toggling questions", onOrOff);
      setAllowQuestions(onOrOff);
    });

    socket.on("disconnect", () => {
      console.log("Connected to server: ", socket.connected); // false
    });
  }, []);

  //--------------------------rendering---------------------------------
  return (
    <React.Fragment>
      {password.show && (
        <form className="center-wrapper" onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            className="room-input"
            placeholder="Enter password"
            name="key"
            onChange={handlePasswordChange}
          />
          <button className="btn">Submit</button>
        </form>
      )}
      {!displayName.isSet && (
        <SetDisplayName
          handleChange={handleDisplayChange}
          handleSubmit={handleDisplaySubmit}
        />
      )}
      {visibility.list && (
        <List
          dataList={dataList}
          handleVote={handleVote}
          handleDelete={handleDelete}
        />
      )}
      {visibility.form && (
        <QuestionForm
          questionState={questionState}
          handleOnChange={handleQuestionFormOnChange}
          handleSubmit={handleQuestionFormSubmit}
        />
      )}
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

      <h1>Questions allowed? : {allowQuestions ? "Yes" : "No"}</h1>

      {/* <div
				className="btn"
				onClick={() => {
					socket.disconnect();
					history.push('/');
				}}
			>
				Leave Room
			</div> */}
    </React.Fragment>
  );
};
export default Window;
