import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AIHRInterviewStart() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);

  const [round1, setRound1] = useState(null);
  const [round2, setRound2] = useState(null);
  const [round3, setRound3] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");


  // ========================================
  // LOAD USER DATA
  // ========================================

  useEffect(() => {

    const userData =
      localStorage.getItem(
        "careerAIUser"
      );

    if (!userData) {
      navigate("/login");
      return;
    }

    try {

      const currentUser =
        JSON.parse(userData);

      setUser(currentUser);


      const userId =
        currentUser?._id ||
        currentUser?.id ||
        currentUser?.email;


      if (!userId) {

        setError(
          "Unable to identify the logged-in user."
        );

        setLoading(false);

        return;
      }


      // ========================================
      // RESUME
      // ========================================

      const savedResume =
        localStorage.getItem(
          `careerAIResume_${userId}`
        );

      if (savedResume) {

        setResume(
          JSON.parse(savedResume)
        );

      }


      // ========================================
      // ROUND 1
      // ========================================

      const savedRound1 =
        localStorage.getItem(
          `careerAIRound1_${userId}`
        );

      if (savedRound1) {

        setRound1(
          JSON.parse(savedRound1)
        );

      }


      // ========================================
      // ROUND 2
      // ========================================

      const savedRound2 =
        localStorage.getItem(
          `careerAIAssessmentCoding_${userId}`
        );

      if (savedRound2) {

        setRound2(
          JSON.parse(savedRound2)
        );

      }


      // ========================================
      // ROUND 3
      // ========================================

      const savedRound3 =
        localStorage.getItem(
          `careerAIRound3_${userId}`
        );

      if (savedRound3) {

        setRound3(
          JSON.parse(savedRound3)
        );

      }


      setLoading(false);

    } catch (error) {

      console.error(
        "Unable to load interview data:",
        error
      );

      setError(
        "Unable to load your interview data."
      );

      setLoading(false);

    }

  }, [navigate]);


  // ========================================
  // START INTERVIEW
  // ========================================

  const startInterview = async () => {

    setError("");

    setSubmitting(true);


    try {

      const userId =
        user?._id ||
        user?.id ||
        user?.email;


      if (!userId) {

        throw new Error(
          "User ID not found."
        );

      }


      if (!resume) {

        throw new Error(
          "Resume not found. Please upload your resume first."
        );

      }


      const response =
        await fetch(
          "http://localhost:5000/api/ai-hr/start",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              userId,

              resume,

              round1,

              round2,

              round3

            })

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


      setQuestion(
        data.question || ""
      );


    } catch (error) {

      console.error(
        "AI HR START ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to connect to AI HR."
      );

    } finally {

      setSubmitting(false);

    }

  };


  // ========================================
  // SUBMIT ANSWER
  // ========================================

  const handleSubmitAnswer = () => {

    if (!answer.trim()) {

      setError(
        "Please enter your answer."
      );

      return;

    }


    /*
    ========================================
    TEMPORARY
    ========================================

    We will connect this to the AI
    evaluation endpoint next.
    */

    alert(
      "Answer received. AI evaluation will be connected in the next step."
    );

  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="login-page">

        <div className="login-card">

          <h1>
            Preparing AI HR Interview
          </h1>

          <p>
            Loading your resume and
            previous round performance...
          </p>

        </div>

      </div>

    );

  }


  // ========================================
  // PAGE
  // ========================================

  return (

    <div className="login-page">

      <div className="login-card">


        {/* ========================================
            HEADER
        ======================================== */}

        <div className="login-header">

          <p className="dashboard-label">
            FINAL ROUND
          </p>

          <h1>
            AI HR Interview
          </h1>

          <p>
            This interview is personalized
            using your resume and previous
            round performance.
          </p>

        </div>


        {/* ========================================
            CANDIDATE
        ======================================== */}

        <div
          style={{
            marginBottom: "25px"
          }}
        >

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


        {/* ========================================
            RESUME
        ======================================== */}

        <div
          style={{
            marginBottom: "25px"
          }}
        >

          <h2>
            Resume
          </h2>

          <p>

            {resume
              ? resume.fileName ||
                resume.originalName ||
                "Resume uploaded"
              : "No resume found"}

          </p>

        </div>


        {/* ========================================
            PERFORMANCE
        ======================================== */}

        <div
          style={{
            marginBottom: "25px"
          }}
        >

          <h2>
            Previous Performance
          </h2>


          <p>

            Aptitude:{" "}

            {round1?.percentage ??
              round1?.score ??
              0}%

          </p>


          <p>

            Coding:{" "}

            {round2?.percentage ??
              round2?.score ??
              0}%

          </p>


          <p>

            Group Discussion:{" "}

            {round3?.percentage ??
              round3?.score ??
              round3?.overall ??
              0}%

          </p>

        </div>


        {/* ========================================
            ERROR
        ======================================== */}

        {error && (

          <div
            style={{
              color: "red",
              marginBottom: "20px"
            }}
          >
            {error}
          </div>

        )}


        {/* ========================================
            START BUTTON
        ======================================== */}

        {!question && (

          <button
            type="button"
            onClick={
              startInterview
            }
            disabled={
              submitting ||
              !resume
            }
          >

            {submitting
              ? "Preparing AI Interview..."
              : "Start AI HR Interview"}

          </button>

        )}


        {/* ========================================
            AI QUESTION
        ======================================== */}

        {question && (

          <div
            style={{
              marginTop: "25px"
            }}
          >

            <h2>
              AI HR Question
            </h2>


            <div
              style={{
                padding: "20px",
                border:
                  "1px solid #ddd",
                borderRadius:
                  "10px",
                marginBottom:
                  "20px"
              }}
            >

              <p>
                {question}
              </p>

            </div>


            <textarea
              value={answer}
              onChange={(event) =>
                setAnswer(
                  event.target.value
                )
              }
              placeholder="Type your answer here..."
              rows="6"
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                boxSizing: "border-box"
              }}
            />


            <button
              type="button"
              onClick={
                handleSubmitAnswer
              }
              disabled={
                !answer.trim()
              }
            >
              Submit Answer
            </button>

          </div>

        )}

      </div>

    </div>

  );

}

export default AIHRInterviewStart;