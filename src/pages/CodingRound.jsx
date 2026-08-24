import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

function CodingRound() {
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [selectedLanguage, setSelectedLanguage] =
    useState("python");

  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [solvedProblems, setSolvedProblems] =
    useState([]);

  const [timeLeft, setTimeLeft] =
    useState(30 * 60);


  /*
  ========================================
  GET CURRENT USER
  ========================================
  */

  const getCurrentUserId = () => {
    const userData =
      localStorage.getItem("careerAIUser");

    if (!userData) {
      return null;
    }

    try {
      const user =
        JSON.parse(userData);

      return (
        user?._id ||
        user?.id ||
        user?.email ||
        null
      );

    } catch (error) {

      console.error(
        "Unable to read current user:",
        error
      );

      return null;
    }
  };


  /*
  ========================================
  USER-SPECIFIC CODING STORAGE KEY
  ========================================
  */

  const getCodingStorageKey = () => {
    const userId =
      getCurrentUserId();

    if (!userId) {
      return null;
    }

    return `careerAIAssessmentCoding_${userId}`;
  };


  /*
  ========================================
  LOAD SELECTED JOB ROLE
  ========================================
  */

  useEffect(() => {

    const savedRole =
      localStorage.getItem(
        "selectedJobRole"
      );

    if (savedRole) {

      try {

        setRole(
          JSON.parse(savedRole)
        );

      } catch (err) {

        console.error(
          "Unable to read selected job role:",
          err
        );

      }

    }

  }, []);


  /*
  ========================================
  NORMALIZE LANGUAGE
  ========================================
  */

  const normalizeLanguage = (
    language
  ) => {

    const value =
      String(
        language || ""
      )
        .toLowerCase()
        .trim();

    if (
      value === "js" ||
      value === "javascript"
    ) {
      return "javascript";
    }

    if (
      value === "py" ||
      value === "python" ||
      value === "python3"
    ) {
      return "python";
    }

    if (value === "java") {
      return "java";
    }

    if (value === "sql") {
      return "sql";
    }

    return value;
  };


  /*
  ========================================
  STARTER CODE
  ========================================
  */

  const getStarterCode = (
    problem
  ) => {

    if (!problem) {
      return "";
    }

    if (problem.starterCode) {
      return problem.starterCode;
    }

    const language =
      normalizeLanguage(
        problem.language
      );


    if (language === "python") {

      return `# Write your solution here

def solution():
    pass
`;
    }


    if (language === "javascript") {

      return `// Write your solution here

function solution() {

}

console.log(solution());
`;
    }


    if (language === "java") {

      return `public class Main {

    public static void main(String[] args) {

        // Write your solution here

    }
}
`;
    }


    if (language === "sql") {

      return `-- Write your SQL query here

SELECT * FROM employees;
`;
    }


    return "";
  };


  /*
  ========================================
  LOAD PROBLEMS
  ========================================
  */

  const loadProblems = async (
    language = selectedLanguage
  ) => {

    try {

      setLoading(true);
      setError("");
      setResult(null);


      const response =
        await fetch(
          `${API_URL}/api/code/problems?language=${language}`
        );


      if (!response.ok) {

        throw new Error(
          "Unable to load coding problems."
        );

      }


      const data =
        await response.json();


      if (!data.success) {

        throw new Error(
          data.message ||
          "Backend returned an error."
        );

      }


      const loadedProblems =
        Array.isArray(
          data.problems
        )
          ? data.problems
          : [];


      if (
        loadedProblems.length === 0
      ) {

        throw new Error(
          `No ${language} coding problems are available.`
        );

      }


      const assessmentProblems =
        loadedProblems.slice(0, 2);


      setProblems(
        assessmentProblems
      );


      setCurrentIndex(0);


      setCode(
        getStarterCode(
          assessmentProblems[0]
        )
      );

    } catch (err) {

      console.error(
        "Coding problem loading error:",
        err
      );


      setProblems([]);


      setError(
        err.message ||
        "Unable to load coding problems."
      );

    } finally {

      setLoading(false);

    }

  };


  /*
  ========================================
  INITIAL LOAD
  ========================================
  */

  useEffect(() => {

    loadProblems("python");

  }, []);


  /*
  ========================================
  LOAD USER-SPECIFIC SAVED PROGRESS
  ========================================
  */

  useEffect(() => {

    const storageKey =
      getCodingStorageKey();

    if (!storageKey) {
      return;
    }


    const saved =
      localStorage.getItem(
        storageKey
      );


    if (!saved) {
      return;
    }


    try {

      const data =
        JSON.parse(saved);


      if (
        Array.isArray(
          data.solvedProblems
        )
      ) {

        setSolvedProblems(
          data.solvedProblems
        );

      }

    } catch (err) {

      console.error(
        "Unable to load coding progress:",
        err
      );

    }

  }, []);


  /*
  ========================================
  CURRENT PROBLEM
  ========================================
  */

  const currentProblem =
    problems[currentIndex];


  /*
  ========================================
  CHANGE LANGUAGE
  ========================================
  */

  const handleLanguageChange = (
    event
  ) => {

    const language =
      event.target.value;


    setSelectedLanguage(
      language
    );


    loadProblems(
      language
    );

  };


  /*
  ========================================
  SUBMIT CODE
  ========================================
  */

  const handleSubmit = async () => {

    if (!currentProblem) {
      return;
    }


    if (!code.trim()) {

      setError(
        "Please write your solution before submitting."
      );

      return;
    }


    try {

      setSubmitting(true);
      setError("");
      setResult(null);


      const problemLanguage =
        normalizeLanguage(
          currentProblem.language
        );


      const response =
        await fetch(
          `${API_URL}/api/code/submit`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              problemId:
                currentProblem.id,

              language:
                problemLanguage,

              code

            })
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Code submission failed."
        );

      }


      const passed =
        data.execution?.passed ===
        true;


      if (!passed) {

        setResult({

          success: false,

          message:
            data.execution?.message ||
            data.message ||
            "The solution was not accepted."

        });

        return;
      }


      setResult({

        success: true,

        message:
          data.execution?.message ||
          data.message ||
          "All test cases passed."

      });


      /*
      ========================================
      SAVE SOLVED PROBLEM
      ========================================
      */

      setSolvedProblems(
        previous => {

          const id =
            String(
              currentProblem.id
            );


          if (
            previous.includes(id)
          ) {

            return previous;

          }


          const updated = [
            ...previous,
            id
          ];


          const percentage =
            Math.round(
              (updated.length / 2) *
              100
            );


          const storageKey =
            getCodingStorageKey();


          if (storageKey) {

            localStorage.setItem(

              storageKey,

              JSON.stringify({

                role:
                  role?.title ||
                  "Selected Job Role",

                solvedProblems:
                  updated,

                solved:
                  updated.length,

                totalQuestions:
                  2,

                percentage,

                score:
                  percentage,

                completed:
                  updated.length >= 2

              })

            );

          }


          return updated;

        }
      );


    } catch (err) {

      console.error(
        "Code submission error:",
        err
      );


      setError(
        err.message ||
        "Unable to submit code."
      );

    } finally {

      setSubmitting(false);

    }

  };


  /*
  ========================================
  FINISH CODING ROUND
  ========================================
  */

  const finishCodingRound = () => {

    const solved =
      solvedProblems.length;


    const percentage =
      Math.round(
        (solved / 2) *
        100
      );


    const storageKey =
      getCodingStorageKey();


    if (storageKey) {

      localStorage.setItem(

        storageKey,

        JSON.stringify({

          role:
            role?.title ||
            "Selected Job Role",

          solved,

          totalQuestions:
            2,

          percentage,

          score:
            percentage,

          completed:
            solved >= 2

        })

      );

    }


    /*
    ========================================
    GO TO ROUND 3
    ========================================
    */

    navigate(
      "/jobs/assessment/round-3"
    );

  };


  /*
  ========================================
  NEXT PROBLEM
  ========================================
  */

  const handleNext = () => {

    if (!result?.success) {

      setError(
        "Submit and pass the current problem before continuing."
      );

      return;

    }


    if (
      currentIndex <
      problems.length - 1
    ) {

      const nextIndex =
        currentIndex + 1;


      setCurrentIndex(
        nextIndex
      );


      setCode(
        getStarterCode(
          problems[nextIndex]
        )
      );


      setResult(null);
      setError("");


      window.scrollTo({

        top: 0,

        behavior: "smooth"

      });


      return;

    }


    finishCodingRound();

  };


  /*
  ========================================
  TIMER
  ========================================
  */

  useEffect(() => {

    if (loading) {
      return;
    }


    if (timeLeft <= 0) {

      finishCodingRound();

      return;

    }


    const timer =
      setInterval(() => {

        setTimeLeft(
          previous =>
            previous - 1
        );

      }, 1000);


    return () =>
      clearInterval(timer);

  }, [
    loading,
    timeLeft
  ]);


  /*
  ========================================
  FORMAT TIME
  ========================================
  */

  const formatTime = (
    seconds
  ) => {

    const minutes =
      Math.floor(
        seconds / 60
      );


    const remaining =
      seconds % 60;


    return `${String(
      minutes
    ).padStart(
      2,
      "0"
    )}:${String(
      remaining
    ).padStart(
      2,
      "0"
    )}`;

  };


  /*
  ========================================
  LOADING
  ========================================
  */

  if (loading) {

    return (

      <div style={styles.page}>

        <div style={styles.centerCard}>

          <p style={styles.label}>
            ROUND 2
          </p>

          <h1>
            Coding Round
          </h1>

          <p>
            Preparing your coding assessment...
          </p>

        </div>

      </div>

    );

  }


  /*
  ========================================
  ERROR
  ========================================
  */

  if (
    error &&
    problems.length === 0
  ) {

    return (

      <div style={styles.page}>

        <div style={styles.centerCard}>

          <p style={styles.label}>
            ROUND 2
          </p>

          <h1>
            Coding Round
          </h1>


          <div style={styles.errorBox}>
            {error}
          </div>


          <button
            style={styles.secondaryButton}
            onClick={() =>
              loadProblems(
                selectedLanguage
              )
            }
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  /*
  ========================================
  MAIN SCREEN
  ========================================
  */

  return (

    <div style={styles.page}>

      <div style={styles.container}>

        {/* HEADER */}

        <div style={styles.header}>

          <div>

            <p style={styles.label}>
              ROUND 2
            </p>

            <h1 style={styles.title}>
              Coding Round
            </h1>

            <p style={styles.subtitle}>

              {role?.title
                ? `${role.title} placement assessment`
                : "Technical coding assessment"}

            </p>

          </div>


          <div style={styles.timer}>

            {formatTime(
              timeLeft
            )}

          </div>

        </div>


        {/* PROGRESS */}

        <div style={styles.progressCard}>

          <strong>

            Problem{" "}
            {currentIndex + 1}
            {" / "}
            {problems.length}

          </strong>


          <span>

            Solved:{" "}
            {solvedProblems.length}
            {" / 2"}

          </span>

        </div>


        {/* LANGUAGE */}

        <div style={styles.languageCard}>

          <div>

            <strong>
              Programming Language
            </strong>

            <p style={styles.smallText}>

              The selected language must
              match the coding problem.

            </p>

          </div>


          <select
            value={
              normalizeLanguage(
                currentProblem?.language ||
                selectedLanguage
              )
            }
            onChange={
              handleLanguageChange
            }
            style={styles.select}
          >

            <option value="python">
              Python
            </option>

            <option value="javascript">
              JavaScript
            </option>

            <option value="java">
              Java
            </option>

            <option value="sql">
              SQL
            </option>

          </select>

        </div>


        {/* PROBLEM */}

        {currentProblem && (

          <div style={styles.card}>

            <div style={styles.problemHeader}>

              <div>

                <p style={styles.label}>
                  CODING PROBLEM
                </p>

                <h2 style={styles.problemTitle}>

                  {currentProblem.title ||
                    "Coding Problem"}

                </h2>

              </div>


              <span
                style={
                  styles.languageBadge
                }
              >

                {String(
                  currentProblem.language ||
                  selectedLanguage
                ).toUpperCase()}

              </span>

            </div>


            {/* DESCRIPTION */}

            <div style={styles.description}>

              <h3>
                Problem Statement
              </h3>

              <p>

                {currentProblem.description ||
                  currentProblem.question ||
                  "Solve the given programming problem."}

              </p>

            </div>


            {/* INPUT */}

            {currentProblem.input && (

              <div style={styles.exampleBox}>

                <strong>
                  Input
                </strong>

                <pre>
                  {currentProblem.input}
                </pre>

              </div>

            )}


            {/* OUTPUT */}

            {currentProblem.output && (

              <div style={styles.exampleBox}>

                <strong>
                  Expected Output
                </strong>

                <pre>
                  {currentProblem.output}
                </pre>

              </div>

            )}


            {/* EDITOR */}

            <div style={styles.editorSection}>

              <div style={styles.editorHeader}>

                <h3>
                  Write Your Solution
                </h3>

                <span>

                  {String(
                    currentProblem.language ||
                    selectedLanguage
                  )}

                </span>

              </div>


              <textarea
                value={code}
                onChange={event =>
                  setCode(
                    event.target.value
                  )
                }
                spellCheck="false"
                style={styles.editor}
              />


              {/* ERROR */}

              {error && (

                <div style={styles.errorBox}>
                  {error}
                </div>

              )}


              {/* RESULT */}

              {result && (

                <div
                  style={
                    result.success
                      ? styles.successBox
                      : styles.errorBox
                  }
                >

                  <strong>

                    {result.success
                      ? "Accepted"
                      : "Not Accepted"}

                  </strong>

                  <p>
                    {result.message}
                  </p>

                </div>

              )}


              {/* BUTTONS */}

              <div style={styles.actions}>

                <button
                  style={
                    submitting
                      ? styles.disabledButton
                      : styles.primaryButton
                  }
                  onClick={
                    handleSubmit
                  }
                  disabled={
                    submitting
                  }
                >

                  {submitting
                    ? "Checking..."
                    : "Submit Solution"}

                </button>


                {result?.success && (

                  <button
                    style={
                      styles.secondaryButton
                    }
                    onClick={
                      handleNext
                    }
                  >

                    {currentIndex <
                    problems.length - 1
                      ? "Next Problem →"
                      : "Finish Coding Round →"}

                  </button>

                )}

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}


/*
========================================
STYLES
========================================
*/

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "40px 20px",
    fontFamily:
      "Arial, sans-serif",
    color: "#111827"
  },


  container: {
    width: "100%",
    maxWidth: "1050px",
    margin: "0 auto"
  },


  centerCard: {
    maxWidth: "700px",
    margin: "100px auto",
    padding: "50px",
    background: "white",
    borderRadius: "18px",
    border:
      "1px solid #e2e8f0",
    textAlign: "center"
  },


  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "25px"
  },


  label: {
    margin: 0,
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "1.5px"
  },


  title: {
    margin:
      "8px 0 5px",
    fontSize: "42px"
  },


  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "16px"
  },


  timer: {
    minWidth: "120px",
    padding: "15px 20px",
    background: "#111827",
    color: "white",
    borderRadius: "12px",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "700",
    fontFamily:
      "monospace"
  },


  progressCard: {
    display: "flex",
    justifyContent:
      "space-between",
    padding: "18px 22px",
    background: "white",
    border:
      "1px solid #e2e8f0",
    borderRadius: "12px",
    marginBottom: "18px"
  },


  languageCard: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "20px 22px",
    background: "white",
    border:
      "1px solid #e2e8f0",
    borderRadius: "12px",
    marginBottom: "20px"
  },


  smallText: {
    margin:
      "6px 0 0",
    color: "#64748b",
    fontSize: "14px"
  },


  select: {
    padding:
      "12px 16px",
    minWidth: "180px",
    border:
      "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "white",
    fontSize: "15px"
  },


  card: {
    background: "white",
    border:
      "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "30px"
  },


  problemHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "25px"
  },


  problemTitle: {
    margin:
      "8px 0 0",
    fontSize: "28px"
  },


  languageBadge: {
    padding:
      "8px 12px",
    background: "#eff6ff",
    color: "#2563eb",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700"
  },


  description: {
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "12px",
    marginBottom: "18px",
    lineHeight: "1.7"
  },


  exampleBox: {
    padding: "18px",
    background: "#f8fafc",
    borderRadius: "10px",
    marginBottom: "15px"
  },


  editorSection: {
    marginTop: "25px"
  },


  editorHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },


  editor: {
    width: "100%",
    minHeight: "400px",
    boxSizing: "border-box",
    padding: "20px",
    background: "#0f172a",
    color: "#e5e7eb",
    border: "none",
    borderRadius: "12px",
    resize: "vertical",
    fontFamily:
      "Consolas, Monaco, monospace",
    fontSize: "15px",
    lineHeight: "1.6",
    outline: "none"
  },


  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "18px"
  },


  primaryButton: {
    padding:
      "13px 22px",
    border: "none",
    borderRadius: "9px",
    background: "#2563eb",
    color: "white",
    fontWeight: "700",
    cursor: "pointer"
  },


  secondaryButton: {
    padding:
      "13px 22px",
    border:
      "1px solid #cbd5e1",
    borderRadius: "9px",
    background: "white",
    color: "#111827",
    fontWeight: "700",
    cursor: "pointer"
  },


  disabledButton: {
    padding:
      "13px 22px",
    border: "none",
    borderRadius: "9px",
    background: "#94a3b8",
    color: "white",
    fontWeight: "700",
    cursor: "not-allowed"
  },


  successBox: {
    marginTop: "15px",
    padding: "16px",
    background: "#ecfdf5",
    color: "#166534",
    border:
      "1px solid #bbf7d0",
    borderRadius: "10px"
  },


  errorBox: {
    marginTop: "15px",
    padding: "16px",
    background: "#fef2f2",
    color: "#991b1b",
    border:
      "1px solid #fecaca",
    borderRadius: "10px"
  }

};


export default CodingRound;