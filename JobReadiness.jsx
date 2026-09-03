import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function JobReadiness() {

  const navigate = useNavigate();

  // ========================================
  // QUESTIONS
  // ========================================

  const [questions, setQuestions] =
    useState([]);


  // ========================================
  // CURRENT QUESTION
  // ========================================

  const [currentQuestion, setCurrentQuestion] =
    useState(0);


  // ========================================
  // SELECTED ANSWERS
  // ========================================

  const [answers, setAnswers] =
    useState({});


  // ========================================
  // RESULT
  // ========================================

  const [result, setResult] =
    useState(null);


  // ========================================
  // LOADING
  // ========================================

  const [loading, setLoading] =
    useState(true);


  // ========================================
  // ERROR
  // ========================================

  const [error, setError] =
    useState("");


  // ========================================
  // LOAD QUESTIONS
  // ========================================

  const fetchQuestions = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/job-readiness/questions"
      );

      if (!response.ok) {

        throw new Error(
          "Unable to load job readiness questions"
        );

      }

      const data =
        await response.json();

      if (!data.success) {

        throw new Error(
          "Backend returned an error"
        );

      }

      setQuestions(
        data.questions || []
      );

    } catch (err) {

      console.error(
        "Job readiness error:",
        err
      );

      setError(
        "Unable to load the assessment. Please make sure the backend is running."
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // LOAD WHEN PAGE OPENS
  // ========================================

  useEffect(() => {

    fetchQuestions();

  }, []);


  // ========================================
  // SELECT ANSWER
  // ========================================

  const handleAnswerSelect =
    (questionId, answer) => {

      setAnswers(
        (previousAnswers) => ({
          ...previousAnswers,
          [questionId]: answer
        })
      );

    };


  // ========================================
  // NEXT QUESTION
  // ========================================

  const handleNext = () => {

    const question =
      questions[currentQuestion];


    if (!answers[question.id]) {

      alert(
        "Please select an answer before continuing."
      );

      return;

    }


    if (
      currentQuestion <
      questions.length - 1
    ) {

      setCurrentQuestion(
        currentQuestion + 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }

  };


  // ========================================
  // PREVIOUS QUESTION
  // ========================================

  const handlePrevious = () => {

    if (currentQuestion > 0) {

      setCurrentQuestion(
        currentQuestion - 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }

  };


  // ========================================
  // SUBMIT ASSESSMENT
  // ========================================

  const handleSubmit = async () => {

    const unansweredQuestions =
      questions.filter(
        (question) =>
          !answers[question.id]
      );


    if (
      unansweredQuestions.length > 0
    ) {

      alert(
        "Please answer all questions before submitting the assessment."
      );

      return;

    }


    try {

      setLoading(true);
      setError("");


      const formattedAnswers =
        questions.map(
          (question) => ({

            questionId:
              question.id,

            answer:
              answers[question.id]

          })
        );


      const response = await fetch(
        "http://localhost:5000/api/job-readiness/submit",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
              answers:
                formattedAnswers
            })

        }
      );


      if (!response.ok) {

        throw new Error(
          "Unable to submit assessment"
        );

      }


      const data =
        await response.json();


      if (!data.success) {

        throw new Error(
          "Assessment submission failed"
        );

      }


      setResult(
        data.result
      );

      // Save the latest assessment result so the Dashboard
      // can display the student's Job Readiness score.
      localStorage.setItem(
        "careerAIJobReadinessResult",
        JSON.stringify(data.result)
      );


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });


    } catch (err) {

      console.error(
        "Assessment submission error:",
        err
      );

      setError(
        "Unable to submit the assessment. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // RESTART ASSESSMENT
  // ========================================

  const handleRestart = () => {

    setCurrentQuestion(0);

    setAnswers({});

    setResult(null);

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // ========================================
  // BACK TO JOBS
  // ========================================

  const handleBackToJobs = () => {

    navigate("/jobs");

  };


  // ========================================
  // LOADING SCREEN
  // ========================================

  if (loading && questions.length === 0) {

    return (

      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fb",
          padding: "40px",
          fontFamily:
            "Arial, sans-serif"
        }}
      >

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: "white",
            padding: "40px",
            borderRadius: "14px",
            textAlign: "center"
          }}
        >

          Loading Job Readiness Assessment...

        </div>

      </div>

    );

  }


  // ========================================
  // ERROR SCREEN
  // ========================================

  if (
    error &&
    questions.length === 0
  ) {

    return (

      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fb",
          padding: "40px",
          fontFamily:
            "Arial, sans-serif"
        }}
      >

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: "white",
            padding: "40px",
            borderRadius: "14px"
          }}
        >

          <h1>
            Job Readiness Assessment
          </h1>

          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "10px"
            }}
          >
            {error}
          </div>

          <button
            onClick={handleBackToJobs}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#111827",
              color: "white",
              cursor: "pointer"
            }}
          >
            ← Back to Jobs
          </button>

        </div>

      </div>

    );

  }


  // ========================================
  // RESULT SCREEN
  // ========================================

  if (result) {

    return (

      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fb",
          padding: "40px",
          fontFamily:
            "Arial, sans-serif"
        }}
      >

        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto"
          }}
        >

          {/* HEADER */}

          <div
            style={{
              marginBottom: "30px"
            }}
          >

            <p
              style={{
                margin: 0,
                color: "#2563eb",
                fontSize: "13px",
                fontWeight: "bold",
                letterSpacing: "1px"
              }}
            >
              ASSESSMENT RESULT
            </p>

            <h1
              style={{
                margin:
                  "8px 0 10px",
                fontSize: "38px"
              }}
            >
              Your Job Readiness Result
            </h1>

            <p
              style={{
                color: "#64748b"
              }}
            >
              Here's a summary of your technical
              readiness assessment.
            </p>

          </div>


          {/* SCORE CARD */}

          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "40px",
              border:
                "1px solid #e2e8f0",
              textAlign: "center"
            }}
          >

            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                margin: "0 auto 25px",
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  "10px solid #2563eb"
              }}
            >

              <strong
                style={{
                  fontSize: "32px",
                  color: "#2563eb"
                }}
              >
                {result.score}%
              </strong>

            </div>


            <h2>
              {result.readinessLevel}
            </h2>


            <p
              style={{
                color: "#64748b",
                fontSize: "16px"
              }}
            >
              You answered{" "}
              <strong>
                {result.correctAnswers}
              </strong>{" "}
              out of{" "}
              <strong>
                {result.totalAnswered}
              </strong>{" "}
              questions correctly.
            </p>

          </div>


          {/* RESULT DETAILS */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
              marginTop: "25px"
            }}
          >

            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                border:
                  "1px solid #e2e8f0"
              }}
            >

              <p
                style={{
                  color: "#64748b",
                  margin: 0
                }}
              >
                Correct Answers
              </p>

              <h2>
                {result.correctAnswers}
              </h2>

            </div>


            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                border:
                  "1px solid #e2e8f0"
              }}
            >

              <p
                style={{
                  color: "#64748b",
                  margin: 0
                }}
              >
                Total Questions
              </p>

              <h2>
                {result.totalAnswered}
              </h2>

            </div>


            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                border:
                  "1px solid #e2e8f0"
              }}
            >

              <p
                style={{
                  color: "#64748b",
                  margin: 0
                }}
              >
                Readiness Score
              </p>

              <h2>
                {result.score}%
              </h2>

            </div>

          </div>


          {/* RECOMMENDATION */}

          <div
            style={{
              marginTop: "25px",
              padding: "25px",
              background: "#eff6ff",
              borderRadius: "12px"
            }}
          >

            <p
              style={{
                margin: 0,
                color: "#2563eb",
                fontWeight: "bold"
              }}
            >
              RECOMMENDATION
            </p>


            <h2>
              {result.score >= 80
                ? "You are ready to start applying for jobs."
                : result.score >= 60
                ? "You are close to being job ready. Continue improving your weak areas."
                : result.score >= 40
                ? "Keep practicing your technical fundamentals before applying."
                : "Start with the fundamentals and build your technical skills step by step."}
            </h2>


            <p
              style={{
                color: "#475569",
                lineHeight: "1.6"
              }}
            >
              Continue practicing coding problems,
              interview questions and technical concepts
              to improve your readiness score.
            </p>

          </div>


          {/* ACTION BUTTONS */}

          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
              marginTop: "30px"
            }}
          >

            <button
              onClick={handleRestart}
              style={{
                padding:
                  "12px 20px",
                border: "none",
                borderRadius: "8px",
                background: "#2563eb",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Retake Assessment
            </button>


            <button
              onClick={handleBackToJobs}
              style={{
                padding:
                  "12px 20px",
                border:
                  "1px solid #d1d5db",
                borderRadius: "8px",
                background: "white",
                color: "#334155",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              ← Back to Jobs
            </button>

          </div>

        </div>

      </div>

    );

  }


  // ========================================
  // CURRENT QUESTION
  // ========================================

  const question =
    questions[currentQuestion];


  const selectedAnswer =
    answers[question.id];


  const progress =
    Math.round(
      ((currentQuestion + 1) /
        questions.length) *
        100
    );


  const isLastQuestion =
    currentQuestion ===
    questions.length - 1;


  // ========================================
  // ASSESSMENT PAGE
  // ========================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px",
        fontFamily:
          "Arial, sans-serif"
      }}
    >

      <div
        style={{
          maxWidth: "950px",
          margin: "0 auto"
        }}
      >

        {/* ==================================
            HEADER
        ================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px"
          }}
        >

          <div>

            <p
              style={{
                margin: 0,
                color: "#2563eb",
                fontSize: "13px",
                fontWeight: "bold",
                letterSpacing: "1px"
              }}
            >
              JOB READINESS
            </p>

            <h1
              style={{
                margin:
                  "8px 0 10px",
                fontSize: "36px"
              }}
            >
              Technical Readiness Assessment
            </h1>

            <p
              style={{
                margin: 0,
                color: "#64748b"
              }}
            >
              Test your technical knowledge and
              discover how prepared you are for jobs.
            </p>

          </div>


          <button
            onClick={handleBackToJobs}
            style={{
              padding:
                "11px 18px",
              border:
                "1px solid #d1d5db",
              borderRadius:
                "8px",
              background: "white",
              cursor: "pointer"
            }}
          >
            ← Jobs
          </button>

        </div>


        {/* ==================================
            PROGRESS
        ================================== */}

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            border:
              "1px solid #e2e8f0",
            marginBottom: "25px"
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px"
            }}
          >

            <strong>
              Question {currentQuestion + 1}
              {" "}
              of{" "}
              {questions.length}
            </strong>

            <span
              style={{
                color: "#64748b"
              }}
            >
              {progress}%
            </span>

          </div>


          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#e2e8f0",
              borderRadius: "10px",
              overflow: "hidden"
            }}
          >

            <div
              style={{
                width:
                  `${progress}%`,
                height: "100%",
                background: "#2563eb",
                borderRadius: "10px"
              }}
            />

          </div>

        </div>


        {/* ==================================
            QUESTION CARD
        ================================== */}

        <div
          style={{
            background: "white",
            padding: "35px",
            borderRadius: "16px",
            border:
              "1px solid #e2e8f0"
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "15px",
              marginBottom: "20px"
            }}
          >

            <span
              style={{
                padding:
                  "6px 12px",
                background:
                  "#eff6ff",
                color:
                  "#2563eb",
                borderRadius:
                  "20px",
                fontSize:
                  "13px",
                fontWeight:
                  "bold"
              }}
            >
              {question.category}
            </span>


            <span
              style={{
                padding:
                  "6px 12px",
                background:
                  "#dcfce7",
                color:
                  "#166534",
                borderRadius:
                  "20px",
                fontSize:
                  "13px",
                fontWeight:
                  "bold"
              }}
            >
              {question.difficulty}
            </span>

          </div>


          <h2
            style={{
              lineHeight: "1.5",
              marginBottom: "30px"
            }}
          >
            {question.question}
          </h2>


          {/* ==================================
              OPTIONS
          ================================== */}

          <div
            style={{
              display: "grid",
              gap: "15px"
            }}
          >

            {question.options.map(
              (option) => {

                const isSelected =
                  selectedAnswer ===
                  option;


                return (

                  <button
                    key={option}
                    onClick={() =>
                      handleAnswerSelect(
                        question.id,
                        option
                      )
                    }
                    style={{
                      width: "100%",
                      padding:
                        "18px",
                      textAlign: "left",
                      border:
                        isSelected
                          ? "2px solid #2563eb"
                          : "1px solid #d1d5db",
                      borderRadius:
                        "10px",
                      background:
                        isSelected
                          ? "#eff6ff"
                          : "white",
                      color:
                        "#334155",
                      cursor:
                        "pointer",
                      fontSize:
                        "15px"
                    }}
                  >
                    {option}
                  </button>

                );

              }
            )}

          </div>


          {/* ==================================
              ERROR
          ================================== */}

          {error && (

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "#fee2e2",
                color: "#991b1b",
                borderRadius: "8px"
              }}
            >
              {error}
            </div>

          )}


          {/* ==================================
              NAVIGATION BUTTONS
          ================================== */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              gap: "15px",
              marginTop: "30px"
            }}
          >

            <button
              onClick={
                handlePrevious
              }
              disabled={
                currentQuestion === 0
              }
              style={{
                padding:
                  "12px 20px",
                border:
                  "1px solid #d1d5db",
                borderRadius:
                  "8px",
                background:
                  currentQuestion === 0
                    ? "#f1f5f9"
                    : "white",
                color:
                  "#334155",
                cursor:
                  currentQuestion === 0
                    ? "not-allowed"
                    : "pointer"
              }}
            >
              ← Previous
            </button>


            {!isLastQuestion && (

              <button
                onClick={
                  handleNext
                }
                style={{
                  padding:
                    "12px 24px",
                  border: "none",
                  borderRadius:
                    "8px",
                  background:
                    "#2563eb",
                  color:
                    "white",
                  cursor:
                    "pointer",
                  fontWeight:
                    "bold"
                }}
              >
                Next →
              </button>

            )}


            {isLastQuestion && (

              <button
                onClick={
                  handleSubmit
                }
                style={{
                  padding:
                    "12px 24px",
                  border: "none",
                  borderRadius:
                    "8px",
                  background:
                    "#16a34a",
                  color:
                    "white",
                  cursor:
                    "pointer",
                  fontWeight:
                    "bold"
                }}
              >
                Submit Assessment
              </button>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}

export default JobReadiness;