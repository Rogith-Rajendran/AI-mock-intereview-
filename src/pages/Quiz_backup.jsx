import { useState } from "react";

function Quiz() {
  const questions = [
    {
      question: "Which language is mainly used to create the structure of a web page?",
      options: ["Python", "HTML", "Java", "SQL"],
      answer: "HTML"
    },
    {
      question: "Which technology is commonly used to build React applications?",
      options: ["JavaScript", "C", "PHP", "Assembly"],
      answer: "JavaScript"
    },
    {
      question: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Advanced Program Internet",
        "Application Process Integration",
        "Applied Programming Input"
      ],
      answer: "Application Programming Interface"
    },
    {
      question: "Which database is commonly used with the MERN stack?",
      options: ["MongoDB", "Oracle", "MySQL", "PostgreSQL"],
      answer: "MongoDB"
    },
    {
      question: "Which of these is a backend technology?",
      options: ["CSS", "HTML", "Node.js", "Bootstrap"],
      answer: "Node.js"
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState("");

  const [score, setScore] = useState(0);

  const [finished, setFinished] = useState(false);

  const question = questions[currentQuestion];

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      alert("Please select an answer.");
      return;
    }

    if (selectedAnswer === question.answer) {
      setScore(score + 1);
    }

    if (currentQuestion === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer("");
  };

  if (finished) {
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
            You have completed the technical quiz.
          </p>

          <button
            onClick={() => window.location.href = "/jobs"}
          >
            Back to Job Roles
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="quiz-page">

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


      <div className="quiz-card">

        <div className="quiz-progress">

          <span>
            Question {currentQuestion + 1} / {questions.length}
          </span>

          <span>
            Score: {score}
          </span>

        </div>


        <h2>
          {question.question}
        </h2>


        <div className="quiz-options">

          {question.options.map((option) => (

            <button
              key={option}
              className={
                selectedAnswer === option
                  ? "quiz-option selected"
                  : "quiz-option"
              }
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>

          ))}

        </div>


        <button
          className="quiz-next"
          onClick={handleNext}
        >
          {currentQuestion === questions.length - 1
            ? "Finish Quiz"
            : "Next Question →"}
        </button>

      </div>

    </div>
  );
}

export default Quiz;