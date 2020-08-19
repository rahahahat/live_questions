import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
const CreateRoom = (props) => {
  const history = useHistory();
  // const location = useLocation();
  console.log(history);
  // const [state, setState] = React.useState({});
  return (
    <div className="center-wrapper">
      <input
        className="room-input"
        placeholder="Room Name"
        // onChange={(event) => {
        //   setState({ [event.target.name]: event.target.value });
        // }}
        name="room"
      />
      <div
        className="btn"
        onClick={() => {
          history.push({
            pathname: "/set-username",
            state: { status: false },
          });
        }}
      >
        Create Room
      </div>
    </div>
  );
};

export default CreateRoom;
