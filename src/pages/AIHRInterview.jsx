import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function AIHRInterview() {
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000";
  const TOTAL_QUESTIONS = 7;

  /*
  ========================================================
  INTERVIEW TYPES
  ========================================================
  */

  const getQuestionType = (number) => {
    if (number === 1) return "Introduction";
    if (number >= 2 && number <= 6) return "Technical";
    if (number === 7) return "Feedback";
    return "HR";
  };

  /*
  ========================================================
  USER DATA
  ========================================================
  */

  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);

  const [scores, setScores] = useState({
    aptitude: 0,
    coding: 0,
    gd: 0,
  });

  /*
  ========================================================
  INTERVIEW STATE
  ========================================================
  */

  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");

  const [questionNumber, setQuestionNumber] = useState(0);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);

  const [finalReview, setFinalReview] = useState(null);

  /*
  ========================================================
  REFS
  ========================================================
  */

  const recognitionRef = useRef(null);
  const speechTimeoutRef = useRef(null);

  /*
  ========================================================
  LOAD USER DATA
  ========================================================
  */

  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData =
          localStorage.getItem("careerAIUser");

        if (!userData) {
          navigate("/login");
          return;
        }

        const currentUser = JSON.parse(userData);

        setUser(currentUser);

        const userId =
          currentUser?._id ||
          currentUser?.id ||
          currentUser?.email;

        if (!userId) return;

        /*
        --------------------------------------------
        RESUME
        --------------------------------------------
        */

        const savedResume =
          localStorage.getItem(
            `careerAIResume_${userId}`
          );

        if (savedResume) {
          try {
            setResume(JSON.parse(savedResume));
          } catch (error) {
            console.error(
              "Unable to load resume:",
              error
            );
          }
        }

        /*
        --------------------------------------------
        ROUND 1
        --------------------------------------------
        */

        const round1 =
          localStorage.getItem(
            `careerAIRound1_${userId}`
          );

        if (round1) {
          try {
            const data = JSON.parse(round1);

            setScores((previous) => ({
              ...previous,
              aptitude: Number(
                data.percentage || 0
              ),
            }));
          } catch (error) {
            console.error(
              "Unable to load Round 1:",
              error
            );
          }
        }

        /*
        --------------------------------------------
        ROUND 2
        --------------------------------------------
        */

        const round2 =
          localStorage.getItem(
            `careerAIRound2_${userId}`
          );

        if (round2) {
          try {
            const data = JSON.parse(round2);

            setScores((previous) => ({
              ...previous,
              coding: Number(
                data.percentage || 0
              ),
            }));
          } catch (error) {
            console.error(
              "Unable to load Round 2:",
              error
            );
          }
        }

        /*
        --------------------------------------------
        ROUND 3
        --------------------------------------------
        */

        const round3 =
          localStorage.getItem(
            `careerAIRound3_${userId}`
          );

        if (round3) {
          try {
            const data = JSON.parse(round3);

            setScores((previous) => ({
              ...previous,
              gd: Number(
                data.percentage ||
                data.score ||
                0
              ),
            }));
          } catch (error) {
            console.error(
              "Unable to load Round 3:",
              error
            );
          }
        }
      } catch (error) {
        console.error(
          "Unable to load user:",
          error
        );

        navigate("/login");
      }
    };

    loadUserData();
  }, [navigate]);

  /*
  ========================================================
  CLEANUP
  ========================================================
  */

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log(error);
        }
      }

      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, []);

  /*
  ========================================================
  RESUME TEXT
  ========================================================
  */

  const getResumeText = () => {
    if (!resume) return "";

    return (
      resume.text ||
      resume.resumeText ||
      resume.content ||
      resume.extractedText ||
      ""
    );
  };

  /*
  ========================================================
  TEXT TO SPEECH
  ========================================================
  */

  const speakText = (text) => {
    if (!text) return;

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices =
      window.speechSynthesis.getVoices();

    const englishVoice =
      voices.find((voice) =>
        voice.lang
          ?.toLowerCase()
          .startsWith("en")
      );

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setSpeaking(true);
    };

    utterance.onend = () => {
      setSpeaking(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  /*
  ========================================================
  SPEAK QUESTION
  ========================================================
  */

  useEffect(() => {
    if (
      started &&
      question?.text
    ) {
      speechTimeoutRef.current =
        setTimeout(() => {
          speakText(question.text);
        }, 400);
    }

    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(
          speechTimeoutRef.current
        );
      }
    };
  }, [question, started]);

  /*
  ========================================================
  SPEECH RECOGNITION
  ========================================================
  */

  const getRecognition = () => {
    return (
      window.SpeechRecognition ||
      window.webkitSpeechRecognition
    );
  };

  /*
  ========================================================
  START LISTENING
  ========================================================
  */

  const startListening = () => {
    setError("");

    const SpeechRecognition =
      getRecognition();

    if (!SpeechRecognition) {
      setError(
        "Voice recognition is not supported in this browser. Please use Chrome or Edge."
      );

      return;
    }

    window.speechSynthesis.cancel();
    setSpeaking(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log(error);
      }
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (
          event.results[i].isFinal
        ) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      setAnswer(
        (
          finalText ||
          interimText
        ).trim()
      );
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event
      );

      setListening(false);

      if (
        event.error ===
        "not-allowed"
      ) {
        setError(
          "Microphone permission was denied. Please allow microphone access."
        );
      } else if (
        event.error ===
        "no-speech"
      ) {
        setError(
          "No speech was detected. Please try again."
        );
      } else {
        setError(
          `Voice recognition error: ${event.error}`
        );
      }
    };

    recognitionRef.current =
      recognition;

    try {
      recognition.start();
    } catch (error) {
      console.error(error);
      setListening(false);
    }
  };

  /*
  ========================================================
  STOP LISTENING
  ========================================================
  */

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log(error);
      }
    }

    setListening(false);
  };

  /*
  ========================================================
  START INTERVIEW
  ========================================================
  */

  const startInterview = async () => {
    if (!user) {
      setError(
        "User information is not available."
      );

      return;
    }

    setLoading(true);
    setError("");

    setHistory([]);
    setFinalReview(null);

    setFinished(false);
    setQuestionNumber(0);

    try {
      const response =
        await fetch(
          `${API_URL}/api/ai-hr/start`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              user,

              resume,

              resumeText:
                getResumeText(),

              aptitude:
                scores.aptitude,

              coding:
                scores.coding,

              gd:
                scores.gd,

              role:
                "Software Developer",

              totalQuestions:
                TOTAL_QUESTIONS,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
          "Unable to start AI HR interview."
        );
      }

      const firstQuestion =
        data.question ||
        data.firstQuestion ||
        data.nextQuestion;

      if (!firstQuestion) {
        throw new Error(
          "AI did not return the first question."
        );
      }

      const normalizedQuestion =
        typeof firstQuestion ===
        "string"
          ? {
              text:
                firstQuestion,
              category:
                "Introduction",
            }
          : {
              text:
                firstQuestion.text ||
                firstQuestion.question ||
                firstQuestion.prompt ||
                "",
              category:
                "Introduction",
            };

      setQuestion(
        normalizedQuestion
      );

      setQuestionNumber(1);
      setAnswer("");
      setStarted(true);

      if (data.sessionId) {
        localStorage.setItem(
          "careerAIHRSessionId",
          data.sessionId
        );
      }
    } catch (error) {
      console.error(
        "AI HR START ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to start AI HR interview."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================================
  FINISH INTERVIEW
  ========================================================
  */

  const finishInterview = async (
    completeHistory
  ) => {
    try {
      setLoading(true);

      const response =
        await fetch(
          `${API_URL}/api/ai-hr/finish`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              user,

              history:
                completeHistory,

              resumeText:
                getResumeText(),

              aptitude:
                scores.aptitude,

              coding:
                scores.coding,

              gd:
                scores.gd,

              role:
                "Software Developer",
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
          "Unable to generate final evaluation."
        );
      }

      setFinalReview(
        data.evaluation ||
        data.review ||
        null
      );

      setFinished(true);
      setStarted(false);
      setQuestion(null);

      window.speechSynthesis.cancel();
      setSpeaking(false);
    } catch (error) {
      console.error(
        "FINAL EVALUATION ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to generate final evaluation."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================================
  SUBMIT ANSWER
  ========================================================
  */

  const submitAnswer = async () => {
    stopListening();

    window.speechSynthesis.cancel();
    setSpeaking(false);

    const finalAnswer =
      answer.trim();

    if (!finalAnswer) {
      setError(
        "Please speak your answer before submitting."
      );

      return;
    }

    if (!question) {
      setError(
        "No active interview question."
      );

      return;
    }

    setLoading(true);
    setError("");

    try {
      const currentRecord = {
        question:
          question.text,

        answer:
          finalAnswer,

        category:
          getQuestionType(
            questionNumber
          ),
      };

      const completeHistory = [
        ...history,
        currentRecord,
      ];

      /*
      ==============================================
      QUESTION 7 = FINISH
      ==============================================
      */

      if (
        questionNumber >=
        TOTAL_QUESTIONS
      ) {
        setHistory(
          completeHistory
        );

        setAnswer("");

        await finishInterview(
          completeHistory
        );

        return;
      }

      /*
      ==============================================
      SEND ANSWER
      ==============================================
      */

      const response =
        await fetch(
          `${API_URL}/api/ai-hr/answer`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              user,

              question:
                question.text,

              answer:
                finalAnswer,

              questionNumber:
                questionNumber,

              totalQuestions:
                TOTAL_QUESTIONS,

              history:
                completeHistory,

              resumeText:
                getResumeText(),

              aptitude:
                scores.aptitude,

              coding:
                scores.coding,

              gd:
                scores.gd,

              role:
                "Software Developer",
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
          "Unable to process your answer."
        );
      }

      const returnedHistory =
        Array.isArray(data.history)
          ? data.history
          : completeHistory;

      setHistory(
        returnedHistory
      );

      const nextNumber =
        questionNumber + 1;

      /*
      ==============================================
      SAFETY
      ==============================================
      */

      if (
        nextNumber >
        TOTAL_QUESTIONS
      ) {
        await finishInterview(
          returnedHistory
        );

        return;
      }

      /*
      ==============================================
      NEXT QUESTION
      ==============================================
      */

      const nextQuestion =
        data.question ||
        data.nextQuestion ||
        data.next ||
        data.aiQuestion;

      if (!nextQuestion) {
        throw new Error(
          "AI did not return the next question."
        );
      }

      const normalizedQuestion =
        typeof nextQuestion ===
        "string"
          ? {
              text:
                nextQuestion,

              category:
                getQuestionType(
                  nextNumber
                ),
            }
          : {
              text:
                nextQuestion.text ||
                nextQuestion.question ||
                nextQuestion.prompt ||
                "",

              category:
                getQuestionType(
                  nextNumber
                ),
            };

      setQuestion(
        normalizedQuestion
      );

      setQuestionNumber(
        nextNumber
      );

      setAnswer("");
    } catch (error) {
      console.error(
        "AI HR ANSWER ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to process your answer."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================================
  SPEAK AGAIN
  ========================================================
  */

  const speakAgain = () => {
    if (question?.text) {
      speakText(question.text);
    }
  };

  /*
  ========================================================
  SCORE HELPER
  ========================================================
  */

  const getScore = (value) => {
    const score = Number(value);

    if (
      !Number.isFinite(score)
    ) {
      return 0;
    }

    return Math.max(
      0,
      Math.min(
        100,
        score
      )
    );
  };

  /*
  ========================================================
  SCORE CARD
  ========================================================
  */

  const ScoreCard = ({
    title,
    value,
    letter,
  }) => {
    const score =
      getScore(value);

    return (
      <div className="aihr-score-card">

        <div className="aihr-score-card-top">

          <span>
            {title}
          </span>

          <span className="aihr-score-icon">
            {letter}
          </span>

        </div>

        <strong>
          {score}%
        </strong>

        <div className="aihr-progress">

          <div
            style={{
              width:
                `${score}%`,
            }}
          />

        </div>

      </div>
    );
  };

  /*
  ========================================================
  FINAL REVIEW
  ========================================================
  */

  if (finished) {
    const overall =
      getScore(
        finalReview?.overallScore
      );

    const communication =
      getScore(
        finalReview?.communicationScore
      );

    const confidence =
      getScore(
        finalReview?.confidenceScore
      );

    const technical =
      getScore(
        finalReview?.technicalAwarenessScore
      );

    const professionalism =
      getScore(
        finalReview?.professionalismScore
      );

    const hrFit =
      getScore(
        finalReview?.hrFitScore
      );

    return (
      <div className="aihr-result-page">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="aihr-result-header">

          <div className="aihr-result-header-content">

            <div>

              <span className="aihr-result-label">
                FINAL INTERVIEW RESULT
              </span>

              <h1>
                AI HR Interview Complete
              </h1>

              <p>
                Your 7-question Software Developer
                interview has been completed.
              </p>

            </div>

            <div className="aihr-completed-badge">

              <span className="aihr-check">
                ✓
              </span>

              <div>

                <strong>
                  Completed
                </strong>

                <small>
                  7 / 7 Questions
                </small>

              </div>

            </div>

          </div>

        </div>


        {/* ======================================
            OVERALL SCORE
        ====================================== */}

        <div className="aihr-overall-card">

          <div className="aihr-overall-left">

            <span className="aihr-section-label">
              OVERALL SCORE
            </span>

            <div className="aihr-overall-score">
              {overall}
              <span>%</span>
            </div>

            <p>
              Overall performance across the
              AI HR interview.
            </p>

          </div>

          <div
            className="aihr-score-ring"
            style={{
              "--score":
                overall,
            }}
          >

            <div className="aihr-score-ring-inner">

              <strong>
                {overall}%
              </strong>

              <span>
                Overall
              </span>

            </div>

          </div>

        </div>


        {/* ======================================
            SCORE CARDS
        ====================================== */}

        <div className="aihr-score-grid">

          <ScoreCard
            title="Communication"
            value={communication}
            letter="C"
          />

          <ScoreCard
            title="Confidence"
            value={confidence}
            letter="C"
          />

          <ScoreCard
            title="Technical Awareness"
            value={technical}
            letter="T"
          />

          <ScoreCard
            title="Professionalism"
            value={professionalism}
            letter="P"
          />

          <ScoreCard
            title="HR Fit"
            value={hrFit}
            letter="H"
          />

          <ScoreCard
            title="Interview"
            value={overall}
            letter="I"
          />

        </div>


        {/* ======================================
            STRENGTHS + IMPROVEMENTS
        ====================================== */}

        <div className="aihr-review-grid">

          {/* STRENGTHS */}

          <div className="aihr-review-card">

            <div className="aihr-review-title">

              <div className="aihr-review-title-icon strength">
                ✓
              </div>

              <div>

                <h2>
                  Strengths
                </h2>

                <p>
                  Areas where you performed well
                </p>

              </div>

            </div>

            <div className="aihr-list">

              {Array.isArray(
                finalReview?.strengths
              ) &&
              finalReview.strengths.length > 0 ? (

                finalReview.strengths.map(
                  (item, index) => (

                    <div
                      className="aihr-list-item"
                      key={index}
                    >

                      <span className="aihr-list-check">
                        ✓
                      </span>

                      <span>
                        {item}
                      </span>

                    </div>

                  )
                )

              ) : (

                <p className="aihr-empty">
                  No strengths were provided.
                </p>

              )}

            </div>

          </div>


          {/* IMPROVEMENTS */}

          <div className="aihr-review-card">

            <div className="aihr-review-title">

              <div className="aihr-review-title-icon improvement">
                !
              </div>

              <div>

                <h2>
                  Areas to Improve
                </h2>

                <p>
                  Focus areas for your preparation
                </p>

              </div>

            </div>

            <div className="aihr-list">

              {Array.isArray(
                finalReview?.improvements
              ) &&
              finalReview.improvements.length > 0 ? (

                finalReview.improvements.map(
                  (item, index) => (

                    <div
                      className="aihr-list-item"
                      key={index}
                    >

                      <span className="aihr-list-warning">
                        !
                      </span>

                      <span>
                        {item}
                      </span>

                    </div>

                  )
                )

              ) : (

                <p className="aihr-empty">
                  No improvement areas were provided.
                </p>

              )}

            </div>

          </div>

        </div>


        {/* ======================================
            SUMMARY
        ====================================== */}

        <div className="aihr-summary-card">

          <div className="aihr-summary-header">

            <div className="aihr-summary-icon">
              AI
            </div>

            <div>

              <span>
                AI ANALYSIS
              </span>

              <h2>
                Interview Summary
              </h2>

            </div>

          </div>

          <p className="aihr-summary-text">

            {finalReview?.summary ||
              "Your interview has been completed successfully."}

          </p>

        </div>


        {/* ======================================
            RECOMMENDATION
        ====================================== */}

        <div className="aihr-recommendation-card">

          <div className="aihr-recommendation-content">

            <div className="aihr-recommendation-icon">
              ★
            </div>

            <div>

              <span className="aihr-section-label">
                AI RECOMMENDATION
              </span>

              <h2>
                {finalReview?.recommendation ||
                  "Continue improving your technical and communication skills."}
              </h2>

            </div>

          </div>

        </div>


        {/* ======================================
            BUTTON
        ====================================== */}

        <div className="aihr-result-actions">

          <button
            type="button"
            className="aihr-dashboard-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>
    );
  }

  /*
  ========================================================
  MAIN INTERVIEW SCREEN
  ========================================================
  */

  return (
    <div className="login-page">

      <div
        className="login-card"
        style={{
          maxWidth:
            "1000px",
        }}
      >

        <div className="login-header">

          <p className="dashboard-label">
            FINAL ROUND
          </p>

          <h1>
            AI HR Interview
          </h1>

          <p>
            Complete the 7-question interview
            to receive your AI performance review.
          </p>

        </div>


        {/* ======================================
            USER
        ====================================== */}

        <div className="aihr-info-section">

          <h2>
            Candidate
          </h2>

          <p>
            {user?.name || "Student"}
          </p>

          <p>
            {user?.email || ""}
          </p>

        </div>


        {/* ======================================
            RESUME
        ====================================== */}

        <div className="aihr-info-section">

          <h2>
            Resume
          </h2>

          <p>
            {resume?.fileName ||
              resume?.name ||
              "Resume uploaded"}
          </p>

        </div>


        {/* ======================================
            PREVIOUS PERFORMANCE
        ====================================== */}

        <div className="aihr-info-section">

          <h2>
            Previous Performance
          </h2>

          <div className="aihr-performance-grid">

            <div>
              <span>
                Aptitude
              </span>

              <strong>
                {scores.aptitude}%
              </strong>
            </div>

            <div>
              <span>
                Coding
              </span>

              <strong>
                {scores.coding}%
              </strong>
            </div>

            <div>
              <span>
                Group Discussion
              </span>

              <strong>
                {scores.gd}%
              </strong>
            </div>

          </div>

        </div>


        {/* ======================================
            ERROR
        ====================================== */}

        {error && (

          <div className="aihr-error">
            {error}
          </div>

        )}


        {/* ======================================
            START
        ====================================== */}

        {!started &&
          !question && (

            <div className="aihr-start-section">

              <div className="aihr-interview-plan">

                <h2>
                  Interview Structure
                </h2>

                <div className="aihr-plan-item">
                  <span>01</span>
                  <div>
                    <strong>
                      Introduction
                    </strong>
                    <small>
                      Tell us about yourself
                    </small>
                  </div>
                </div>

                <div className="aihr-plan-item">
                  <span>02–06</span>
                  <div>
                    <strong>
                      Technical Questions
                    </strong>
                    <small>
                      Software Developer technical assessment
                    </small>
                  </div>
                </div>

                <div className="aihr-plan-item">
                  <span>07</span>
                  <div>
                    <strong>
                      Feedback
                    </strong>
                    <small>
                      Final thoughts about the interview
                    </small>
                  </div>
                </div>

              </div>

              <button
                type="button"
                className="aihr-start-button"
                onClick={
                  startInterview
                }
                disabled={
                  loading
                }
              >
                {loading
                  ? "Starting Interview..."
                  : "Start AI HR Interview →"}
              </button>

            </div>

          )}


        {/* ======================================
            ACTIVE INTERVIEW
        ====================================== */}

        {started &&
          question && (

            <div className="aihr-interview-section">

              {/* QUESTION HEADER */}

              <div className="aihr-question-header">

                <div>

                  <span className="aihr-question-label">
                    QUESTION
                  </span>

                  <h2>
                    {questionNumber}
                    <span>
                      {" "}
                      / {TOTAL_QUESTIONS}
                    </span>
                  </h2>

                </div>

                <div className="aihr-question-category">
                  {getQuestionType(
                    questionNumber
                  )}
                </div>

              </div>


              {/* PROGRESS */}

              <div className="aihr-question-progress">

                <div
                  style={{
                    width:
                      `${(
                        questionNumber /
                        TOTAL_QUESTIONS
                      ) * 100}%`,
                  }}
                />

              </div>


              {/* QUESTION */}

              <div className="aihr-question-box">

                <span>
                  AI HR QUESTION
                </span>

                <p>
                  {question.text}
                </p>

              </div>


              {/* CONTROLS */}

              <div className="aihr-voice-controls">

                <button
                  type="button"
                  className="aihr-secondary-button"
                  onClick={
                    speakAgain
                  }
                  disabled={
                    speaking ||
                    loading
                  }
                >
                  {speaking
                    ? "AI Speaking..."
                    : "🔊 Hear Question"}
                </button>


                {!listening ? (

                  <button
                    type="button"
                    className="aihr-primary-button"
                    onClick={
                      startListening
                    }
                    disabled={
                      loading
                    }
                  >
                    🎤 Start Speaking
                  </button>

                ) : (

                  <button
                    type="button"
                    className="aihr-stop-button"
                    onClick={
                      stopListening
                    }
                  >
                    ⏹ Stop Speaking
                  </button>

                )}

              </div>


              {/* LISTENING */}

              {listening && (

                <div className="aihr-listening">

                  <span className="aihr-pulse">
                    ●
                  </span>

                  Listening... Speak your answer.

                </div>

              )}


              {/* ANSWER */}

              <div className="aihr-answer-section">

                <label>
                  Your Spoken Answer
                </label>

                <textarea
                  value={
                    answer
                  }
                  onChange={(
                    event
                  ) =>
                    setAnswer(
                      event.target.value
                    )
                  }
                  placeholder="Your spoken answer will appear here..."
                  rows="7"
                />

              </div>


              {/* SUBMIT */}

              <button
                type="button"
                className="aihr-submit-button"
                onClick={
                  submitAnswer
                }
                disabled={
                  loading ||
                  !answer.trim()
                }
              >
                {loading
                  ? "AI is processing your answer..."
                  : questionNumber ===
                    TOTAL_QUESTIONS
                  ? "Finish Interview →"
                  : "Submit Answer →"}
              </button>

            </div>

          )}

      </div>

    </div>
  );
}

export default AIHRInterview;


/*
=========================================================
AI HR FINAL REVIEW + INTERVIEW CSS
=========================================================
*/

const aihrStyles = `
.aihr-result-page {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 30px 70px;
  box-sizing: border-box;
}

.aihr-result-header {
  margin-bottom: 24px;
}

.aihr-result-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: 32px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}

.aihr-result-label {
  display: inline-block;
  margin-bottom: 10px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.aihr-result-header h1 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 32px;
  font-weight: 800;
}

.aihr-result-header p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
}

.aihr-completed-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
}

.aihr-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #16a34a;
  color: white;
  font-size: 20px;
  font-weight: 800;
}

.aihr-completed-badge strong {
  display: block;
  color: #166534;
  font-size: 14px;
}

.aihr-completed-badge small {
  display: block;
  margin-top: 3px;
  color: #15803d;
  font-size: 12px;
}

.aihr-overall-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 24px;
  padding: 35px 40px;
  background: linear-gradient(
    135deg,
    #eff6ff,
    #ffffff
  );
  border: 1px solid #bfdbfe;
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(37, 99, 235, 0.08);
}

.aihr-overall-left {
  flex: 1;
}

.aihr-section-label {
  display: block;
  margin-bottom: 8px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.aihr-overall-score {
  color: #0f172a;
  font-size: 64px;
  line-height: 1;
  font-weight: 900;
}

.aihr-overall-score span {
  margin-left: 5px;
  color: #64748b;
  font-size: 28px;
}

.aihr-overall-left p {
  margin-top: 12px;
  color: #64748b;
}

.aihr-score-ring {
  --score: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 145px;
  height: 145px;

  border-radius: 50%;

  background:
    conic-gradient(
      #2563eb
      calc(var(--score) * 3.6deg),
      #dbeafe
      calc(var(--score) * 3.6deg)
    );

  position: relative;
}

.aihr-score-ring::before {
  content: "";
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  background: #ffffff;
}

.aihr-score-ring-inner {
  position: relative;
  z-index: 2;
  text-align: center;
}

.aihr-score-ring-inner strong {
  display: block;
  color: #0f172a;
  font-size: 27px;
}

.aihr-score-ring-inner span {
  color: #64748b;
  font-size: 11px;
}

.aihr-score-grid {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}

.aihr-score-card {
  padding: 23px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  box-shadow:
    0 5px 20px rgba(15, 23, 42, 0.04);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.aihr-score-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 25px rgba(15, 23, 42, 0.08);
}

.aihr-score-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.aihr-score-card-top > span:first-child {
  color: #475569;
  font-size: 14px;
  font-weight: 600;
}

.aihr-score-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;

  border-radius: 8px;

  background: #eff6ff;
  color: #2563eb;

  font-size: 12px;
  font-weight: 800;
}

.aihr-score-card > strong {
  display: block;
  margin-bottom: 12px;
  color: #0f172a;
  font-size: 30px;
}

.aihr-progress {
  width: 100%;
  height: 7px;
  overflow: hidden;
  background: #e2e8f0;
  border-radius: 20px;
}

.aihr-progress > div {
  height: 100%;
  background: #2563eb;
  border-radius: 20px;
  transition: width 0.6s ease;
}

.aihr-review-grid {
  display: grid;
  grid-template-columns:
    repeat(2, 1fr);
  gap: 22px;
  margin-bottom: 24px;
}

.aihr-review-card {
  padding: 28px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 17px;
  box-shadow:
    0 5px 20px rgba(15, 23, 42, 0.04);
}

.aihr-review-title {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.aihr-review-title-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  border-radius: 11px;

  font-size: 18px;
  font-weight: 800;
}

.aihr-review-title-icon.strength {
  background: #dcfce7;
  color: #15803d;
}

.aihr-review-title-icon.improvement {
  background: #fef3c7;
  color: #b45309;
}

.aihr-review-title h2 {
  margin: 0;
  color: #0f172a;
  font-size: 19px;
}

.aihr-review-title p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 12px;
}

.aihr-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.aihr-list-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 14px;
  background: #f8fafc;
  border-radius: 10px;
  color: #334155;
  font-size: 14px;
  line-height: 1.55;
}

.aihr-list-check,
.aihr-list-warning {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 22px;
  height: 22px;

  border-radius: 50%;

  font-size: 12px;
  font-weight: 800;
}

.aihr-list-check {
  background: #dcfce7;
  color: #15803d;
}

.aihr-list-warning {
  background: #fef3c7;
  color: #b45309;
}

.aihr-empty {
  color: #94a3b8;
  font-size: 14px;
}

.aihr-summary-card {
  margin-bottom: 24px;
  padding: 30px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 17px;
  box-shadow:
    0 5px 20px rgba(15, 23, 42, 0.04);
}

.aihr-summary-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.aihr-summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 45px;
  height: 45px;

  border-radius: 12px;

  background: #2563eb;
  color: #ffffff;

  font-size: 12px;
  font-weight: 900;
}

.aihr-summary-header span {
  display: block;
  color: #2563eb;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.aihr-summary-header h2 {
  margin: 3px 0 0;
  color: #0f172a;
  font-size: 20px;
}

.aihr-summary-text {
  margin: 0;
  color: #475569;
  font-size: 15px;
  line-height: 1.8;
}

.aihr-recommendation-card {
  margin-bottom: 28px;
  padding: 25px 30px;

  background: #f8fafc;

  border: 1px solid #cbd5e1;
  border-left: 5px solid #2563eb;

  border-radius: 15px;
}

.aihr-recommendation-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.aihr-recommendation-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 42px;
  height: 42px;

  border-radius: 10px;

  background: #dbeafe;
  color: #2563eb;

  font-size: 18px;
}

.aihr-recommendation-content h2 {
  margin: 4px 0 0;
  color: #1e293b;
  font-size: 18px;
  line-height: 1.5;
}

.aihr-result-actions {
  display: flex;
  justify-content: center;
}

.aihr-dashboard-button {
  padding: 14px 26px;

  border: none;
  border-radius: 10px;

  background: #2563eb;
  color: #ffffff;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.aihr-dashboard-button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}


/* =========================================================
   AI HR INTERVIEW PAGE
   ========================================================= */

.aihr-info-section {
  margin-bottom: 25px;
}

.aihr-info-section h2 {
  margin-bottom: 8px;
  color: #0f172a;
  font-size: 18px;
}

.aihr-info-section p {
  margin: 4px 0;
  color: #64748b;
}

.aihr-performance-grid {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 14px;
  margin-top: 15px;
}

.aihr-performance-grid > div {
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.aihr-performance-grid span {
  display: block;
  margin-bottom: 5px;
  color: #64748b;
  font-size: 12px;
}

.aihr-performance-grid strong {
  color: #0f172a;
  font-size: 20px;
}

.aihr-error {
  margin: 20px 0;
  padding: 14px 16px;
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 10px;
}

.aihr-start-section {
  margin-top: 30px;
}

.aihr-interview-plan {
  margin-bottom: 25px;
  padding: 25px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
}

.aihr-interview-plan h2 {
  margin: 0 0 20px;
  color: #0f172a;
}

.aihr-plan-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 14px 0;
  border-bottom: 1px solid #e2e8f0;
}

.aihr-plan-item:last-child {
  border-bottom: none;
}

.aihr-plan-item > span {
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 55px;
  height: 34px;

  background: #eff6ff;
  color: #2563eb;

  border-radius: 8px;

  font-size: 12px;
  font-weight: 800;
}

.aihr-plan-item strong {
  display: block;
  color: #334155;
}

.aihr-plan-item small {
  display: block;
  margin-top: 3px;
  color: #64748b;
}

.aihr-start-button,
.aihr-submit-button {
  width: 100%;
  padding: 15px 20px;

  border: none;
  border-radius: 10px;

  background: #2563eb;
  color: #ffffff;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.aihr-start-button:hover,
.aihr-submit-button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.aihr-start-button:disabled,
.aihr-submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.aihr-interview-section {
  margin-top: 25px;
}

.aihr-question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.aihr-question-label {
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.aihr-question-header h2 {
  margin: 5px 0 0;
  color: #0f172a;
  font-size: 36px;
}

.aihr-question-header h2 span {
  color: #94a3b8;
  font-size: 20px;
}

.aihr-question-category {
  padding: 8px 14px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.aihr-question-progress {
  width: 100%;
  height: 7px;
  margin: 20px 0 25px;
  overflow: hidden;
  background: #e2e8f0;
  border-radius: 20px;
}

.aihr-question-progress > div {
  height: 100%;
  background: #2563eb;
  border-radius: 20px;
  transition: width 0.4s ease;
}

.aihr-question-box {
  padding: 28px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
}

.aihr-question-box > span {
  color: #2563eb;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.aihr-question-box p {
  margin: 14px 0 0;
  color: #1e293b;
  font-size: 19px;
  line-height: 1.7;
}

.aihr-voice-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 20px 0;
}

.aihr-primary-button,
.aihr-secondary-button,
.aihr-stop-button {
  padding: 12px 18px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.aihr-primary-button {
  border: none;
  background: #2563eb;
  color: #ffffff;
}

.aihr-secondary-button {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
}

.aihr-stop-button {
  border: none;
  background: #dc2626;
  color: #ffffff;
}

.aihr-listening {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 18px;
  padding: 13px 15px;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
}

.aihr-pulse {
  color: #2563eb;
  animation: aihrPulse 1s infinite;
}

@keyframes aihrPulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }

  100% {
    opacity: 1;
  }
}

.aihr-answer-section {
  margin-bottom: 20px;
}

.aihr-answer-section label {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.aihr-answer-section textarea {
  width: 100%;
  box-sizing: border-box;

  padding: 15px;

  border: 1px solid #cbd5e1;
  border-radius: 10px;

  background: #ffffff;

  color: #1e293b;

  font-family: inherit;
  font-size: 15px;

  line-height: 1.6;

  resize: vertical;

  outline: none;
}

.aihr-answer-section textarea:focus {
  border-color: #2563eb;
  box-shadow:
    0 0 0 3px rgba(
      37,
      99,
      235,
      0.1
    );
}


/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 900px) {

  .aihr-score-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .aihr-review-grid {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 650px) {

  .aihr-result-page {
    padding: 25px 15px 50px;
  }

  .aihr-result-header-content {
    flex-direction: column;
    align-items: flex-start;
    padding: 25px;
  }

  .aihr-result-header h1 {
    font-size: 25px;
  }

  .aihr-completed-badge {
    width: 100%;
    box-sizing: border-box;
  }

  .aihr-overall-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 28px;
  }

  .aihr-overall-score {
    font-size: 52px;
  }

  .aihr-score-ring {
    width: 125px;
    height: 125px;
  }

  .aihr-score-grid {
    grid-template-columns: 1fr;
  }

  .aihr-review-card {
    padding: 22px;
  }

  .aihr-summary-card {
    padding: 22px;
  }

  .aihr-recommendation-card {
    padding: 22px;
  }

  .aihr-performance-grid {
    grid-template-columns: 1fr;
  }

  .aihr-question-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .aihr-voice-controls {
    flex-direction: column;
  }

  .aihr-primary-button,
  .aihr-secondary-button,
  .aihr-stop-button {
    width: 100%;
  }

}
`;

/*
========================================================
INJECT AI HR STYLES
========================================================
*/

if (
  typeof document !== "undefined" &&
  !document.getElementById(
    "aihr-final-review-styles"
  )
) {
  const style =
    document.createElement("style");

  style.id =
    "aihr-final-review-styles";

  style.innerHTML =
    aihrStyles;

  document.head.appendChild(style);
}