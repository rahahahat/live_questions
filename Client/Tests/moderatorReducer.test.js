import { TEST_ROOM, TEST_QUESTION } from "./TestUtils/test_vars.js";
import { init, reducer } from "./TestUtils/ModeratorReducerTestUtils.js";
// npm test --findPathRelatedTests ./Tests/moderatorReducer.test.js
describe("ModeratorReducerTests", () => {
  test("onToggleAllowQuestions", () => {
    expect(reducer(init, { type: "toggleAllowQuestions" })).toEqual({
      ...init,
      allowQuestions: !init.allowQuestions,
    });
  });
  test("forAdminPasswordChange", () => {
    expect(
      reducer(init, {
        type: "onPasswordChange",
        payload: {
          data: "TEST",
        },
      })
    ).toEqual({
      ...init,
      adminPassword: "TEST",
    });
  });
  test("forSetVisibility-#1", () => {
    expect(
      reducer(init, {
        type: "setVisibility",
        payload: {
          loading: true,
          passwordForm: true,
        },
      })
    ).toEqual({
      ...init,
      visibility: {
        loading: true,
        passwordForm: true,
      },
    });
  });
  test("forSetVisibility-#2", () => {
    expect(
      reducer(init, {
        type: "setVisibility",
        payload: {
          loading: false,
          passwordForm: false,
        },
      })
    ).toEqual({
      ...init,
      visibility: {
        loading: false,
        passwordForm: false,
      },
    });
  });
  test("forSetTitle", () => {
    expect(
      reducer(init, {
        type: "setTitle",
        payload: {
          title: "TEST",
        },
      })
    ).toEqual({
      ...init,
      title: "TEST",
    });
  });
  test("forUpdateClients", () => {
    expect(
      reducer(init, {
        type: "updateClients",
        payload: {
          client: { user: "test_user", socker_id: "test_id" },
        },
      })
    ).toEqual({
      ...init,
      clients: [{ user: "test_user", socker_id: "test_id" }],
    });
  });
  test("forAddingQuestionOnJoin-#1", () => {
    expect(
      reducer(init, {
        type: "addQuestionsOnJoin",
        payload: {
          questions: ["1", "2", "3"],
        },
      })
    ).toEqual({
      ...init,
      questions: ["1", "2", "3"],
    });
  });
  test("forAddingQuestionOnJoin-#2", () => {
    expect(
      reducer(init, {
        type: "addQuestionsOnJoin",
        payload: {
          questions: [TEST_QUESTION],
        },
      })
    ).toEqual({
      ...init,
      questions: [TEST_QUESTION],
    });
  });
  test("forAddQuestion-#1", () => {
    expect(
      reducer(init, {
        type: "addQuestion",
        payload: {
          question: "TEST",
        },
      })
    ).toEqual({
      ...init,
      questions: ["TEST"],
    });
  });
  test("forAddQuestion-#2", () => {
    expect(
      reducer(init, {
        type: "addQuestion",
        payload: {
          question: TEST_QUESTION,
        },
      })
    ).toEqual({
      ...init,
      questions: [TEST_QUESTION],
    });
  });
  test("forSocketVoteUp-#1", () => {
    expect(
      reducer(
        { ...init, questions: [TEST_QUESTION] },
        {
          type: "onSocketVoteUp",
          payload: {
            id: TEST_QUESTION._id,
          },
        }
      )
    ).toEqual({
      ...init,
      questions: [{ ...TEST_QUESTION, score: 1 }],
    });
  });
  test("forSocketVoteUp-#2", () => {
    expect(
      reducer(
        {
          ...init,
          questions: [
            { ...TEST_QUESTION, _id: "#testid" },
            { ...TEST_QUESTION, score: 3 },
          ],
        },
        {
          type: "onSocketVoteUp",
          payload: {
            id: TEST_QUESTION._id,
          },
        }
      )
    ).toEqual({
      ...init,
      questions: [
        { ...TEST_QUESTION, _id: "#testid" },
        { ...TEST_QUESTION, score: 4 },
      ],
    });
  });
  test("forSocketSetAnswer", () => {
    expect(
      reducer(
        { ...init, questions: [TEST_QUESTION] },
        {
          type: "onSocketSetAnswer",
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
  test("forSocketDeleteQuestion", () => {
    expect(
      reducer(
        { ...init, questions: [TEST_QUESTION] },
        {
          type: "onSocketQuestionDelete",
          payload: {
            id: TEST_QUESTION._id,
          },
        }
      )
    ).toEqual({
      ...init,
      questions: [],
    });
  });
});
