import React from 'react';

const RoomLogin = ({ requirePassword, handleSubmit, handleInputChange }) => {

    return (
        <form className="center-wrapper" onSubmit={handleSubmit}>
            <input className="room-input" placeholder="Enter a display name" name="name" onChange={handleInputChange} />
            <br />
            {requirePassword && (<input
                type="password"
                className="room-input"
                placeholder="Enter password"
                name="password"
                onChange={handleInputChange}
                required={requirePassword}
            />)}
            <button className="btn">Submit</button>
        </form>
    );
};

export default RoomLogin;