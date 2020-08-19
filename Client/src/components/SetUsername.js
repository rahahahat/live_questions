import React from "react";
import { withRouter } from "react-router-dom";
import InputForm from "./InputForm.js";

var room_name = "DEFAULT_USERNAME";

const SetUsername = (props) => {
  console.log(props);
  React.useEffect(() => {
    room_name = props.history.location.state.room_name;
  }, []);
  const [username, SetUsername] = React.useState({});
  const handleChange = (event) => {
    SetUsername({ [event.target.name]: event.target.value });
  };
  const handleSubmit = () => {
    props.history.push({
      pathname: `/questions/${room_name}`,
      state: { username: username.username },
    });
  };
  return (
    <InputForm
      inp_placeholder={"Enter a display name"}
      pass_placeholder={undefined}
      inp_className={"for-input"}
      pass_className={undefined}
      onChange={handleChange}
      onClick={handleSubmit}
      inputName={"username"}
      passName={undefined}
      inputRequired={true}
      passRequired={false}
      buttonText={"submit"}
    />
  );
};

export default withRouter(SetUsername);
