import { useEffect, useState } from "react";

function JobPractice() {

  /*
  ========================================
  SELECTED JOB ROLE
  ========================================
  */

  const selectedRoleData =
    localStorage.getItem(
      "selectedJobRole"
    );


  const selectedRole =
    selectedRoleData
      ? JSON.parse(selectedRoleData)
      : null;


  /*
  ========================================
  QUESTIONS
  ========================================
  */

  const questions = [

    {
      question:
        "What is the difference between let, const and var in JavaScript?",

      answer:
        "let and const are block scoped. var is function scoped. A const variable cannot be reassigned."
    },


    {
      question:
        "What is the purpose of React components?",

      answer:
        "React components are reusable building blocks used to create user interfaces."
    },


    {
      question:
        "What is an API?",

      answer:
        "An API allows different software applications to communicate with each other."
    }

  ];


  /*
  ========================================
  CURRENT QUESTION
  ========================================
  */

  const [currentQuestion, setCurrentQuestion] =
    useState(0);


  /*
  ========================================
  USER ANSWER
  ========================================
  */

  const [userAnswer, setUserAnswer] =
    useState("");


  /*
  ========================================
  SCORE
  ========================================
  */

  const [score, setScore] =
    useState(0);


  /*
  ========================================
  SUBMITTED
  ========================================
  */

  const [submitted, setSubmitted] =
    useState(false);


  /*
  ========================================
  COMPLETED
  ========================================
  */

  const [completed, setCompleted] =
    useState(false);


  /*
  ========================================
  LOAD SAVED INTERVIEW PROGRESS
  ========================================
  */

  useEffect(() => {

    const savedProgress =
      localStorage.getItem(
        "careerAIInterviewProgress"
      );


    if (!savedProgress) {

      return;

    }


    try {

      const progress =
        JSON.parse(
          savedProgress
        );


      /*
      ----------------------------------------
      Restore progress
      ----------------------------------------
      */

      if (
        typeof progress.currentQuestion ===
        "number"
      ) {

        setCurrentQuestion(
          Math.min(
            progress.currentQuestion,
            questions.length - 1
          )
        );

      }


      if (
        typeof progress.score ===
        "number"
      ) {

        setScore(
          progress.score
        );

      }


      if (
        progress.completed ===
        true
      ) {

        setCompleted(
          true
        );

      }

    }

    catch (error) {

      console.error(
        "Unable to load interview progress:",
        error
      );

    }

  }, []);


  /*
  ========================================
  SAVE INTERVIEW PROGRESS
  ========================================
  */

  const saveInterviewProgress =
    (
      questionNumber,
      currentScore,
      isCompleted
    ) => {

      const progress = {

        currentQuestion:
          questionNumber,

        score:
          currentScore,

        totalQuestions:
          questions.length,

        completed:
          isCompleted

      };


      localStorage.setItem(

        "careerAIInterviewProgress",

        JSON.stringify(
          progress
        )

      );

    };


  /*
  ========================================
  CURRENT QUESTION
  ========================================
  */

  const question =
    questions[
      currentQuestion
    ];


  /*
  ========================================
  SUBMIT ANSWER
  ========================================
  */

  const handleSubmit =
    () => {

      if (
        !userAnswer.trim()
      ) {

        alert(
          "Please enter your answer."
        );

        return;

      }


      /*
      ----------------------------------------
      KEYWORD CHECK
      ----------------------------------------
      */

      const correctKeywords =
        question.answer
          .toLowerCase()
          .split(" ")
          .filter(
            word =>
              word.length > 2
          );


      const answerWords =
        userAnswer
          .toLowerCase()
          .split(" ")
          .filter(
            word =>
              word.length > 2
          );


      const matchedWords =
        answerWords.filter(
          word =>
            correctKeywords.includes(
              word
            )
        );


      /*
      ----------------------------------------
      DETERMINE CORRECTNESS
      ----------------------------------------
      */

      const isCorrect =
        matchedWords.length >= 3;


      /*
      ----------------------------------------
      NEW SCORE
      ----------------------------------------
      */

      const newScore =
        isCorrect
          ? score + 1
          : score;


      setScore(
        newScore
      );


      setSubmitted(
        true
      );


      /*
      ----------------------------------------
      SAVE CURRENT PROGRESS
      ----------------------------------------
      */

      saveInterviewProgress(

        currentQuestion,

        newScore,

        false

      );

    };


  /*
  ========================================
  NEXT QUESTION
  ========================================
  */

  const handleNext =
    () => {

      setUserAnswer("");

      setSubmitted(false);


      /*
      ----------------------------------------
      MORE QUESTIONS
      ----------------------------------------
      */

      if (
        currentQuestion <
        questions.length - 1
      ) {

        const nextQuestion =
          currentQuestion + 1;


        setCurrentQuestion(
          nextQuestion
        );


        saveInterviewProgress(

          nextQuestion,

          score,

          false

        );


        return;

      }


      /*
      ----------------------------------------
      INTERVIEW COMPLETE
      ----------------------------------------
      */

      setCompleted(
        true
      );


      saveInterviewProgress(

        currentQuestion,

        score,

        true

      );

    };


  /*
  ========================================
  RESTART INTERVIEW
  ========================================
  */

  const handleRestart =
    () => {

      setCurrentQuestion(0);

      setUserAnswer("");

      setScore(0);

      setSubmitted(false);

      setCompleted(false);


      saveInterviewProgress(

        0,

        0,

        false

      );

    };


  /*
  ========================================
  INTERVIEW PERCENTAGE
  ========================================
  */

  const interviewPercentage =
    Math.round(

      (
        score /
        questions.length
      ) * 100

    );


  /*
  ========================================
  COMPLETED SCREEN
  ========================================
  */

  if (completed) {

    return (

      <div className="practice-page">

        <div className="practice-header">

          <p className="section-label">
            JOB INTERVIEW PRACTICE
          </p>


          <h1>
            Interview Complete
          </h1>


          <p>
            You have completed the interview
            practice session.
          </p>

        </div>


        <div className="practice-card">

          <div className="question-top">

            <span>
              FINAL RESULT
            </span>


            <span>
              {score} / {questions.length}
            </span>

          </div>


          <h2>
            Your Interview Score
          </h2>


          <div
            style={{
              margin:
                "30px 0",
              textAlign:
                "center"
            }}
          >

            <div
              style={{
                fontSize:
                  "52px",
                fontWeight:
                  "bold",
                color:
                  "#2563eb"
              }}
            >
              {interviewPercentage}%
            </div>


            <p>
              {score} out of{" "}
              {questions.length}
              {" "}
              questions answered correctly.
            </p>

          </div>


          <div
            style={{
              display:
                "flex",
              gap:
                "12px",
              justifyContent:
                "center"
            }}
          >

            <button
              className="practice-button"
              onClick={
                handleRestart
              }
            >
              Practice Again
            </button>


            <button
              className="practice-button"
              onClick={() =>
                window.location.href =
                  "/jobs/readiness"
              }
            >
              View Job Readiness →
            </button>

          </div>

        </div>

      </div>

    );

  }


  /*
  ========================================
  MAIN PAGE
  ========================================
  */

  return (

    <div className="practice-page">


      {/* ==================================
          HEADER
      ================================== */}

      <div className="practice-header">

        <p className="section-label">
          JOB INTERVIEW PRACTICE
        </p>


        <h1>
          {selectedRole?.title ||
            "Job Preparation"}
        </h1>


        <p>
          Practice interview questions and improve
          your technical knowledge.
        </p>

      </div>


      {/* ==================================
          PRACTICE CARD
      ================================== */}

      <div className="practice-card">


        {/* QUESTION TOP */}

        <div className="question-top">

          <span>
            Question{" "}
            {currentQuestion + 1}
            {" "}
            /{" "}
            {questions.length}
          </span>


          <span>
            Score:{" "}
            {score}
          </span>

        </div>


        {/* QUESTION */}

        <h2>
          {question.question}
        </h2>


        {/* ANSWER */}

        <textarea

          value={
            userAnswer
          }

          onChange={
            (event) =>
              setUserAnswer(
                event.target.value
              )
          }

          placeholder=
            "Write your answer here..."

          rows="7"

          disabled={
            submitted
          }

        />


        {/* ==================================
            BEFORE SUBMISSION
        ================================== */}

        {!submitted ? (

          <button
            className="practice-button"
            onClick={
              handleSubmit
            }
          >
            Submit Answer
          </button>

        ) : (

          /* ==================================
             AFTER SUBMISSION
          ================================== */

          <div className="answer-result">

            <h3>
              Answer Submitted
            </h3>


            <p>
              Compare your answer with the
              expected concept below.
            </p>


            <div className="correct-answer">

              <strong>
                Expected Answer:
              </strong>


              <p>
                {question.answer}
              </p>

            </div>


            <button
              className="practice-button"
              onClick={
                handleNext
              }
            >
              {currentQuestion <
                questions.length - 1
                ? "Next Question →"
                : "Finish Practice"}
            </button>

          </div>

        )}

      </div>


    </div>

  );

}

export default JobPractice;