import React from 'react';
import List from './List.js';
import Form from './Form.js';
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
				<List dataList={dataList} handleVote={handleVote} handleDelete={handleDelete} />
			) : null}

			{/*------------------------------------- conditionally rendering the form ------------------------------*/}
			{visibility.form ? <Form obj={obj} handleOnChange={handleOnChange} handleSubmit={handleSubmit} /> : null}
			{visibility.post ? (
				<div className={`btn`} onClick={handlePostVisibility}>
					Post a Question...
				</div>
			) : null}
			<div className={`btn`} onClick={() => console.log(dataList)}>
				Log State
			</div>
		</React.Fragment>
	);
};
export default Window;

{
	/* <div className={`btn`} onClick={() => console.log(dataList)}>
Log State
</div> */
}
