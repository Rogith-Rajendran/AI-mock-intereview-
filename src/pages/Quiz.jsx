import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Quiz() {

  const navigate = useNavigate();


  /*
  ========================================
  QUESTIONS
  ========================================
  */

  const questions = [

    {
      question:
        "Which language is mainly used to create the structure of a web page?",

      options: [
        "Python",
        "HTML",
        "Java",
        "SQL"
      ],

      answer:
        "HTML"
    },


    {
      question:
        "Which technology is commonly used to build React applications?",

      options: [
        "JavaScript",
        "C",
        "PHP",
        "Assembly"
      ],

      answer:
        "JavaScript"
    },


    {
      question:
        "What does API stand for?",

      options: [
        "Application Programming Interface",
        "Advanced Program Internet",
        "Application Process Integration",
        "Applied Programming Input"
      ],

      answer:
        "Application Programming Interface"
    },


    {
      question:
        "Which database is commonly used with the MERN stack?",

      options: [
        "MongoDB",
        "Oracle",
        "MySQL",
        "PostgreSQL"
      ],

      answer:
        "MongoDB"
    },


    {
      question:
        "Which of these is a backend technology?",

      options: [
        "CSS",
        "HTML",
        "Node.js",
        "Bootstrap"
      ],

      answer:
        "Node.js"
    }

  ];


  /*
  ========================================
  STATE
  ========================================
  */

  const [currentQuestion, setCurrentQuestion] =
    useState(0);


  const [selectedAnswer, setSelectedAnswer] =
    useState("");


  const [score, setScore] =
    useState(0);


  const [finished, setFinished] =
    useState(false);


  /*
  ========================================
  LOAD SAVED QUIZ PROGRESS
  ========================================
  */

  useEffect(() => {

    const savedQuiz =
      localStorage.getItem(
        "careerAIQuizProgress"
      );


    if (!savedQuiz) {
      return;
    }


    try {

      const progress =
        JSON.parse(savedQuiz);


      if (
        progress.completed === true
      ) {

        setScore(
          progress.score || 0
        );

        setFinished(
          true
        );

      }

    }

    catch (error) {

      console.error(
        "Unable to load quiz progress:",
        error
      );

    }

  }, []);


  /*
  ========================================
  SAVE QUIZ PROGRESS
  ========================================
  */

  const saveQuizProgress =
    (
      finalScore,
      completed
    ) => {

      const progress = {

        score:
          finalScore,

        totalQuestions:
          questions.length,

        percentage:
          Math.round(
            (
              finalScore /
              questions.length
            ) * 100
          ),

        completed:
          completed

      };


      localStorage.setItem(

        "careerAIQuizProgress",

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
    questions[currentQuestion];


  /*
  ========================================
  SELECT ANSWER
  ========================================
  */

  const handleAnswer =
    (answer) => {

      setSelectedAnswer(
        answer
      );

    };


  /*
  ========================================
  NEXT / FINISH
  ========================================
  */

  const handleNext =
    () => {

      if (!selectedAnswer) {

        alert(
          "Please select an answer."
        );

        return;

      }


      /*
      ----------------------------------------
      CALCULATE NEW SCORE
      ----------------------------------------
      */

      const answerIsCorrect =
        selectedAnswer ===
        question.answer;


      const newScore =
        answerIsCorrect
          ? score + 1
          : score;


      setScore(
        newScore
      );


      /*
      ----------------------------------------
      LAST QUESTION
      ----------------------------------------
      */

      if (
        currentQuestion ===
        questions.length - 1
      ) {

        saveQuizProgress(
          newScore,
          true
        );


        setFinished(
          true
        );


        return;

      }


      /*
      ----------------------------------------
      NEXT QUESTION
      ----------------------------------------
      */

      setCurrentQuestion(
        currentQuestion + 1
      );


      setSelectedAnswer("");

    };


  /*
  ========================================
  RESTART QUIZ
  ========================================
  */

  const handleRestart =
    () => {

      setCurrentQuestion(0);

      setSelectedAnswer("");

      setScore(0);

      setFinished(false);


      saveQuizProgress(
        0,
        false
      );

    };


  /*
  ========================================
  RESULT PAGE
  ========================================
  */

  if (finished) {

    const percentage =
      Math.round(
        (
          score /
          questions.length
        ) * 100
      );


    return (

      <div className="quiz-page">


        <div className="quiz-result">

          <p className="section-label">
            QUIZ COMPLETED
          </p>


          <h1>
            Your Score
          </h1>


          <div className="score">
            {score} / {questions.length}
          </div>


          <p>
            You scored {percentage}% on the
            technical quiz.
          </p>


          <p>
            Your quiz result has been saved
            to your CareerAI profile.
          </p>


          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "20px"
            }}
          >

            <button
              onClick={() =>
                navigate("/jobs/readiness")
              }
            >
              View Job Readiness →
            </button>


            <button
              onClick={handleRestart}
            >
              Take Quiz Again
            </button>


            <button
              onClick={() =>
                navigate("/jobs")
              }
            >
              Back to Job Roles
            </button>

          </div>

        </div>

      </div>

    );

  }


  /*
  ========================================
  QUIZ PAGE
  ========================================
  */

  return (

    <div className="quiz-page">


      {/* ==================================
          HEADER
      ================================== */}

      <div className="quiz-header">

        <p className="section-label">
          TECHNICAL QUIZ
        </p>


        <h1>
          Test Your Knowledge
        </h1>


        <p>
          Answer the questions and see how well
          you understand the fundamentals.
        </p>

      </div>


      {/* ==================================
          QUIZ CARD
      ================================== */}

      <div className="quiz-card">


        {/* PROGRESS */}

        <div className="quiz-progress">

          <span>
            Question{" "}
            {currentQuestion + 1}
            {" / "}
            {questions.length}
          </span>


          <span>
            Score: {score}
          </span>

        </div>


        {/* QUESTION */}

        <h2>
          {question.question}
        </h2>


        {/* OPTIONS */}

        <div className="quiz-options">

          {question.options.map(
            (option) => (

              <button
                key={option}

                className={
                  selectedAnswer === option
                    ? "quiz-option selected"
                    : "quiz-option"
                }

                onClick={() =>
                  handleAnswer(option)
                }
              >
                {option}
              </button>

            )
          )}

        </div>


        {/* NEXT BUTTON */}

        <button
          className="quiz-next"
          onClick={handleNext}
        >

          {currentQuestion ===
            questions.length - 1

            ? "Finish Quiz"

            : "Next Question →"}

        </button>

      </div>

    </div>

  );

}


export default Quiz;