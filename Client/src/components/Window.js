import React, { useReducer } from "react";
import List from "./List.js";
import QuestionForm from "./QuestionForm.js";
import io from "socket.io-client";
import { useParams, useHistory } from "react-router-dom";
import RoomLogin from "./RoomLogin";
import { reducer } from "../../Tests/TestUtils/reducerTestUtils.js";
const API_URL = "http://localhost:3000";
let socket;
let roomUrl = "DEFAULT";
let id;
let history;
let room;

const init = {
  questions: [],
  loggedIn: false,
  requirePassword: false,
  displayName: "",
  visibility: {
    form: false,
    list: false,
    post: false,
  },
  allowQuestion: false,
  initQuestionState: {
    _id: "0",
    author: "TODO",
    text: "",
    score: 0,
    voted: false,
    room: "",
    answer: "",
  },
  loginInputs: {
    name: "",
    password: "",
  },
};

const Window = () => {
  history = useHistory();
  room = useParams();
  const [windowState, dispatch] = useReducer(reducer, init);
  // +++++++++++++++++++++++++++++++++++++++++++ Handler Functions +++++++++++++++++++++++++++++++++++++++++
  const handleLoginInputChange = (event) => {
    if (event.target.name == "name") {
      dispatch({
        type: "setLoginUsername",
        payload: {
          data: event.target.value,
        },
      });
    } else {
      dispatch({
        type: "setLoginPassword",
        payload: {
          data: event.target.value,
        },
      });
    }
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    fetch(`${API_URL}/room/${roomUrl}/login`, {
      method: "POST",
      body: JSON.stringify(windowState.loginInputs),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        console.log(res.headers);
        if (res.ok) {
          dispatch({
            type: "onLoginSubmit",
            payload: {
              name: windowState.loginInputs.name,
              roomUrl: roomUrl,
            },
          });
          socket.emit("join-room", {
            roomUrl,
            user: windowState.loginInputs.name,
          });
        } else {
          console.log("401:", res);
          alert("login failed");
          return false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Handles the change in the form component.
  const handleQuestionFormOnChange = (event) => {
    dispatch({
      type: "setQuestionTextOnFormChange",
      payload: {
        questionText: event.target.value,
      },
    });
  };

  //Handles the submit in the form component.
  const handleQuestionFormSubmit = (event) => {
    event.preventDefault();
    if (windowState.initQuestionState.text != "") {
      socket.emit("add-question", windowState.initQuestionState);
      dispatch({ type: "setInitialQuestionState" });
    }
    dispatch({ type: "afterSubmitClickVisibility" });
  };

  // Handles changing the vote of a particular Question.
  const handleVote = (id, index, roomUrl) => {
    socket.emit("vote-up", { id, roomUrl });
    dispatch({
      type: "handleVoteUpOnBtnClick",
      payload: {
        index: index,
      },
    });
  };

  // --------------------------------------------------------------SOCKETS ------------------------------------------------
  React.useEffect(() => {
    roomUrl = room.roomUrl;
    //INITIAL FETCH CHECKS IF ROOM IS REAL AND IF PASSWORD IS REQUIRED
    fetch(`${API_URL}/room/${roomUrl}`, {
      method: "POST",
      body: JSON.stringify({ url: roomUrl }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json(); //room found - return response body
        return false; // else return false
      })
      .then((response_body) => {
        if (response_body) {
          console.log("ISAUTH:", response_body.authenticated);
          if (response_body.authenticated) {
            dispatch({
              type: "onAuthInitialUseEffect",
              payload: {
                roomUrl: roomUrl,
              },
            });
            //+++++++++++++++++++++++++++++++++ GET FROM TOKEN TODO++++++++++++++++++++++++++++++++
            socket.emit("join-room", { roomUrl, user: "TODO" });
          } else {
            dispatch({
              type: "setPasswordRequirement",
              payload: {
                data: response_body.requirePassword,
              },
            });
          }
        } else {
          alert("room doesnt exist");
        }
      });
    //++++++++++++++++++++++++++++++++++++++++ Listening Sockets ++++++++++++++++++++++++++++++++++++++++++
    socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("Connected to server: ", socket.connected);
    });
    socket.on("acknowledge-join", (roomData) => {
      console.log("Socket Acknowledged");
      dispatch({
        type: "setQuestionsOnAcknowledgeJoin",
        payload: {
          questions: roomData.questions,
        },
      });
    });
    socket.on("room-not-found", () => {
      history.push("/");
    });
    socket.on("add-question", (data) => {
      dispatch({
        type: "addQuestionToList",
        payload: {
          question: data,
        },
      });
    });
    socket.on("vote-up", (id) => {
      dispatch({
        type: "voteUpOnSocket",
        payload: {
          id: id,
        },
      });
    });
    socket.on("delete-question", (id) => {
      dispatch({
        type: "deleteQuestionOnSocket",
        payload: {
          id: id,
        },
      });
    });
    socket.on("kicked", (msg) => {
      alert(msg);
      socket.disconnect();
      history.push("/");
    });
    socket.on("add-the-answer", (result) => {
      dispatch({
        type: "addAnswerOnSocket",
        payload: {
          answer: result.answer,
          id: result._id,
        },
      });
    });
    socket.on("toggle-questions", (onOrOff) => {
      console.log("Toggling questions", onOrOff);
      dispatch({
        type: "toggleAllowQuestion",
        payload: {
          data: onOrOff,
        },
      });
    });
    socket.on("disconnect", () => {
      console.log("Connected to server: ", socket.connected); // false
    });
  }, []);

  //++++++++++++++++++++++++++++++++ rendering ++++++++++++++++++++++++++++++++++++++++++++
  return (
    <React.Fragment>
      {!windowState.loggedIn ? ( //TODO ?? : changed to (loggenIn && isAuthenticated)
        <RoomLogin
          requirePassword={windowState.requirePassword}
          handleInputChange={handleLoginInputChange}
          handleSubmit={handleLoginSubmit}
        />
      ) : (
        <React.Fragment>
          {windowState.visibility.list && (
            <List
              dataList={windowState.questions}
              handleVote={handleVote}
              roomUrl={roomUrl}
            />
          )}
          {windowState.visibility.form && (
            <QuestionForm
              questionState={windowState.initQuestionState}
              handleOnChange={handleQuestionFormOnChange}
              handleSubmit={handleQuestionFormSubmit}
            />
          )}
          {windowState.visibility.post && (
            <React.Fragment>
              <button
                className={`btn`}
                onClick={() => {
                  dispatch({ type: "afterPostClickVisibility" });
                }}
              >
                Post a Question...
              </button>
              <button
                className={`btn`}
                onClick={() => console.log(windowState.questions)}
              >
                Log State
              </button>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
export default Window;
