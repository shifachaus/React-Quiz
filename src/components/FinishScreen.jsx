import React from "react";

const FinishScreen = ({
  maxPossiblePoints,
  points,
  dispatch,
  highscore,
  highesthighscore,
}) => {
  const percentage = (points / maxPossiblePoints) * 100;

  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🙃";
  if (percentage >= 0 && percentage < 50) emoji = "🤨";
  if (percentage === 0) emoji = "🤦‍♂️";

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of{" "}
        {maxPossiblePoints} ({Math.ceil(percentage)}%)
      </p>

      <p className="highscore">
        HI <span className="pill">{highscore}</span> | <span className="pill">{highesthighscore}</span> points
      </p>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "RESTART" })}
      >
        Restart quiz
      </button>
    </>
  );
};

export default FinishScreen;
