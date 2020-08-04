import React from 'react';
import Question from './Question.js';
const Window = () => {
	const [ visibility, setVisibility ] = React.useState({
		form: false,
		list: true,
		post: true
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
		setVisibility({ form: false, list: true, post: true });
	};

	const handlePostVisibility = () => {
		setVisibility({ form: true, list: false, post: false });
	};
	return (
		<React.Fragment>
			{/*---------- Conditionally rendering the Question List both initially and after recieving data---------- */}
			{dataList.length == 0 && visibility.list ? (
				<div className={`question-container`}>
					<h1 className="no-list-text"> No Questions Yet...</h1>
				</div>
			) : visibility.list ? (
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
			) : null}

			{/*--------------------- conditionally rendering the form -----------------*/}
			{visibility.form ? (
				<React.Fragment>
					<div className={`form-area`}>
						<div className={`textbox-shell`}>
							<textarea
								name="texts"
								type="text"
								className={`text-area`}
								onChange={handleOnChange}
								value={obj.texts}
								rows="1"
								cols="80"
								placeholder="Ask a question..."
							/>
						</div>
						<div className={`btn`} onClick={handleSubmit}>
							Submit
						</div>
					</div>
				</React.Fragment>
			) : null}
			{visibility.post ? (
				<div className={`${visibility.post} btn`} onClick={handlePostVisibility}>
					Post a Question...
				</div>
			) : null}
		</React.Fragment>
	);
};
export default Window;

// <div className={`btn`} onClick={() => console.log(dataList)}>
// Log State
// </div>
