import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
const API_URL = 'http://localhost:3000';
const CreateRoom = () => {
	const history = useHistory();

	const [ state, setState ] = React.useState({
		room: '',
		password: '',
		adminPassword: ''
	});

	const [ settings, updateSettings ] = React.useState({
		//could probably incorportate this into state?
		profanityFilter: true,
		requirePassword: false
	});
	const [ visibility, setVisibility ] = React.useState({ createRoomForm: true, adminPasswordForm: false });
	const handleSubmit = () => {
		event.preventDefault(); //stop form redirecting
		console.log('SENDING POST');
		fetch(API_URL + '/room', {
			//post request to /room is for inserting a new room to db
			method: 'POST',
			body: JSON.stringify({
				//capture data from the form - could switch to using a formdata object
				title: state.room,
				owner: 'TODO',
				created: new Date(),
				profanityFilter: settings.profanityFilter,
				requirePassword: settings.requirePassword,
				// potential security breach right here---------------------------------------
				password: state.password,
				adminPassword: state.adminPassword
				// potential security breach right here---------------------------------------
			}),
			headers: {
				//set headers (important for serverside parsing)
				'Content-Type': 'application/json'
			}
		})
			.then((res) => res.json()) //interpret the response as JSON -- the server sends back res.json(room)
			.then((responseData) => {
				//if the response is ok then redirect to join the room

				//set the state to the url from the response and redirect to set the username
				history.push({
					pathname: `/room/${responseData.url}/admin`,
					state: { validate: true }
				});
			})
			.catch((err) => {
				//if there was an error or connection failure then redirect to the homepage
				console.error(err);
				history.push({
					pathname: '/'
				});
			});
	};
	const validateCreateRoom = () => {
		if (state.room == '') {
			alert('Room name can be Empty');
			return false;
		} else if (settings.requirePassword && state.password == '') {
			alert("Password can't be empty");
			return false;
		} else {
			return true;
		}
	};
	const validateAdminPassword = () => {
		if (state.adminPassword == '') {
			alert("Admin password can't be empty");
			return false;
		} else {
			return true;
		}
	};

	console.log(state);
	console.log(settings);
	return visibility.createRoomForm ? (
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

			<div
				className="btn"
				onClick={() => {
					if (validateCreateRoom() == true) setVisibility({ createRoomForm: false, adminPasswordForm: true });
				}}
			>
				Create Room
			</div>
		</form>
	) : (
		<div className="admin-pass-container">
			<form className="admin-pass-form">
				<input
					value={state.adminPassword}
					type="password"
					placeholder="Enter Admin Password"
					name="adminPassword"
					className="room-input admin-pass-input"
					onChange={(event) => {
						setState(Object.assign({ ...state }, { adminPassword: event.target.value }));
					}}
				/>
				<div
					className="btn btn-admin-pass"
					onClick={() => {
						if (validateAdminPassword() == true) {
							handleSubmit();
						}
					}}
				>
					Submit
				</div>
				<div
					className="btn btn-admin-pass"
					onClick={() => {
						console.log(state);
					}}
				>
					log
				</div>
			</form>
		</div>
	);
};

export default CreateRoom;
