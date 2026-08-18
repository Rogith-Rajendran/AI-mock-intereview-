import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LearnSkills() {
  const navigate = useNavigate();

  const [selectedTechnology, setSelectedTechnology] =
    useState("JavaScript");

  const technologies = [
    "HTML & CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "REST APIs",
    "Git & GitHub"
  ];

  const topics = {
    "HTML & CSS": [
      "HTML Introduction",
      "HTML Elements",
      "HTML Forms",
      "CSS Introduction",
      "CSS Selectors",
      "CSS Flexbox",
      "CSS Grid",
      "Responsive Design"
    ],

    "JavaScript": [
      "Introduction",
      "Variables",
      "Data Types",
      "Operators",
      "Conditional Statements",
      "Loops",
      "Functions",
      "Arrays",
      "Objects",
      "DOM",
      "Events",
      "ES6+"
    ],

    "React": [
      "React Introduction",
      "Components",
      "JSX",
      "Props",
      "State",
      "Events",
      "Hooks",
      "useState",
      "useEffect",
      "React Router"
    ],

    "Node.js": [
      "Node.js Introduction",
      "Installing Node.js",
      "Modules",
      "NPM",
      "File System",
      "HTTP Module",
      "Express Basics",
      "REST API"
    ],

    "Express.js": [
      "Express Introduction",
      "Creating a Server",
      "Routes",
      "Middleware",
      "Request & Response",
      "REST APIs",
      "Error Handling"
    ],

    "MongoDB": [
      "MongoDB Introduction",
      "Databases",
      "Collections",
      "Documents",
      "CRUD Operations",
      "Queries",
      "MongoDB with Node.js"
    ],

    "REST APIs": [
      "API Introduction",
      "HTTP Methods",
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "Status Codes",
      "JSON"
    ],

    "Git & GitHub": [
      "Git Introduction",
      "Git Installation",
      "Repositories",
      "git init",
      "git add",
      "git commit",
      "git push",
      "GitHub"
    ]
  };

  const handleTopic = (topic) => {
    localStorage.setItem(
      "selectedLearningTopic",
      JSON.stringify({
        technology: selectedTechnology,
        topic: topic
      })
    );

    navigate("/jobs/learn/topic");
  };

  return (
    <div className="learning-page">

      {/* TOP HEADER */}

      <div className="learning-header">

        <p className="section-label">
          LEARN SKILLS
        </p>

        <h1>
          Full Stack Development
        </h1>

        <p>
          Learn the technologies and concepts required
          to become a professional full stack developer.
        </p>

      </div>


      {/* MAIN LEARNING AREA */}

      <div className="learning-layout">

        {/* LEFT TECHNOLOGY SIDEBAR */}

        <aside className="technology-sidebar">

          <h2>
            Technologies
          </h2>

          {technologies.map((technology) => (

            <button
              key={technology}
              className={
                selectedTechnology === technology
                  ? "technology-button active"
                  : "technology-button"
              }
              onClick={() =>
                setSelectedTechnology(technology)
              }
            >
              {technology}
            </button>

          ))}

        </aside>


        {/* RIGHT CONTENT */}

        <main className="learning-content">

          <div className="technology-header">

            <p className="technology-label">
              CURRENT TECHNOLOGY
            </p>

            <h2>
              {selectedTechnology}
            </h2>

            <p>
              Learn {selectedTechnology} step by step,
              from fundamentals to practical development.
            </p>

          </div>


          <div className="topic-list">

            <h3>
              Topics
            </h3>

            {topics[selectedTechnology].map(
              (topic, index) => (

                <button
                  className="topic-item"
                  key={topic}
                  onClick={() =>
                    handleTopic(topic)
                  }
                >

                  <span className="topic-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="topic-name">
                    {topic}
                  </span>

                  <span className="topic-arrow">
                    →
                  </span>

                </button>

              )
            )}

          </div>

        </main>

      </div>

    </div>
  );
}

export default LearnSkills;