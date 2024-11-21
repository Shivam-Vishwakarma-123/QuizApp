import React, { useRef, useState, useEffect } from "react";
import "./Quiz.css";
import { data } from "../../assets/data";

const Quiz = () => {
  let [index, setindex] = useState(0);
  let [question, setquestion] = useState(data[index]);
  let [lock, setlock] = useState(false);
  let [score, setscore] = useState(0);
  let option1 = useRef(null);
  let option2 = useRef(null);
  let option3 = useRef(null);
  let option4 = useRef(null);
  let optionarray = [option1, option2, option3, option4];
  let [result, setresult] = useState(false);
  let [timer, settimer] = useState(30); // Timer state (1 min)

  // Timer effect
  useEffect(() => {
    if (result) return; // Stop the timer if the quiz is finished

    if (timer === 0) {
      handleNext(); // Move to the next question when the timer reaches 0
      return;
    }

    const countdown = setInterval(() => {
      settimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown); // Cleanup interval on component unmount or re-render
  }, [timer, result]);

  const checkAns = (e, ans) => {
    if (lock === false) {
      if (question.ans === ans) {
        // Adding class here
        e.target.classList.add("correct");
        setlock(true);
        setscore((prev) => prev + 1);
      } else {
        e.target.classList.add("incorrect");
        setlock(true);
        // To highlight the correct option
        optionarray[question.ans - 1].current.classList.add("correct");
      }
    }
  };

  const handleNext = () => {
    if (lock === true || timer === 0) {
      if (index === data.length - 1) {
        setresult(true);
        return;
      }
      setindex((prev) => prev + 1);
      setquestion(data[index + 1]);
      setlock(false);
      settimer(30); // Reset the timer for the next question
      optionarray.forEach((option) => {
        option.current.classList.remove("incorrect");
        option.current.classList.remove("correct");
      });
    }
  };

  const reset = () => {
    setindex(0);
    setscore(0);
    setresult(false);
    setquestion(data[0]);
    setlock(false);
    settimer(60); // Reset the timer
  };

  return (
    <div className="container">
      <h1>Quiz App</h1>
      <hr />
      {result ? (
        <>
          <h2>Your Score is {score} out of {data.length}</h2>
          <button onClick={reset}>Reset</button>
        </>
      ) : (
        <>
          <h2>
            {index + 1}. {question.question}
          </h2>
          <div className="timer">Time Remaining: {timer}s</div> {/* Timer display */}
          <ul>
            <li ref={option1} onClick={(e) => checkAns(e, 1)}>{question.option1}</li>
            <li ref={option2} onClick={(e) => checkAns(e, 2)}>{question.option2}</li>
            <li ref={option3} onClick={(e) => checkAns(e, 3)}>{question.option3}</li>
            <li ref={option4} onClick={(e) => checkAns(e, 4)}>{question.option4}</li>
          </ul>
          <button onClick={handleNext}>Next</button>
          <div className="index">{index + 1} out of {data.length} Questions</div>
        </>
      )}
    </div>
  );
};

export default Quiz;
