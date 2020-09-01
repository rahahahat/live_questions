import React from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import '../css/QuestionAdmin.css';
import Question from './Question';
const QuestionAdmin = ({ question, onDelete, onEdit, index }) => {
	const [ answer, setAnswer ] = React.useState({ ans: '', show: false });
	const handleSubmit = () => {
		event.preventDefault();
		setAnswer((answer) => ({ ...answer, show: !answer.show }));
	};
	const handleChange = (event) => {
		setAnswer({ ...answer, [event.target.name]: event.target.value });
	};
	return (
		<div className="question-admin-container">
			{/* -------------------Detail Section---------------------- */}
			<div className="admin-detail-section">
				<div className="admin-detail">Question: {question.text}</div>
				<div className="admin-detail">Author: {question.author}</div>
				<div className="admin-detail">Votes: {question.score}</div>
				{!answer.show ? (
					<div className="admin-detail">Answer: {answer.ans}</div>
				) : (
					<form className="answer-form" onSubmit={handleSubmit}>
						<textarea
							type="text"
							className="answer-text-area"
							placeholder="Enter Answer"
							name="ans"
							onChange={handleChange}
							value={answer.ans}
						/>
						<button className="answer-submit-button">Submit</button>
					</form>
				)}
			</div>
			{/* ---------------------Control Section--------------------- */}
			<div className="admin-control-section">
				<div className="admin-delete-question">
					<RiDeleteBinLine size={32} />
				</div>
				<div
					className="admin-answer-question"
					onClick={() => {
						setAnswer((answer) => ({ ...answer, show: !answer.show }));
					}}
				>
					{answer.show ? <FiEdit size={27} color={'rgb(13, 201, 138)'} /> : <FiEdit size={27} />}
				</div>
			</div>
		</div>
	);
};

export default QuestionAdmin;
