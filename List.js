import React from 'react';
import Question from './Question.js';

const List = ({ dataList, handleVote, handleDelete }) => {
	return (
		<div className={`question-container`}>
			{dataList.sort((a, b) => b.score - a.score).map((data, index) => (
				<li key={index}>
					<div className={`question-box`}>
						<Question val={data} />
						<div className="btn-voteup" onClick={() => handleVote(index)}>
							Vote Up
						</div>
						<div className="btn-delete" onClick={() => handleDelete(index)}>
							Delete
						</div>
					</div>
				</li>
			))}
		</div>
	);
};

export default List;
