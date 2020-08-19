import React from "react";
import { useHistory } from "react-router-dom";
import InputForm from "./InputForm.js";

var room_name = "DEFAULT_USERNAME";

const SetUsername = () => {
  const history = useHistory();
  console.log(history);
  // const history = useHistory();
  // console.log(history);
  React.useEffect(() => {
    room_name = history.location.state.status;
  }, []);
  const [username, setUsername] = React.useState({});
  const handleChange = (event) => {
    setUsername({ [event.target.name]: event.target.value });
  };
  const handleSubmit = () => {
    history.push({
      pathname: `/questions/${room_name}`,
      state: { username: username.username },
    });
  };
  console.log(room_name);
  console.log(username.username);
  return (
    <div className="center-wrapper">
      <input
        className="room-input"
        placeholder="Enter a display name"
        name="username"
        onChange={handleChange}
      />
      <div className="btn" onClick={handleSubmit}>
        Submit
      </div>
    </div>
  );
};

export default SetUsername;
