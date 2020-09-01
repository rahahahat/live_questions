import React from "react";

const UserList = ({ clientList, kick }) => {
  return clientList.length == 0 ? (
    <div className="moderator-user-list">
      <p className="no-clients">no clients</p>
    </div>
  ) : (
    <div className="moderator-user-list">
      {clientList.map((client) => (
        <div className="moderator-user-list-item" key={client.id}>
          <p>{client.username}</p>
          <button onClick={() => kick(client.id)}>Kick</button>
        </div>
      ))}
    </div>
  );
};

export default UserList;
