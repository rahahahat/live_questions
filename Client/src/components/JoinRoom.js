import React from "react";
import { withRouter, useHistory } from "react-router-dom";
const API_URL = "http://localhost:3000";
const JoinRoom = () => {
  const history = useHistory();
  const [state, setState] = React.useState({});
  const handleSubmit = () => {
    event.preventDefault();
    fetch(`${API_URL}/${state.room}`).then((res) => {
      if (!res.ok) {
        console.log("Error joining room!");
      }
      history.push({
        pathname: `/set-username`,
        state: { room: state.room },
      });
    });
  };
  return (
    <form className="center-wrapper" onSubmit={handleSubmit}>
      <input
        className="for-input"
        placeholder="Room to join"
        name="room"
        onChange={(event) => {
          setState({ [event.target.name]: event.target.value });
        }}
      />
      {/* <input type="password" className="for-input" placeholder="Password" /> */}
      <button className="btn">Submit</button>
    </form>
  );
};

export default JoinRoom;
