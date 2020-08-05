import React from "react";
import { Link } from "react-router-dom";
const CreateRoom = () => {
  return (
    <div className="center-wrapper">
      <input className="room-input" placeholder="Room Name" />
      <div className="btn">
        <Link to="/questions">Create Room</Link>
      </div>
    </div>
  );
};

export default CreateRoom;
