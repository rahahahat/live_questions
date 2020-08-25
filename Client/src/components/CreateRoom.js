import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
const API_URL = "http://localhost:3000";
const CreateRoom = () => {
  const history = useHistory();
  console.log(history);
  const [state, setState] = React.useState({
    room: "",
    pasword: "",
  });
  const [password, setPassword] = React.useState();
  //todo: add state for password
  const [settings, updateSettings] = React.useState({
    profanityFilter: true,
    requirePassword: false,
  });

  const handleSubmit = () => {
    event.preventDefault(); //stop form redirecting

    fetch(API_URL + "/room", {
      //post request to /room is for inserting a new room to db
      method: "POST",
      body: JSON.stringify({
        //capture data from the form - could switch to using a formdata object
        url: state.room,
        owner: "TODO",
        created: new Date(),
        profanityFilter: settings.profanityFilter,
        requirePassword: settings.requirePassword,
        password: state.password,
      }),
      headers: {
        //set headers (important for serverside parsing)
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          //if the response is ok then redirect to join the room
          history.push({
            pathname: "/set-username",
            state: { room: state.room },
          });
        } else {
          console.error("CreateRoom Failed");
        }
      })
      .catch(console.error);
  };

  return (
    <form className="center-wrapper" onSubmit={handleSubmit}>
      <input
        className="room-input"
        placeholder="Enter a room name"
        onChange={(event) => {
          setState(Object.assign({ ...state }, { room: event.target.value }));
        }}
        name="room"
      />
      <br />

      {settings.requirePassword && (
        <input
          type="password"
          placeholder="password"
          name="password"
          className="room-input"
          required={settings.requirePassword}
          onChange={(event) => {
            setState(Object.assign({ ...state }, { password: event.target.value }));
          }}
        />
      )}

      <br />

      <label htmlFor="profanityFilter">Use Profanity Filter: </label>
      <input
        type="checkbox"
        name="profanityFilter"
        defaultChecked={settings.profanityFilter}
        onChange={(event) => {
          //update settings - use {...settings} becase you should always work on copy of state then update
          event.target.checked
            ? updateSettings(Object.assign({ ...settings }, { profanityFilter: true }))
            : updateSettings(Object.assign({ ...settings }, { profanityFilter: false }));
        }}
      />

      <br />

      <label htmlFor="passwordProtect">Password Protect Room: </label>
      <input
        type="checkbox"
        name="passwordProtect"
        defaultChecked={settings.requirePassword}
        onChange={(event) => {
          //update settings - use {...settings} becase you should always work on copy of state then update
          event.target.checked
            ? updateSettings(Object.assign({ ...settings }, { requirePassword: true }))
            : updateSettings(Object.assign({ ...settings }, { requirePassword: false }));
        }}
      />

      <br />

      <button className="btn">Create Room</button>
    </form> //end centre wrapper
  );
};

export default CreateRoom;
