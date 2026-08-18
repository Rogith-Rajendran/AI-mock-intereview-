import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CodingProblems() {

  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] =
    useState("JavaScript");

  const [problems, setProblems] =
    useState([]);

  const [selectedProblem, setSelectedProblem] =
    useState(null);

  const [code, setCode] =
    useState("");

  const [output, setOutput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [running, setRunning] =
    useState(false);


  /*
  ========================================
  PROGRAMMING LANGUAGES
  ========================================
  */

  const languages = [

    {
      name: "JavaScript",
      icon: "JS",
      description:
        "Practice JavaScript programming"
    },

    {
      name: "Python",
      icon: "PY",
      description:
        "Practice Python programming"
    },

    {
      name: "Java",
      icon: "JAVA",
      description:
        "Practice Java programming"
    },

    {
      name: "SQL",
      icon: "SQL",
      description:
        "Practice SQL queries"
    }

  ];


  /*
  ========================================
  LOAD PROBLEMS
  ========================================
  */

  const fetchProblems = async (language) => {

    try {

      setLoading(true);
      setError("");
      setSelectedProblem(null);
      setCode("");
      setOutput("");

      const backendLanguage =
        language.toLowerCase();

      const response = await fetch(
        `http://localhost:5000/api/code/problems?language=${backendLanguage}`
      );

      if (!response.ok) {

        throw new Error(
          "Unable to load problems"
        );

      }

      const data =
        await response.json();

      if (!data.success) {

        throw new Error(
          "Backend returned an error"
        );

      }

      setProblems(
        data.problems || []
      );

    }

    catch (err) {

      console.error(
        "Problem loading error:",
        err
      );

      setProblems([]);

      setError(
        "Unable to load coding problems. Please make sure the backend is running."
      );

    }

    finally {

      setLoading(false);

    }

  };


  /*
  ========================================
  LOAD JAVASCRIPT
  ========================================
  */

  useEffect(() => {

    fetchProblems("JavaScript");

  }, []);


  /*
  ========================================
  CHANGE LANGUAGE
  ========================================
  */

  const handleLanguageChange =
    (language) => {

      setSelectedLanguage(language);

      fetchProblems(language);

    };


  /*
  ========================================
  SELECT PROBLEM
  ========================================
  */

  const handleProblemSelect =
    (problem) => {

      setSelectedProblem(problem);

      setCode("");
      setOutput("");

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    };


  /*
  ========================================
  START CODING
  ========================================
  */

  const handleStartCoding = () => {

    if (!selectedProblem) {
      return;
    }


    if (
      selectedLanguage ===
      "JavaScript"
    ) {

      setCode(
`// Write your JavaScript solution here

function solution() {

  // Your code here

}

console.log(solution());`
      );

    }

    else if (
      selectedLanguage ===
      "Python"
    ) {

      setCode(
`# Write your Python solution here

def solution():

    # Your code here

    pass


print(solution())`
      );

    }

    else if (
      selectedLanguage ===
      "Java"
    ) {

      setCode(
`// Write your Java solution here

public class Main {

    public static void main(String[] args) {

        // Your code here

    }

}`
      );

    }

    else if (
      selectedLanguage ===
      "SQL"
    ) {

      setCode(
`-- Write your SQL query here

SELECT *
FROM employees;`
      );

    }

    setOutput("");

    setTimeout(() => {

      const editor =
        document.getElementById(
          "coding-editor"
        );

      if (editor) {

        editor.scrollIntoView({
          behavior: "smooth"
        });

      }

    }, 100);

  };


  /*
  ========================================
  RUN CODE
  ========================================
  */

  const handleRunCode = async () => {

    if (!selectedProblem) {

      setOutput(
        "Please select a problem first."
      );

      return;

    }


    if (!code.trim()) {

      setOutput(
        "Please write some code first."
      );

      return;

    }


    try {

      setRunning(true);

      setOutput(
        "Submitting your code..."
      );


      /*
      ----------------------------------------
      SEND CODE TO BACKEND
      ----------------------------------------
      */

      const response = await fetch(
        "http://localhost:5000/api/code/submit",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            problemId:
              selectedProblem.id,

            language:
              selectedLanguage.toLowerCase(),

            code:
              code

          })

        }
      );


      /*
      ----------------------------------------
      READ BACKEND RESPONSE
      ----------------------------------------
      */

      const data =
        await response.json();


      /*
      ----------------------------------------
      ERROR
      ----------------------------------------
      */

      if (!response.ok) {

        setOutput(
          data.message ||
          "Submission failed."
        );

        return;

      }


      /*
      ----------------------------------------
      SUCCESS
      ----------------------------------------
      */

      if (data.success) {

        setOutput(
          data.message +
          "\n\nExecution status: " +
          data.execution.status
        );

      }

      else {

        setOutput(
          "Submission failed."
        );

      }

    }

    catch (err) {

      console.error(
        "Submission error:",
        err
      );

      setOutput(
        "Unable to connect to the backend. Make sure the backend is running."
      );

    }

    finally {

      setRunning(false);

    }

  };


  /*
  ========================================
  CLEAR CODE
  ========================================
  */

  const handleClearCode = () => {

    setCode("");

    setOutput("");

  };


  /*
  ========================================
  BACK TO PROBLEMS
  ========================================
  */

  const handleBackToProblems = () => {

    setSelectedProblem(null);

    setCode("");

    setOutput("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  /*
  ========================================
  BACK TO JOBS
  ========================================
  */

  const handleBackToJobs = () => {

    navigate("/jobs");

  };


  /*
  ========================================
  PAGE
  ========================================
  */

  return (

    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif"
      }}
    >

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
            alignItems: "center"
          }}
        >

          <div>

            <p
              style={{
                margin: 0,
                color: "#2563eb",
                fontWeight: "bold"
              }}
            >
              CODING PRACTICE
            </p>

            <h1>
              Practice & Apply Your Skills
            </h1>

            <p
              style={{
                color: "#64748b"
              }}
            >
              Learn concepts and apply them
              through practical coding problems.
            </p>

          </div>


          <button
            onClick={handleBackToJobs}
            style={{
              padding: "11px 18px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              background: "white",
              cursor: "pointer"
            }}
          >
            ← Back to Jobs
          </button>

        </div>

      </div>


      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >

        {/* ==================================
            LANGUAGES
        ================================== */}

        <h2>
          Choose Your Language
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px",
            marginBottom: "40px"
          }}
        >

          {languages.map(
            (language) => (

              <button
                key={language.name}
                onClick={() =>
                  handleLanguageChange(
                    language.name
                  )
                }
                style={{
                  padding: "20px",
                  textAlign: "left",
                  border:
                    selectedLanguage ===
                    language.name
                      ? "2px solid #2563eb"
                      : "1px solid #ddd",
                  borderRadius: "12px",
                  background:
                    selectedLanguage ===
                    language.name
                      ? "#eff6ff"
                      : "white",
                  cursor: "pointer"
                }}
              >

                <strong>
                  {language.icon}
                </strong>

                <h3>
                  {language.name}
                </h3>

                <p
                  style={{
                    color: "#64748b"
                  }}
                >
                  {language.description}
                </p>

              </button>

            )
          )}

        </div>


        {/* ==================================
            PROBLEM COUNT
        ================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >

          <h2>
            {selectedLanguage} Problems
          </h2>

          <span>
            {problems.length} Problems
          </span>

        </div>


        {/* ==================================
            LOADING
        ================================== */}

        {loading && (

          <p>
            Loading problems...
          </p>

        )}


        {/* ==================================
            ERROR
        ================================== */}

        {error && (

          <div
            style={{
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
            PROBLEM LIST
        ================================== */}

        {!loading &&
          !error &&
          !selectedProblem && (

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px"
              }}
            >

              {problems.map(
                (problem) => (

                  <div
                    key={problem.id}
                    style={{
                      padding: "25px",
                      background: "white",
                      border:
                        "1px solid #ddd",
                      borderRadius: "12px"
                    }}
                  >

                    <h3>
                      {problem.title}
                    </h3>

                    <p>
                      Topic: {problem.topic}
                    </p>

                    <p>
                      {problem.description}
                    </p>

                    <button
                      onClick={() =>
                        handleProblemSelect(
                          problem
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "none",
                        borderRadius: "8px",
                        background:
                          "#2563eb",
                        color: "white",
                        cursor: "pointer"
                      }}
                    >
                      View Problem
                    </button>

                  </div>

                )
              )}

            </div>

          )}


        {/* ==================================
            SELECTED PROBLEM
        ================================== */}

        {selectedProblem && (

          <div>

            <button
              onClick={
                handleBackToProblems
              }
              style={{
                marginBottom: "20px",
                padding: "10px 16px",
                cursor: "pointer"
              }}
            >
              ← All Problems
            </button>


            <div
              style={{
                padding: "30px",
                background: "white",
                borderRadius: "12px",
                marginBottom: "20px"
              }}
            >

              <h1>
                {selectedProblem.title}
              </h1>

              <p>
                Language:
                {" "}
                {selectedProblem.language}
              </p>

              <p>
                Difficulty:
                {" "}
                {selectedProblem.difficulty}
              </p>

              <p>
                Topic:
                {" "}
                {selectedProblem.topic}
              </p>

              <h3>
                Problem
              </h3>

              <p>
                {selectedProblem.description}
              </p>

              <h3>
                Input
              </h3>

              <pre>
                {selectedProblem.input}
              </pre>

              <h3>
                Expected Output
              </h3>

              <pre>
                {selectedProblem.expectedOutput}
              </pre>


              <button
                onClick={
                  handleStartCoding
                }
                style={{
                  padding: "12px 20px",
                  background:
                    "#111827",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Start Coding
              </button>

            </div>


            {/* ==================================
                CODE EDITOR
            ================================== */}

            {code !== "" && (

              <div
                id="coding-editor"
                style={{
                  padding: "25px",
                  background: "white",
                  borderRadius: "12px"
                }}
              >

                <h2>
                  Your Solution
                </h2>

                <p>
                  Language:
                  {" "}
                  {selectedLanguage}
                </p>


                <textarea
                  value={code}
                  onChange={(event) =>
                    setCode(
                      event.target.value
                    )
                  }
                  spellCheck="false"
                  style={{
                    width: "100%",
                    minHeight: "400px",
                    boxSizing: "border-box",
                    padding: "20px",
                    background: "#0f172a",
                    color: "#e2e8f0",
                    fontFamily:
                      "Consolas, monospace",
                    fontSize: "15px",
                    border: "none",
                    borderRadius: "10px",
                    resize: "vertical"
                  }}
                />


                {/* ==================================
                    BUTTONS
                ================================== */}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginTop: "15px"
                  }}
                >

                  <button
                    onClick={
                      handleClearCode
                    }
                    style={{
                      padding:
                        "10px 18px",
                      cursor:
                        "pointer"
                    }}
                  >
                    Clear
                  </button>


                  <button
                    onClick={
                      handleRunCode
                    }
                    disabled={running}
                    style={{
                      padding:
                        "10px 22px",
                      background:
                        running
                          ? "#94a3b8"
                          : "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius:
                        "8px",
                      cursor:
                        "pointer",
                      fontWeight:
                        "bold"
                    }}
                  >

                    {running
                      ? "Submitting..."
                      : "Run Code"}

                  </button>

                </div>


                {/* ==================================
                    OUTPUT
                ================================== */}

                <div
                  style={{
                    marginTop: "25px"
                  }}
                >

                  <h3>
                    Output
                  </h3>


                  <pre
                    style={{
                      minHeight: "70px",
                      padding: "15px",
                      background:
                        "#f1f5f9",
                      borderRadius:
                        "8px",
                      whiteSpace:
                        "pre-wrap"
                    }}
                  >
                    {output ||
                      "Run your code to see the result here."}
                  </pre>

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );

}

export default CodingProblems;