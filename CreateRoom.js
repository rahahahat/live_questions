import React from 'react';
import { Link, withRouter } from 'react-router-dom';
const CreateRoom = (props) => {
	console.log(props);
	return (
		<div className="center-wrapper">
			<input className="room-input" placeholder="Room Name" />
			<div
				className="btn"
				onClick={() => {
					props.history.push({
						pathname: '/questions',
						state: { permission: true }
					});
				}}
			>
				Create Room
			</div>
		</div>
	);
};

export default withRouter(CreateRoom);
