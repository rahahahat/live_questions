import React from "react";
import Question from "./Question.js";

const List = ({ dataList, handleVote, handleDelete }) => {
  return dataList.length == 0 ? (
    //if datalist contains no questions then render the noquestionsyet box
    <div className={`question-container`}>
      <div className="no-list-text"> No questions yet</div>
    </div>
  ) : (
    <div className={`question-container`}>
      {dataList
        .sort((a, b) => b.score - a.score)
        .map((data, index) => (
          <li key={index}>
            <div className={`question-box`}>
              <Question val={data} />
              {/* render vote-up if and only if you, havent voted yet! */}
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
