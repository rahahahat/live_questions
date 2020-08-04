import React from 'react';
import Question from './Question.js';
const Window = () => {
	const [ visibility, setVisibility ] = React.useState({
		form: false,
		list: false,
		post: true,
		position: true
	});
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
		handleSubmitVisibility();
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

	const handleSubmitVisibility = () => {
		setVisibility({ form: false, list: true, post: true, position: false });
	};

	const handlePostVisibility = () => {
		setVisibility({ ...visibility, form: true, list: false, post: false, position: false });
	};
	return (
		<React.Fragment>
			{dataList.sort((a, b) => b.score - a.score).map((data, index) => (
				<li key={index} className={`${visibility.list}`}>
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
			<React.Fragment>
				<div className={`${visibility.form} form-area`}>
					<div className={`${visibility.form} textbox-shell`}>
						<textarea
							name="texts"
							type="text"
							className={`${visibility.form} text-area`}
							onChange={handleOnChange}
							value={obj.texts}
							rows="1"
							cols="80"
							placeholder="Ask a question..."
						/>
					</div>
					<div className={`${visibility.form} btn`} onClick={handleSubmit}>
						Submit
					</div>
				</div>
				<div className={`${visibility.post} btn-${visibility.position}`} onClick={handlePostVisibility}>
					Post a Question...
				</div>
			</React.Fragment>
		</React.Fragment>
	);
};
export default Window;

// <div className={`btn`} onClick={() => console.log(dataList)}>
// Log State
// </div>
