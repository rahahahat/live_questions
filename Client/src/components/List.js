import React from "react";
import Question from "./Question.js";
import io from "socket.io-client";
// const socket = io('http://localhost:3000');
const List = ({ dataList, handleVote, handleDelete }) => {
  return (
    <div className={`question-container`}>
      {dataList
        .sort((a, b) => b.score - a.score)
        .map((data, index) => (
          <li key={index}>
            <div className={`question-box`}>
              <Question val={data} />
              {/* render vote-up if and only if you, havent votd yet! */}
              {!data.voted ? (
                <div
                  className="btn-voteup"
                  onClick={() => {
                    handleVote(index);
                  }}
                >
                  Vote Up
                </div>
              ) : null}
              <div
                className="btn-delete"
                onClick={() => {
                  handleDelete(index);
                }}
              >
                Delete
              </div>
            </div>
          </li>
        ))}
    </div>
  );
};

export default List;
