import React from 'react';

const UserList = ({ clientList, kick }) => {
	return clientList.length == 0 ? (
		<div className="moderator-user-list">
			<div className="no-clients">No clients connected yet.</div>
		</div>
	) : (
		<div className="moderator-user-list">
			{clientList.map((client) => (
				<div className="moderator-user-list-item" key={client.id}>
					<div className="list-username">{client.username}</div>
					<button className="kick-button" onClick={() => kick(client.id)}>
						Kick
					</button>
				</div>
			))}
		</div>
	);
};

export default UserList;
