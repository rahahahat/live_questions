import React from "react";
import Question from "./Question.js";
import QuestionUser from "./QuestionUser.js";

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
            <QuestionUser
              index={index}
              voteUp={handleVote}
              author={data.author}
              question={data.text}
              votes={data.score}
              answer={data.answer}
              isVoted={data.voted}
            />
            {/* <div className={`question-box`}>
              <Question val={data} />
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
            </div> */}
          </li>
        ))}
    </div>
  );
};

export default List;
