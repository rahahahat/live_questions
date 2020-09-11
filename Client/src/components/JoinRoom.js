import React from "react";
import { withRouter, useHistory } from "react-router-dom";
import "../css/joinRoom.css";
const API_URL = "http://localhost:3000";
const JoinRoom = () => {
  const history = useHistory();
  const [button, setButton] = React.useState(false);
  const [room, setRoom] = React.useState("");
  const handleSubmit = () => {
    event.preventDefault();
    setButton((button) => !button);
    fetch(`${API_URL}/room/${room}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        res.text().then((data) => {
          if (JSON.parse(data)) {
            history.push({
              pathname: `/room/${room}`,
            });
          } else {
            //Only called if response has failed - not while response is being sent ??
            setButton((button) => !button);
            alert("Invalid Room ID");
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = (event) => {
    setRoom(event.target.value);
  };
  return (
    <form className="center-wrapper join-wrapper" onSubmit={handleSubmit}>
      <input
        className="for-input"
        placeholder="Room ID"
        name="room"
        onChange={handleChange}
        required
      />
      <button className={"btn btn-join"}>Join</button>
      {!button ? null : (
        <div className="loadingio-spinner-spinner-ndjd8y7s7h">
          <div className="ldio-ahkvf3u3d7c">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      )}
    </form>
  );
};

export default JoinRoom;
