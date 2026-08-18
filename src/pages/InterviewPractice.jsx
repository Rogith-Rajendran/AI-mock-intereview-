import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function InterviewPractice() {

  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [selectedQuestion, setSelectedQuestion] =
    useState(null);

  const [practicedQuestions, setPracticedQuestions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ========================================
  // CATEGORIES
  // ========================================

  const categories = [
    "All",
    "JavaScript",
    "Python",
    "Java",
    "SQL"
  ];


  // ========================================
  // LOAD SAVED PROGRESS
  // ========================================

  useEffect(() => {

    const savedProgress =
      localStorage.getItem(
        "careerAI_interview_progress"
      );

    if (savedProgress) {

      try {

        const parsedProgress =
          JSON.parse(savedProgress);

        if (Array.isArray(parsedProgress)) {

          setPracticedQuestions(
            parsedProgress
          );

        }

      } catch (error) {

        console.error(
          "Unable to load saved progress:",
          error
        );

      }

    }

  }, []);


  // ========================================
  // SAVE PROGRESS
  // ========================================

  useEffect(() => {

    localStorage.setItem(
      "careerAI_interview_progress",
      JSON.stringify(
        practicedQuestions
      )
    );

  }, [practicedQuestions]);


  // ========================================
  // LOAD QUESTIONS
  // ========================================

  const fetchQuestions = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/interview/questions"
      );

      if (!response.ok) {

        throw new Error(
          "Unable to load interview questions"
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
        "Interview question error:",
        err
      );

      setError(
        "Unable to load interview questions. Please make sure the backend is running."
      );

    } finally {

      setLoading(false);

    }

  };


  // ========================================
  // LOAD QUESTIONS WHEN PAGE OPENS
  // ========================================

  useEffect(() => {

    fetchQuestions();

  }, []);


  // ========================================
  // FILTER QUESTIONS
  // ========================================

  const filteredQuestions =
    selectedCategory === "All"
      ? questions
      : questions.filter(
          (question) =>
            question.category ===
            selectedCategory
        );


  // ========================================
  // SELECT QUESTION
  // ========================================

  const handleQuestionSelect =
    (question) => {

      setSelectedQuestion(
        question
      );

      setPracticedQuestions(
        (previousQuestions) => {

          if (
            previousQuestions.includes(
              question.id
            )
          ) {

            return previousQuestions;

          }

          return [
            ...previousQuestions,
            question.id
          ];

        }
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    };


  // ========================================
  // BACK TO QUESTIONS
  // ========================================

  const handleBackToQuestions = () => {

    setSelectedQuestion(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // ========================================
  // BACK HOME
  // ========================================

  const handleBackHome = () => {

    navigate("/");

  };


  // ========================================
  // CLEAR PROGRESS
  // ========================================

  const handleClearProgress = () => {

    const confirmReset =
      window.confirm(
        "Are you sure you want to clear your interview progress?"
      );

    if (!confirmReset) {
      return;
    }

    setPracticedQuestions([]);

    localStorage.removeItem(
      "careerAI_interview_progress"
    );

    setSelectedQuestion(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  // ========================================
  // PROGRESS
  // ========================================

  const progressCount =
    filteredQuestions.filter(
      (question) =>
        practicedQuestions.includes(
          question.id
        )
    ).length;


  const totalQuestions =
    filteredQuestions.length;


  const progressPercentage =
    totalQuestions === 0
      ? 0
      : Math.round(
          (progressCount /
            totalQuestions) *
            100
        );


  const isCompleted =
    totalQuestions > 0 &&
    progressCount === totalQuestions;


  // ========================================
  // PAGE
  // ========================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px",
        fontFamily: "Arial, sans-serif"
      }}
    >

      {/* ==================================
          HEADER
      ================================== */}

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 35px"
        }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px"
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
              INTERVIEW PREPARATION
            </p>

            <h1
              style={{
                margin: "8px 0 10px",
                fontSize: "38px"
              }}
            >
              Prepare for Your Interview
            </h1>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                lineHeight: "1.6"
              }}
            >
              Practice common technical interview
              questions and understand the concepts
              behind them.
            </p>

          </div>


          <button
            onClick={handleBackHome}
            style={{
              padding: "11px 18px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              background: "white",
              cursor: "pointer"
            }}
          >
            ← Home
          </button>

        </div>

      </div>


      {/* ==================================
          MAIN CONTENT
      ================================== */}

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >

        {/* ==================================
            CATEGORY FILTER
        ================================== */}

        <section
          style={{
            marginBottom: "30px"
          }}
        >

          <h2>
            Choose a Technology
          </h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "15px"
            }}
          >

            {categories.map(
              (category) => (

                <button
                  key={category}
                  onClick={() => {

                    setSelectedCategory(
                      category
                    );

                    setSelectedQuestion(
                      null
                    );

                  }}
                  style={{
                    padding: "10px 18px",
                    border:
                      selectedCategory === category
                        ? "2px solid #2563eb"
                        : "1px solid #d1d5db",
                    borderRadius: "20px",
                    background:
                      selectedCategory === category
                        ? "#eff6ff"
                        : "white",
                    color:
                      selectedCategory === category
                        ? "#2563eb"
                        : "#334155",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  {category}
                </button>

              )
            )}

          </div>

        </section>


        {/* ==================================
            PROGRESS
        ================================== */}

        <section
          style={{
            padding: "25px",
            background: "white",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            marginBottom: "30px"
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px"
            }}
          >

            <div>

              <p
                style={{
                  margin: 0,
                  color: "#2563eb",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}
              >
                INTERVIEW PROGRESS
              </p>

              <h3
                style={{
                  margin: "6px 0 0"
                }}
              >
                Questions Practiced
              </h3>

            </div>


            <strong>
              {progressCount} / {totalQuestions}
            </strong>

          </div>


          {/* PROGRESS BAR */}

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
                  `${progressPercentage}%`,
                height: "100%",
                background: "#2563eb",
                borderRadius: "10px",
                transition:
                  "width 0.3s ease"
              }}
            />

          </div>


          <p
            style={{
              margin: "10px 0 0",
              color: "#64748b",
              fontSize: "14px"
            }}
          >
            {progressPercentage}% completed
          </p>


          {/* ==================================
              COMPLETION MESSAGE
          ================================== */}

          {isCompleted && (

            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                background: "#dcfce7",
                color: "#166534",
                borderRadius: "10px",
                fontWeight: "bold"
              }}
            >
              ✓ Interview Practice Completed
            </div>

          )}


          {/* ==================================
              CLEAR PROGRESS BUTTON
          ================================== */}

          {progressCount > 0 && (

            <button
              onClick={
                handleClearProgress
              }
              style={{
                marginTop: "18px",
                padding: "10px 16px",
                border:
                  "1px solid #dc2626",
                borderRadius: "8px",
                background: "white",
                color: "#dc2626",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Clear Progress
            </button>

          )}

        </section>


        {/* ==================================
            LOADING
        ================================== */}

        {loading && (

          <div
            style={{
              padding: "25px",
              background: "white",
              borderRadius: "12px"
            }}
          >
            Loading interview questions...
          </div>

        )}


        {/* ==================================
            ERROR
        ================================== */}

        {error && (

          <div
            style={{
              padding: "18px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "10px"
            }}
          >
            {error}
          </div>

        )}


        {/* ==================================
            QUESTION LIST
        ================================== */}

        {!loading &&
          !error &&
          !selectedQuestion && (

            <div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px"
                }}
              >

                <h2>
                  Interview Questions
                </h2>

                <span
                  style={{
                    color: "#64748b"
                  }}
                >
                  {filteredQuestions.length}
                  {" "}
                  Questions
                </span>

              </div>


              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "20px"
                }}
              >

                {filteredQuestions.map(
                  (question) => (

                    <div
                      key={question.id}
                      style={{
                        padding: "25px",
                        background: "white",
                        border:
                          "1px solid #e2e8f0",
                        borderRadius: "14px"
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          gap: "10px"
                        }}
                      >

                        <span
                          style={{
                            color: "#2563eb",
                            fontSize: "13px",
                            fontWeight: "bold"
                          }}
                        >
                          {question.category}
                        </span>


                        <span
                          style={{
                            padding: "5px 10px",
                            background: "#dcfce7",
                            color: "#166534",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "bold"
                          }}
                        >
                          {question.difficulty}
                        </span>

                      </div>


                      <h3
                        style={{
                          lineHeight: "1.5"
                        }}
                      >
                        {question.question}
                      </h3>


                      <p
                        style={{
                          color: "#64748b",
                          fontSize: "14px"
                        }}
                      >
                        Topic:
                        {" "}
                        {question.topic}
                      </p>


                      <button
                        onClick={() =>
                          handleQuestionSelect(
                            question
                          )
                        }
                        style={{
                          width: "100%",
                          marginTop: "10px",
                          padding: "12px",
                          border: "none",
                          borderRadius: "8px",
                          background: "#2563eb",
                          color: "white",
                          cursor: "pointer",
                          fontWeight: "bold"
                        }}
                      >
                        Practice Question →
                      </button>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


        {/* ==================================
            SELECTED QUESTION
        ================================== */}

        {selectedQuestion && (

          <section
            style={{
              background: "white",
              borderRadius: "14px",
              padding: "35px",
              border:
                "1px solid #e2e8f0"
            }}
          >

            <button
              onClick={
                handleBackToQuestions
              }
              style={{
                marginBottom: "25px",
                padding: "10px 16px",
                border:
                  "1px solid #d1d5db",
                borderRadius: "8px",
                background: "white",
                cursor: "pointer"
              }}
            >
              ← Back to Questions
            </button>


            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap"
              }}
            >

              <span
                style={{
                  padding: "6px 12px",
                  background: "#eff6ff",
                  color: "#2563eb",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "bold"
                }}
              >
                {selectedQuestion.category}
              </span>


              <span
                style={{
                  padding: "6px 12px",
                  background: "#dcfce7",
                  color: "#166534",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "bold"
                }}
              >
                {selectedQuestion.difficulty}
              </span>

            </div>


            <h1
              style={{
                marginTop: "25px",
                lineHeight: "1.4"
              }}
            >
              {selectedQuestion.question}
            </h1>


            <p
              style={{
                color: "#64748b"
              }}
            >
              Topic:
              {" "}
              {selectedQuestion.topic}
            </p>


            <hr
              style={{
                margin: "30px 0",
                border: "none",
                borderTop:
                  "1px solid #e5e7eb"
              }}
            />


            <h2>
              Answer
            </h2>


            <div
              style={{
                padding: "20px",
                background: "#f8fafc",
                borderRadius: "10px",
                lineHeight: "1.8",
                color: "#334155"
              }}
            >
              {selectedQuestion.answer}
            </div>


            <div
              style={{
                marginTop: "30px",
                padding: "20px",
                background: "#eff6ff",
                borderRadius: "10px"
              }}
            >

              <strong>
                Interview Tip
              </strong>


              <p
                style={{
                  color: "#475569",
                  lineHeight: "1.6"
                }}
              >
                Try answering the question
                yourself before looking at
                the answer. This helps you
                build interview confidence.
              </p>

            </div>

          </section>

        )}

      </div>

    </div>

  );

}

export default InterviewPractice;