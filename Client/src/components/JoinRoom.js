import React from "react";
import { withRouter, useHistory } from "react-router-dom";
const JoinRoom = (props) => {
  const history = useHistory();
  const [state, setState] = React.useState("/");
  return (
    <div className="center-wrapper">
      <input
        className="for-input"
        placeholder="Room name"
        name="room"
        onChange={(event) => {
          setState({ [event.target.name]: event.target.value });
        }}
      />
      {/* <input type="password" className="for-input" placeholder="Password" /> */}
      <div
        className="btn"
        onClick={() => {
          history.push({
            pathname: `/set-username`,
            state: { status: true },
          });
        }}
      >
        Submit
      </div>
    </div>
  );
};

export default JoinRoom;
