const TEST = {
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

const reducer = (state, action) => {
  switch (action.type) {
    case "toggleAllowQuestion":
      return { ...state, allowQuestion: !state.allowQuestion };
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
    case "onAuthInitialUseEffect":
      return {
        ...state,
        // displayName: action.payload.data.displayName,
        displayName: "TODO",
        initQuestionState: {
          ...state.initQuestionState,
          //   author: action.payload.data.displayName,
          author: "TODO",
          room: action.payload.data.roomUrl,
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
  }
};

module.exports = { TEST, init, reducer };
