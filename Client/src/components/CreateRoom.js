import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
const API_URL = "http://localhost:3000";
const CreateRoom = () => {
  const history = useHistory();
  console.log(history);
  const [state, setState] = React.useState({});

  const handleSubmit = () => {
    event.preventDefault();
    fetch(API_URL + "/room", {
      method: "POST",
      body: JSON.stringify({
        url: state.room,
        owner: "TODO",
        created: new Date(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        history.push({
          pathname: "/set-username",
          state: { room: state.room },
        });
      })
      .catch(console.error);
  };
  return (
    <div className="center-wrapper">
      <input
        className="room-input"
        placeholder="Enter a room name"
        onChange={(event) => {
          setState({ [event.target.name]: event.target.value });
        }}
        name="room"
      />
      <div className="btn" onClick={handleSubmit}>
        Create Room
      </div>
    </div>
  );
};

export default CreateRoom;
