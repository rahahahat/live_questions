import { TEST_ROOM, TEST_QUESTION } from "./test_vars.js";

const init = {
  questions: [],
  clients: [],
  title: "",
  allowQuestions: true,
  adminPassword: "",
  visibility: {
    loading: true,
    passwordForm: false,
  },
};

const setVote = (dataList, id) => {
  let state = [...dataList];
  let index = state.findIndex((question) => {
    return question._id == id;
  });
  state[index] = { ...state[index], score: state[index].score + 1 };
  return state;
};

const setAnswer = (answer, dataList, id) => {
  let state = [...dataList];
  let index = state.findIndex((question) => {
    return question._id == id;
  });
  state[index] = { ...state[index], answer: answer };
  return state;
};

const deleteQuestion = (questions, id) => {
  let state = [...questions];
  let index = state.findIndex((question) => {
    return question._id == id;
  });
  state.splice(index, 1);
  return state;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "toggleAllowQuestions":
      return {
        ...state,
        allowQuestions: !state.allowQuestions,
      };
    case "onPasswordChange":
      return {
        ...state,
        adminPassword: action.payload.data,
      };
    case "setVisibility":
      return {
        ...state,
        visibility: {
          loading: action.payload.loading,
          passwordForm: action.payload.passwordForm,
        },
      };
    case "setTitle":
      return {
        ...state,
        title: action.payload.title,
      };
    case "updateClients":
      return {
        ...state,
        clients: [action.payload.client, ...state.clients],
      };
    case "addQuestionsOnJoin":
      return {
        ...state,
        questions: [...action.payload.questions, ...state.questions],
      };
    case "addQuestion":
      return {
        ...state,
        questions: [action.payload.question, ...state.questions],
      };
    case "onSocketVoteUp":
      return {
        ...state,
        questions: [...setVote(state.questions, action.payload.id)],
      };
    case "onSocketSetAnswer":
      return {
        ...state,
        questions: [
          ...setAnswer(
            action.payload.answer,
            state.questions,
            action.payload.id
          ),
        ],
      };
    case "onSocketQuestionDelete":
      return {
        ...state,
        questions: [...deleteQuestion(state.questions, action.payload.id)],
      };
  }
};

module.exports = { init, reducer };
