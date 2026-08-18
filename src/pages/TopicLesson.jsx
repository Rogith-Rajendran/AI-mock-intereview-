import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";

function TopicLesson() {
  const navigate = useNavigate();

  const topicData =
    localStorage.getItem("selectedLearningTopic");

  const selectedTopic = topicData
    ? JSON.parse(topicData)
    : {
        technology: "JavaScript",
        topic: "Introduction"
      };

  const topics = [
    "Introduction",
    "Variables",
    "Data Types",
    "Operators",
    "Conditional Statements",
    "Loops",
    "Functions",
    "Arrays",
    "Objects",
    "DOM"
  ];

  const [showAnswer, setShowAnswer] = useState("");

  const handleTopic = (topic) => {
    localStorage.setItem(
      "selectedLearningTopic",
      JSON.stringify({
        technology: "JavaScript",
        topic: topic
      })
    );

    setShowAnswer("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    navigate("/jobs/learn/topic");
  };

  const handleNextTopic = () => {
    const currentIndex =
      topics.indexOf(selectedTopic.topic);

    const nextTopic =
      topics[currentIndex + 1];

    if (nextTopic) {
      handleTopic(nextTopic);
    }
  };

  return (
    <div className="lesson-page">

      {/* =========================
          LEFT SIDEBAR
      ========================= */}

      <aside className="lesson-sidebar">

        <h2>
          JavaScript
        </h2>

        {topics.map((topic) => (

          <button
            key={topic}
            className={
              selectedTopic.topic === topic
                ? "lesson-side-item active"
                : "lesson-side-item"
            }
            onClick={() => handleTopic(topic)}
          >
            {topic}
          </button>

        ))}

      </aside>


      {/* =========================
          MAIN LESSON
      ========================= */}

      <main className="lesson-content">

        {/* BREADCRUMB */}

        <div className="lesson-breadcrumb">

          {selectedTopic.technology}

          &nbsp; / &nbsp;

          {selectedTopic.topic}

        </div>


        {/* TITLE */}

        <h1>
          JavaScript {selectedTopic.topic}
        </h1>


        {/* =========================
            INTRODUCTION
        ========================= */}

        {selectedTopic.topic === "Introduction" && (

          <>

            <p className="lesson-intro">

              JavaScript is a programming language used to
              create interactive and dynamic web applications.
              It is one of the most important technologies
              for modern web development.

            </p>


            <section className="lesson-section">

              <h2>
                What is JavaScript?
              </h2>

              <p>
                JavaScript is a high-level programming language
                used to add logic and interactivity to websites.
              </p>

              <p>
                HTML provides the structure of a webpage,
                CSS provides styling, and JavaScript provides
                behaviour and functionality.
              </p>

            </section>


            <section className="lesson-section">

              <h2>
                Simple Example
              </h2>

              <p>
                Try writing JavaScript code in the editor below.
              </p>

              <CodeEditor />

            </section>


            <section className="lesson-section">

              <h2>
                Why Learn JavaScript?
              </h2>

              <ul className="lesson-list">

                <li>
                  Used to create interactive websites.
                </li>

                <li>
                  Used with React for frontend development.
                </li>

                <li>
                  Used with Node.js for backend development.
                </li>

                <li>
                  Important skill for full stack developers.
                </li>

                <li>
                  Widely used in modern software development.
                </li>

              </ul>

            </section>

          </>

        )}


        {/* =========================
            VARIABLES
        ========================= */}

        {selectedTopic.topic === "Variables" && (

          <>

            <p className="lesson-intro">

              Variables are used to store data values
              that can be used later in a program.

            </p>


            <section className="lesson-section">

              <h2>
                What is a Variable?
              </h2>

              <p>
                A variable is a named container used to
                store information in a program.
              </p>

              <p>
                JavaScript provides three main keywords
                for declaring variables:
              </p>

              <ul className="lesson-list">

                <li>
                  var
                </li>

                <li>
                  let
                </li>

                <li>
                  const
                </li>

              </ul>

            </section>


            <section className="lesson-section">

              <h2>
                Example
              </h2>

              <CodeEditor />

            </section>


            <section className="lesson-section">

              <h2>
                let vs const
              </h2>

              <p>
                Use <strong>let</strong> when the value
                may change later.
              </p>

              <p>
                Use <strong>const</strong> when the variable
                should not be reassigned.
              </p>

            </section>

          </>

        )}


        {/* =========================
            DATA TYPES
        ========================= */}

        {selectedTopic.topic === "Data Types" && (

          <>

            <p className="lesson-intro">

              A data type describes the kind of value
              stored inside a JavaScript variable.

            </p>


            <section className="lesson-section">

              <h2>
                Common JavaScript Data Types
              </h2>

              <ul className="lesson-list">

                <li>
                  String
                </li>

                <li>
                  Number
                </li>

                <li>
                  Boolean
                </li>

                <li>
                  Undefined
                </li>

                <li>
                  Null
                </li>

                <li>
                  Object
                </li>

              </ul>

            </section>


            <section className="lesson-section">

              <h2>
                Example
              </h2>

              <CodeEditor />

            </section>

          </>

        )}


        {/* =========================
            OTHER TOPICS
        ========================= */}

        {selectedTopic.topic !== "Introduction" &&
          selectedTopic.topic !== "Variables" &&
          selectedTopic.topic !== "Data Types" && (

          <>

            <p className="lesson-intro">

              This topic is part of the JavaScript
              learning path.

            </p>


            <section className="lesson-section">

              <h2>
                {selectedTopic.topic}
              </h2>

              <p>
                We will provide detailed explanations,
                examples, coding exercises and interview
                questions for this topic.
              </p>

              <p>
                This section will gradually be expanded
                as we build the complete CareerAI
                learning platform.
              </p>

            </section>

          </>

        )}


        {/* =========================
            QUICK PRACTICE
        ========================= */}

        <section className="practice-section">

          <p className="practice-label">
            QUICK PRACTICE
          </p>

          <h2>
            Which keyword can be used to
            declare a JavaScript variable?
          </h2>


          <div className="practice-options">

            <button
              onClick={() => setShowAnswer("wrong")}
            >
              Python
            </button>


            <button
              onClick={() => setShowAnswer("correct")}
            >
              let
            </button>


            <button
              onClick={() => setShowAnswer("wrong")}
            >
              HTML
            </button>


            <button
              onClick={() => setShowAnswer("wrong")}
            >
              SQL
            </button>

          </div>


          {showAnswer === "correct" && (

            <div className="correct-message">

              Correct!

              <br />

              <strong>
                let
              </strong>

              {" "}is a JavaScript keyword used
              to declare a variable.

            </div>

          )}


          {showAnswer === "wrong" && (

            <div className="wrong-message">

              That's not correct.

              <br />

              Try again.

            </div>

          )}

        </section>


        {/* =========================
            LESSON NAVIGATION
        ========================= */}

        <div className="lesson-navigation">

          <button
            onClick={() =>
              navigate("/jobs/skills")
            }
          >
            ← All Topics
          </button>


          <button
            onClick={handleNextTopic}
          >
            Next Topic →
          </button>

        </div>

      </main>

    </div>
  );
}

export default TopicLesson;