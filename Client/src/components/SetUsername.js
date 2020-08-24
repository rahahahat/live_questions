import React from "react";
import { useHistory } from "react-router-dom";

var room_name = "DEFAULT_USERNAME";

const SetUsername = () => {
  const history = useHistory();
  console.log(history);

  React.useEffect(() => {
    room_name = history.location.state.room;
  }, []);
  const [userName, setUsername] = React.useState({});
  const handleChange = (event) => {
    setUsername({ [event.target.name]: event.target.value });
  };
  const handleSubmit = () => {
    history.push({
      pathname: `/room/${room_name}`,
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
