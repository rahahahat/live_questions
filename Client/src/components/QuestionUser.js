import React from "react";
import "../css/QuestionUser.css";
import Question from "./Question";
const QuestionUser = ({
  index,
  voteUp,
  author,
  question,
  votes,
  answer,
  isVoted,
}) => {
  const [viewAnswer, setViewAnswer] = React.useState(false);
  return (
    <div className="Question-container user-question-container">
      <div className="vote-section">
        {!isVoted ? (
          <div className="vote-button">
            <i
              className="gg-arrow-up-o"
              onClick={() => {
                voteUp(index);
              }}
            ></i>
          </div>
        ) : (
          <div className="vote-button">
            <i className="gg-arrow-up-o green"></i>
          </div>
        )}
        <div className="vote">
          Votes: <span className="votes-text">{votes}</span>
        </div>
      </div>
      <div className="detail-section">
        <div className="detail">Author: {author}</div>
        <div className="detail detail-author">
          <div className="question-text">
            Question: <span>{question}</span>
          </div>
          <div className="flag-icon">
            <i className="gg-flag-alt"></i>
          </div>
        </div>
        {answer != null ? (
          <div className="detail detail-answer">
            <div
              className="view-answer-button"
              onClick={() => {
                setViewAnswer((viewAnswer) => !viewAnswer);
              }}
            >
              View answer
            </div>
            {viewAnswer ? (
              <div className="answer-container">{answer}</div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QuestionUser;
