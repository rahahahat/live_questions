import React from 'react';
import { Link } from 'react-router-dom';
const Nav = () => {
	console.log('HI');
	return (
		<div className="center-wrapper">
			<Link to="/create-room">
				<div className="btn-fixed">Create Room</div>
			</Link>
			<div style={{ textAlign: 'center' }}>or</div>
			<Link to="/join-room">
				<div className="btn-fixed">Join Room</div>
			</Link>
		</div>
	);
};
export default Nav;
