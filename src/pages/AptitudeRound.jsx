import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Round1() {
  const navigate = useNavigate();

  const questions = [
    {
      question:
        "A number is increased by 20% and then decreased by 20%. What is the overall change?",
      options: [
        "4% increase",
        "4% decrease",
        "No change",
        "2% decrease"
      ],
      answer: 1
    },

    {
      question:
        "A train travels 360 km in 4 hours. What is its average speed?",
      options: [
        "80 km/h",
        "90 km/h",
        "100 km/h",
        "120 km/h"
      ],
      answer: 1
    },

    {
      question:
        "If 5 workers can complete a task in 12 days, how many days will 10 workers take, assuming equal efficiency?",
      options: [
        "3 days",
        "5 days",
        "6 days",
        "8 days"
      ],
      answer: 2
    },

    {
      question:
        "The ratio of boys to girls in a class is 3:2. If there are 30 boys, how many girls are there?",
      options: [
        "15",
        "20",
        "25",
        "18"
      ],
      answer: 1
    },

    {
      question:
        "A product costs ₹800 and is sold at a profit of 15%. What is its selling price?",
      options: [
        "₹880",
        "₹900",
        "₹920",
        "₹940"
      ],
      answer: 2
    }
  ];

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [score, setScore] =
    useState(0);

  const [finished, setFinished] =
    useState(false);

  const question =
    questions[currentQuestion];

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      return;
    }

    let newScore = score;

    if (
      selectedAnswer === question.answer
    ) {
      newScore++;
    }

    setScore(newScore);

    if (
      currentQuestion ===
      questions.length - 1
    ) {

      // ========================================
      // GET CURRENT USER
      // ========================================

      const userData =
        localStorage.getItem(
          "careerAIUser"
        );

      if (userData) {

        try {

          const user =
            JSON.parse(userData);

          const userId =
            user?._id ||
            user?.id ||
            user?.email;

          if (userId) {

            // ========================================
            // SAVE ROUND 1 RESULT FOR THIS USER
            // ========================================

            localStorage.setItem(
              `careerAIRound1_${userId}`,
              JSON.stringify({
                round: 1,
                title:
                  "Aptitude & Quantitative",
                score: newScore,
                total:
                  questions.length,
                percentage:
                  Math.round(
                    (newScore /
                      questions.length) *
                      100
                  ),
                completed: true
              })
            );

          }

        } catch (error) {

          console.error(
            "Unable to save Round 1 result:",
            error
          );

        }

      }

      setFinished(true);
      return;
    }

    setCurrentQuestion(
      currentQuestion + 1
    );

    setSelectedAnswer(null);
  };

  if (finished) {
    return (
      <div className="assessment-round-page">

        <div className="assessment-round-container">

          <div className="round-result">

            <p className="round-result-label">
              ROUND 1 COMPLETED
            </p>

            <h1>
              Aptitude & Quantitative
            </h1>

            <div className="round-result-score">
              {score}/{questions.length}
            </div>

            <p>
              Your Round 1 aptitude assessment
              has been completed.
            </p>

            <button
              className="round-result-button"
              onClick={() =>
                navigate(
                  "/jobs/assessment/round-2"
                )
              }
            >
              Continue to Coding Round →
            </button>

          </div>

        </div>

      </div>
    );
  }

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  return (
    <div className="assessment-round-page">

      <div className="assessment-round-container">

        <div className="round-header">

          <p className="round-label">
            ROUND 1
          </p>

          <h1>
            Aptitude & Quantitative
          </h1>

          <p>
            Test your quantitative aptitude,
            logical reasoning and problem-solving
            ability.
          </p>

        </div>


        <div className="round-progress">

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


        <div className="round-progress-bar">

          <div
            style={{
              width: `${progress}%`
            }}
          />

        </div>


        <div className="round-question-card">

          <h2 className="round-question">
            {question.question}
          </h2>


          <div className="round-options">

            {question.options.map(
              (option, index) => (

                <button
                  key={index}
                  className={`round-option ${
                    selectedAnswer === index
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleAnswer(index)
                  }
                >

                  <span className="round-option-letter">
                    {String.fromCharCode(
                      65 + index
                    )}
                  </span>

                  <span>
                    {option}
                  </span>

                </button>

              )
            )}

          </div>


          <div className="round-actions">

            <button
              className="round-next-button"
              disabled={
                selectedAnswer === null
              }
              onClick={handleNext}
            >
              {currentQuestion ===
              questions.length - 1
                ? "Finish Round"
                : "Next Question →"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Round1;