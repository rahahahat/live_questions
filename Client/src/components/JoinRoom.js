import React from 'react';
import { withRouter } from 'react-router-dom';
const JoinRoom = (props) => {
	const [ state, setState ] = React.useState('/');
	return (
		<div className="center-wrapper">
			<input
				className="for-input"
				placeholder="Room name"
				name="room"
				onChange={(event) => {
					setState({ [event.target.name]: event.target.value });
				}}
			/>
			{/* <input type="password" className="for-input" placeholder="Password" /> */}
			<div
				className="btn"
				onClick={() => {
					props.history.push({
						pathname: `/questions/${state.room}`
					});
				}}
			>
				Submit
			</div>
		</div>
	);
};

export default withRouter(JoinRoom);
