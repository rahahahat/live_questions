import {
  TEST_ROOM,
  TEST_QUESTION,
  init,
  reducer,
} from "./TestUtils/reducerTestUtils.js";
import io from "socket.io-client";

// const initiateSocket = () => {
//   return new Promise((resolve, reject) => {
//     let socket = io.connect("http://localhost:3000");
//     resolve(socket);
//   });
// };

// const destroySocket = (socket) => {
//   if (socket.connected) {
//     socket.close();
//   }
// };

describe("REDUCER_TESTS", () => {
  describe("Non-socketDispatchTests", () => {
    test("toggleAllowQuestion", () => {
      expect(
        reducer(init, {
          type: "toggleAllowQuestion",
          payload: {
            data: true,
          },
        })
      ).toEqual({
        ...init,
        allowQuestion: true,
      });
    });

    test("postVisibility", () => {
      expect(reducer(init, { type: "afterPostClickVisibility" })).toEqual({
        ...init,
        visibility: {
          form: true,
          list: false,
          post: false,
        },
      });
    });

    test("submitVisibility", () => {
      expect(reducer(init, { type: "afterSubmitClickVisibility" })).toEqual({
        ...init,
        visibility: {
          form: false,
          list: true,
          post: true,
        },
      });
    });

    test("1stRenderVisibility", () => {
      expect(reducer(init, { type: "onFirstRenderVisibility" })).toEqual({
        ...init,
        visibility: {
          form: false,
          list: true,
          post: true,
        },
      });
    });

    test("togglePasswordRequiement", () => {
      expect(
        reducer(init, {
          type: "setPasswordRequirement",
          payload: {
            data: true,
          },
        })
      ).toEqual({
        ...init,
        requirePassword: true,
      });
    });
    test("setQuestionList", () => {
      expect(
        reducer(init, {
          type: "setQuestionsOnAcknowledgeJoin",
          payload: {
            questions: [TEST_QUESTION],
          },
        })
      ).toEqual({
        ...init,
        questions: [TEST_QUESTION, ...init.questions],
      });
    });
    test("setLoggedIn", () => {
      expect(
        reducer(init, {
          type: "setLoggedIn",
          payload: {
            data: true,
          },
        })
      ).toEqual({
        ...init,
        loggedIn: true,
      });
    });
    test("setInitialQuestionState", () => {
      expect(
        reducer(
          {
            ...init,
            initQuestionState: {
              ...init.initQuestionState,
              text: "TEST",
              voted: false,
              score: 12,
            },
          },
          {
            type: "setInitialQuestionState",
          }
        )
      ).toEqual({
        ...init,
      });
    });
    test("setQuestionTextOnFormChange", () => {
      expect(
        reducer(init, {
          type: "setQuestionTextOnFormChange",
          payload: {
            questionText: "testQuestion",
          },
        })
      ).toEqual({
        ...init,
        initQuestionState: { ...init.initQuestionState, text: "testQuestion" },
      });
    });
    test("setLoginUsername", () => {
      expect(
        reducer(init, {
          type: "setLoginUsername",
          payload: {
            data: "a",
          },
        })
      ).toEqual({
        ...init,
        loginInputs: {
          ...init.loginInputs,
          name: "a",
        },
      });
    });
    test("setLoginPassword", () => {
      expect(
        reducer(init, {
          type: "setLoginPassword",
          payload: {
            data: "a",
          },
        })
      ).toEqual({
        ...init,
        loginInputs: {
          ...init.loginInputs,
          password: "a",
        },
      });
    });
    test("onLoginSubmit", () => {
      expect(
        reducer(init, {
          type: "onLoginSubmit",
          payload: {
            name: "test",
            roomUrl: "test",
          },
        })
      ).toEqual({
        ...init,
        displayName: "test",
        initQuestionState: {
          ...init.initQuestionState,
          author: "test",
          room: "test",
        },
        visibility: {
          form: false,
          list: true,
          post: true,
        },
        loggedIn: true,
      });
    });
    test("onAuthInitialUseEffect", () => {
      expect(
        reducer(init, {
          type: "onAuthInitialUseEffect",
          payload: {
            roomUrl: "test",
          },
        })
      ).toEqual({
        ...init,
        displayName: "TODO",
        initQuestionState: {
          ...init.initQuestionState,
          author: "TODO",
          room: "test",
        },
        visibility: {
          form: false,
          list: true,
          post: true,
        },
        loggedIn: true,
      });
    });
    test("addQuestion-#1", () => {
      expect(
        reducer(init, {
          type: "addQuestionToList",
          payload: {
            question: "TEST",
          },
        })
      ).toEqual({
        ...init,
        questions: ["TEST", ...init.questions],
      });
    });
    test("addQuestion-#2", () => {
      expect(
        reducer(
          { questions: ["TEST1", "TEST2"], ...init },
          {
            type: "addQuestionToList",
            payload: {
              question: "TEST",
            },
          }
        )
      ).toEqual({
        ...init,
        questions: ["TEST", ...init.questions],
      });
    });
    test("addQuestion-#3", () => {
      expect(
        reducer(init, {
          type: "addQuestionToList",
          payload: {
            question: { name: "TEST" },
          },
        })
      ).toEqual({
        ...init,
        questions: [{ name: "TEST" }, ...init.questions],
      });
    });
    test("addQuestion-#4", () => {
      expect(
        reducer(
          { questions: ["TEST1", "TEST2"], ...init },
          {
            type: "addQuestionToList",
            payload: {
              question: { name: "TEST" },
            },
          }
        )
      ).toEqual({
        ...init,
        questions: [{ name: "TEST" }, ...init.questions],
      });
    });
    test("voteUpOnSocket", () => {
      expect(
        reducer(
          { ...init, questions: [{ ...TEST_QUESTION }] },
          {
            type: "voteUpOnSocket",
            payload: {
              id: TEST_QUESTION._id,
            },
          }
        )
      ).toEqual({ ...init, questions: [{ ...TEST_QUESTION, score: 1 }] });
    });
    test("voteUpOnBtnClick", () => {
      expect(
        reducer(
          { ...init, questions: [{ ...TEST_QUESTION }] },
          {
            type: "handleVoteUpOnBtnClick",
            payload: {
              index: 0,
            },
          }
        )
      ).toEqual({
        ...init,
        questions: [{ ...TEST_QUESTION, score: 1, voted: true }],
      });
    });
    test("deleteQuestion", () => {
      expect(
        reducer(
          { ...init, questions: [{ ...TEST_QUESTION }] },
          {
            type: "deleteQuestionOnSocket",
            payload: {
              id: TEST_QUESTION._id,
            },
          }
        )
      ).toEqual({ ...init, questions: [] });
    });
    test("addAnswer", () => {
      expect(
        reducer(
          { ...init, questions: [{ ...TEST_QUESTION }] },
          {
            type: "addAnswerOnSocket",
            payload: {
              answer: "TEST_ANSWER",
              id: TEST_QUESTION._id,
            },
          }
        )
      ).toEqual({
        ...init,
        questions: [{ ...TEST_QUESTION, answer: "TEST_ANSWER" }],
      });
    });
  });
});

//+++++++++++++++++++++++++++++++++++++++++++++ BOILER PLATE FOR SOCKET TESTING +++++++++++++++++++++++++++++++++++++++++++++++++++++++//
// test("test", async () => {
//   let socket = await initiateSocket();
//   const response = (socket) => {
//     return new Promise((resolve, reject) => {
//       socket.on("test1", (data) => {
//         destroySocket(socket);
//         resolve(data);
//       });
//     });
//   };
//   socket.emit("test1");
//   let result = await response(socket);
//   // console.log("RESULT", result);
//   expect(result.data).toBe("RAHAT");
// });
//+++++++++++++++++++++++++++++++++++++++++++++ BOILER PLATE FOR SOCKET TESTING +++++++++++++++++++++++++++++++++++++++++++++++++++++++//
