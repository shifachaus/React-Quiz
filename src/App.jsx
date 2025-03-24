import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Timer from "./components/Timer";
import Footer from "./components/Footer";

const SECS_PER_QUESTIONS = 30;

const initialState = {
  questions: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  highesthighscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  let calculateHighScore = Math.max(state.points, state.highesthighscore);

  switch (action.type) {
    case "DATA_RECEIVED":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };

    case "DATA_FAILED":
      return {
        ...state,
        status: "error",
      };

    case "START":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTIONS,
      };

    case "NEW_ANSWER":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "NEXT_QUESTION":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };

    case "FINISH":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
        highesthighscore: calculateHighScore,
      };

    case "RESTART":
      return {
        ...initialState,
        questions: state.questions,
        highesthighscore: state.highesthighscore,
        status: "ready",
      };

    case "TICK":
      const newSeconds = state.secondsRemaining - 1;
      return {
        ...state,
        secondsRemaining: newSeconds,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
        highscore: Math.max(state.points, state.highscore),
        highesthighscore: calculateHighScore,
      };

    default:
      throw new Error("Action unknown");
  }
}

function App() {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      highesthighscore,
      secondsRemaining,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, curr) => prev + curr.points,
    0
  );

  useEffect(() => {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "DATA_RECEIVED", payload: data }))
      .catch((err) => dispatch({ type: "DATA_FAILED" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <FinishScreen
            maxPossiblePoints={maxPossiblePoints}
            points={points}
            dispatch={dispatch}
            highscore={highscore}
            highesthighscore={highesthighscore}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
