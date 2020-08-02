import React from 'react';
import Question from './Question.js';
const Window = () => {
	const [ dataList, setDataList ] = React.useState([]);
	const [ obj, setObj ] = React.useState({
		author: '//fetch from server//',
		texts: '',
		score: 0
	});

	const handleOnChange = (event) => {
		setObj({
			...obj,
			[event.target.name]: event.target.value
		});
	};

	const handleSubmit = () => {
		if (obj.texts != '') {
			dataList.push(obj);
			setDataList(dataList);
			setObj({
				author: '//fetch from server//',
				texts: '',
				score: 0
			});
		}
	};

	const handleVote = (index) => {
		let state = [ ...dataList ];
		state[index] = { ...state[index], score: state[index].score + 1 };
		setDataList(state);
	};
	const handleDelete = (index) => {
		let state = [ ...dataList ];
		state.splice(index, 1);
		setDataList(state);
	};
	return (
		<React.Fragment>
			{dataList.sort((a, b) => b.score - a.score).map((data, index) => (
				<li key={index}>
					<div className="question-box">
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
			<React.Fragment>
				<div className="textbox-shell">
					<textarea
						name="texts"
						type="text"
						className="text-area"
						onChange={handleOnChange}
						value={obj.texts}
						rows="10"
						cols="50"
						placeholder="Ask a question..."
					/>
				</div>
				<div className="btn-submit" onClick={handleSubmit}>
					Submit
				</div>
				<div className="btn-submit" onClick={() => console.log(dataList)}>
					log state
				</div>
			</React.Fragment>
		</React.Fragment>
	);
};

export default Window;

/* 
[
  {
    author,
	text,score
	answered: true/false
  },
   {
    author,
    text,score
  },
   {
    author,
    text,score
  },
   {
    author,
    text,score
  }
]
*/
