import React from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import '../css/joinRoom.css';
const API_URL = 'http://localhost:3000';
const JoinRoom = () => {
	const history = useHistory();
	const [ button, setButton ] = React.useState(false);
	const [ room, setRoom ] = React.useState({ room: '', password: '' });
	const handleSubmit = () => {
		event.preventDefault();
		setButton((button) => !button);
		fetch(`${API_URL}/validate-join`, {
			method: 'POST',
			body: JSON.stringify(room),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => {
				res.text().then((data) => {
					if (JSON.parse(data)) {
						history.push({
							pathname: `/room/${room.room}`,
							state: { validated: true }
						});
					} else {
						setButton((button) => !button);
						alert('Incorrect Room ID or Password.');
					}
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const handleChange = (event) => {
		setRoom({ ...room, [event.target.name]: event.target.value });
	};
	return (
		<form className="center-wrapper join-wrapper" onSubmit={handleSubmit}>
			<input className="for-input" placeholder="Room ID" name="room" onChange={handleChange} />
			<input
				type="password"
				className="for-input"
				placeholder="Password"
				name="password"
				onChange={handleChange}
			/>
			<button className={'btn btn-join'} onClick={handleSubmit}>
				Submit
			</button>
			{!button ? null : (
				<div className="loadingio-spinner-spinner-ndjd8y7s7h">
					<div className="ldio-ahkvf3u3d7c">
						<div />
						<div />
						<div />
						<div />
						<div />
						<div />
						<div />
						<div />
						<div />
						<div />
						<div />
						<div />
						<div />
						<div />
						<div />
					</div>
				</div>
			)}
		</form>
	);
};

export default JoinRoom;
