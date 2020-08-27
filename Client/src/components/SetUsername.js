import React from "react";
import { useHistory } from "react-router-dom";

var room = "DEFAULT";

const SetUsername = () => {
  const history = useHistory();
  console.log(history);

  React.useEffect(() => {
    console.log(history.location.state);
    room = history.location.state.room;
  }, []);

  const [userName, setUsername] = React.useState({});
  const handleChange = (event) => {
    setUsername({ [event.target.name]: event.target.value });
  };
  const handleSubmit = (event) => {
    event.preventDefault(); //stop form redirect
    history.push({
      pathname: `/room/${room}`,
      state: { username: userName.username },
    });
  };
  return (
    <form className="center-wrapper" onSubmit={handleSubmit}>
      <input className="room-input" placeholder="Enter a display name" name="username" onChange={handleChange} />
      <button className="btn">Submit</button>
    </form>
  );
};

export default SetUsername;
