import React from "react";
import QuestionUser from "./QuestionUser.js";

const List = React.memo(({ dataList, handleVote, roomUrl }) => {
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
              id={data.id}
              index={index}
              voteUp={handleVote}
              author={data.author}
              question={data.text}
              votes={data.score}
              answer={data.answer}
              isVoted={data.voted}
              roomUrl={roomUrl}
            />
          </li>
        ))}
    </div>
  );
});

export default List;
