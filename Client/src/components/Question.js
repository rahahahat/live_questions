import React from "react";

const Question = (props) => {
  return (
    <React.Fragment>
      <div className="author">Author: {props.val.author}</div>
      <div className="text">Question: {props.val.text}</div>
      <div className="score">Votes: {props.val.score}</div>
    </React.Fragment>
  );
};
export default Question;

// <div className="btn-voteup" onClick={handleVoteUp}>
// Vote Up
// </div>
