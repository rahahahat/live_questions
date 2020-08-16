import React from 'react';
import { withRouter } from 'react-router-dom';
const CreateRoom = (props) => {
	const [ state, setState ] = React.useState({ path: '/' });
	return (
		<div className="center-wrapper">
			<input
				className="room-input"
				placeholder="Room Name"
				onChange={(event) => {
					setState({ [event.target.name]: event.target.value });
				}}
				name="path"
			/>
			<div
				className="btn"
				onClick={() => {
					props.history.push({
						pathname: `/questions/${state.path}/${Date.now()}`
					});
				}}
			>
				Create Room
			</div>
		</div>
	);
};

export default withRouter(CreateRoom);
