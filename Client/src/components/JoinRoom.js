import React from "react";
import { withRouter, useHistory } from "react-router-dom";
const API_URL = "http://localhost:3000";
const JoinRoom = () => {
  const history = useHistory();
  const [button, setButton] = React.useState(false);
  const [room, setRoom] = React.useState({});
  const handleSubmit = () => {
    setButton((button) => !button);
    fetch(`${API_URL}/validate-join`, {
      method: "POST",
      body: JSON.stringify(room),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        res.text().then((data) => {
          if (JSON.parse(data)) {
            history.push({
              pathname: `/set-username`,
              state: { room: room.room },
            });
          } else {
            setButton((button) => !button);
            alert("Incorrect Room ID or Password.");
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = (event) => {
    setRoom({ ...room, [event.target.name]: event.target.value });
  };
  return (
    <form className="center-wrapper" onSubmit={handleSubmit}>
      <input
        className="for-input"
        placeholder="Room ID"
        name="room"
        onChange={handleChange}
      />
      <input
        type="password"
        className="for-input"
        placeholder="Password"
        name="password"
        onChange={handleChange}
      />
      <div
        className={!button ? "btn" : "btn btn-loading"}
        onClick={handleSubmit}
      >
        Submit
      </div>
    </form>
  );
};

export default JoinRoom;
