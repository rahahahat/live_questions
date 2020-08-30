import React from 'react';
const QuestionUser = ({ voteUp, isVoted, deleteQuestion, author, question, votes, answer }) => {
	const [ viewAnswer, setViewAnswer ] = React.useState(false);
	return (
		<div className="Question-container user-question-container">
			<div>Author: {author}</div>
			<div>Question: {question}</div>
			<div>Votes: {votes}</div>
		</div>
	);
};
