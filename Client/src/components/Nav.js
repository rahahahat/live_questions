import React from "react";
import {
  Link,
  useHistory,
  BrowserRouter as Router,
  Switch,
  withRouter,
} from "react-router-dom";
const Nav = (props) => {
  const history = useHistory();
  return (
    <div className="center-wrapper">
      <div
        className="btn-fixed"
        onClick={() => {
          props.history.push({
            pathname: "/create",
            state: { status: true },
          });
        }}
      >
        Create Room
      </div>
      <div style={{ textAlign: "center" }}>or</div>
      <div
        className="btn-fixed"
        onClick={() => {
          history.push("/Join");
        }}
      >
        Join Room
      </div>
    </div>
  );
};
export default Nav;
