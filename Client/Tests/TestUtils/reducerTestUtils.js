const TEST_ROOM = {
  title: "TESTS",
  questions: [],
  requirePassword: true,
  profanityFilter: true,
  _id: "5f63ec385804ad5fa32aec8a",
  url: "tests",
  owner: "DEVS",
  created: "2020-09-17T23:07:36.181Z",
  password: "$2b$08$7hPlrS8xu9VKSxKENqc6VuZWj56pJwu78s1Bxy9JWHzl6.4EreQna",
  adminPassword: "$2b$08$7hPlrS8xu9VKSxKENqc6VuZWj56pJwu78s1Bxy9JWHzl6.4EreQna",
  __v: 0,
};

const TEST_QUESTION = {
  _id: "5f64c5c362ca161f1ecb4b37",
  text: "TEST QUESTION",
  author: "TEST AUTHOR",
  score: 0,
  __v: 0,
};

const init = {
  questions: [],
  loggedIn: false,
  requirePassword: false,
  displayName: "",
  visibility: {
    form: false,
    list: false,
    post: false,
  },
  allowQuestion: false,
  initQuestionState: {
    _id: "0",
    author: "",
    text: "",
    score: 0,
    voted: false,
    room: "",
    answer: "",
  },
  loginInputs: {
    name: "",
    password: "",
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
const deleteItem = (dataList, id) => {
  let state = [...dataList];
  let index = state.findIndex((question) => {
    return question._id == id;
  });
  state.splice(index, 1);
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
const handleVote = (list, index) => {
  let state = [...list];
  state[index] = {
    ...state[index],
    score: state[index].score + 1,
    voted: true,
  };
  return state;
};

const reducer = (state, action) => {
  switch (action.type) {
    case "toggleAllowQuestion":
      return { ...state, allowQuestion: action.payload.data };
    case "onFirstRenderVisibility":
      return {
        ...state,
        visibility: {
          form: false,
          list: true,
          post: true,
        },
      };
    case "afterPostClickVisibility":
      return {
        ...state,
        visibility: {
          form: true,
          list: false,
          post: false,
        },
      };
    case "afterSubmitClickVisibility":
      return {
        ...state,
        visibility: {
          form: false,
          list: true,
          post: true,
        },
      };
    case "setPasswordRequirement":
      return {
        ...state,
        requirePassword: action.payload.data,
      };
    case "setQuestionTextOnFormChange":
      return {
        ...state,
        initQuestionState: {
          ...state.initQuestionState,
          text: action.payload.questionText,
        },
      };
    case "setInitialQuestionState":
      return {
        ...state,
        initQuestionState: {
          ...state.initQuestionState,
          text: "",
          score: 0,
          voted: false,
        },
      };
    case "setLoggedIn":
      return {
        ...state,
        loggedIn: action.payload.data,
      };
    case "setLoginUsername":
      return {
        ...state,
        loginInputs: {
          ...state.loginInputs,
          name: action.payload.data,
        },
      };
    case "setLoginPassword":
      return {
        ...state,
        loginInputs: {
          ...state.loginInputs,
          password: action.payload.data,
        },
      };
    case "setQuestionsOnAcknowledgeJoin": {
      return {
        ...state,
        questions: [...action.payload.questions],
      };
    }
    case "onLoginSubmit": {
      return {
        ...state,
        displayName: action.payload.name,
        initQuestionState: {
          ...state.initQuestionState,
          author: action.payload.name,
          room: action.payload.roomUrl,
        },
        visibility: {
          form: false,
          list: true,
          post: true,
        },
        loggedIn: true,
      };
    }
    case "onAuthInitialUseEffect":
      return {
        ...state,
        // displayName: action.payload.data.displayName,
        displayName: "TODO",
        initQuestionState: {
          ...state.initQuestionState,
          //   author: action.payload.data.displayName,
          author: "TODO",
          room: action.payload.roomUrl,
        },
        visibility: {
          form: false,
          list: true,
          post: true,
        },
        loggedIn: true,
      };
    case "addQuestionToList":
      return {
        ...state,
        questions: [action.payload.question, ...state.questions],
      };
    case "voteUpOnSocket":
      return {
        ...state,
        questions: setVote(state.questions, action.payload.id),
      };
    case "deleteQuestionOnSocket":
      return {
        ...state,
        questions: deleteItem(state.questions, action.payload.id),
      };

    case "addAnswerOnSocket":
      return {
        ...state,
        questions: setAnswer(
          action.payload.answer,
          state.questions,
          action.payload.id
        ),
      };
    case "handleVoteUpOnBtnClick":
      return {
        ...state,
        questions: handleVote(state.questions, action.payload.index),
      };
  }
};

module.exports = { TEST_ROOM, TEST_QUESTION, init, reducer };
