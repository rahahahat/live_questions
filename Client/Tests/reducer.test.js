import { init, reducer } from "./TestUtils/reducerTestUtils.js";

describe("Reducer", () => {
  test("toggleAllowQuestion", () => {
    expect(reducer(init, { type: "toggleAllowQuestion" })).toEqual({
      ...init,
      allowQuestion: !init.allowQuestion,
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
  test("onAuthInitialUseEffect", () => {
    expect(
      reducer(init, {
        type: "onAuthInitialUseEffect",
        payload: {
          data: {
            roomUrl: "test",
            //   displayName: "TODO"
          },
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
});
