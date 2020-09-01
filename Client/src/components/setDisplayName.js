import React from 'react';

const SetDisplayName = ({ handleSubmit, handleChange }) => {
	return (
		<form className="center-wrapper" onSubmit={handleSubmit}>
			<input className="room-input" placeholder="Enter a display name" name="name" onChange={handleChange} />
			<button className="btn">Submit</button>
		</form>
	);
};

export default SetDisplayName;
