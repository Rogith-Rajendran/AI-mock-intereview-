import { useEffect, useState } from "react";

function JobPractice() {

  const selectedRoleData =
    localStorage.getItem("selectedJobRole");

  const selectedRole = selectedRoleData
    ? JSON.parse(selectedRoleData)
    : null;


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


  // ========================================
  // CURRENT QUESTION
  // ========================================

  const [currentQuestion, setCurrentQuestion] =
    useState(0);


  // ========================================
  // USER ANSWER
  // ========================================

  const [userAnswer, setUserAnswer] =
    useState("");


  // ========================================
  // SCORE
  // ========================================

  const [score, setScore] =
    useState(0);


  // ========================================
  // SUBMITTED
  // ========================================

  const [submitted, setSubmitted] =
    useState(false);


  // ========================================
  // LOAD SAVED PROGRESS
  // ========================================

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
        JSON.parse(savedProgress);


      if (
        progress.totalQuestions ===
        questions.length
      ) {

        setCurrentQuestion(
          progress.currentQuestion || 0
        );

        setScore(
          progress.score || 0
        );

      }

    } catch (error) {

      console.error(
        "Unable to load interview progress:",
        error
      );

    }

  }, []);


  // ========================================
  // SAVE PROGRESS
  // ========================================

  const saveProgress = (
    questionNumber,
    currentScore,
    completed
  ) => {

    const progress = {

      currentQuestion:
        questionNumber,

      score:
        currentScore,

      totalQuestions:
        questions.length,

      completed:
        completed

    };


    localStorage.setItem(
      "careerAIInterviewProgress",
      JSON.stringify(progress)
    );

  };


  const question =
    questions[currentQuestion];


  // ========================================
  // SUBMIT ANSWER
  // ========================================

  const handleSubmit = () => {

    if (!userAnswer.trim()) {

      alert(
        "Please enter your answer."
      );

      return;

    }


    setSubmitted(true);


    const correctKeywords =
      question.answer
        .toLowerCase()
        .split(" ");


    const answerWords =
      userAnswer
        .toLowerCase()
        .split(" ");


    const matchedWords =
      answerWords.filter(
        word =>
          correctKeywords.includes(word)
      );


    const answerIsCorrect =
      matchedWords.length >= 3;


    const newScore =
      answerIsCorrect
        ? score + 1
        : score;


    setScore(newScore);


    saveProgress(
      currentQuestion,
      newScore,
      false
    );

  };


  // ========================================
  // NEXT QUESTION
  // ========================================

  const handleNext = () => {

    setUserAnswer("");

    setSubmitted(false);


    if (
      currentQuestion <
      questions.length - 1
    ) {

      const nextQuestion =
        currentQuestion + 1;


      setCurrentQuestion(
        nextQuestion
      );


      saveProgress(
        nextQuestion,
        score,
        false
      );

    } else {

      saveProgress(
        questions.length - 1,
        score,
        true
      );


      alert(
        `Practice completed! Your score is ${score}/${questions.length}`
      );

    }

  };


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

        <div className="question-top">

          <span>
            Question{" "}
            {currentQuestion + 1}
            {" "}
            / {questions.length}
          </span>


          <span>
            Score: {score}
          </span>

        </div>


        <h2>
          {question.question}
        </h2>


        <textarea
          value={userAnswer}
          onChange={(event) =>
            setUserAnswer(
              event.target.value
            )
          }
          placeholder="Write your answer here..."
          rows="7"
          disabled={submitted}
        />


        {!submitted ? (

          <button
            className="practice-button"
            onClick={handleSubmit}
          >
            Submit Answer
          </button>

        ) : (

          <div className="answer-result">

            <h3>
              Answer Submitted
            </h3>


            <p>
              Compare your answer with the expected
              concept below.
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
              onClick={handleNext}
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