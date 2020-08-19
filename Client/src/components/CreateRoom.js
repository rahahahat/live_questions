import React from "react";
import { withRouter } from "react-router-dom";
const CreateRoom = (props) => {
  console.log(props);
  const [state, setState] = React.useState({});
  return (
    <div className="center-wrapper">
      <input
        className="room-input"
        placeholder="Room Name"
        onChange={(event) => {
          setState({ [event.target.name]: event.target.value });
        }}
        name="room"
      />
      <div
        className="btn"
        onClick={() => {
          props.history.push({
            pathname: `/set-user-name`,
            state: { room_name: state.room },
          });
        }}
      >
        Create Room
      </div>
    </div>
  );
};

export default withRouter(CreateRoom);
