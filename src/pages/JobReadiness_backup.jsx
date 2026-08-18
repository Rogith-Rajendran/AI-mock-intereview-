import { useNavigate } from "react-router-dom";

function JobReadiness() {
  const navigate = useNavigate();

  const readiness = 72;

  const skills = [
    {
      name: "JavaScript",
      score: 82
    },
    {
      name: "React",
      score: 70
    },
    {
      name: "Node.js",
      score: 65
    },
    {
      name: "Database",
      score: 75
    }
  ];

  return (
    <div className="readiness-page">

      {/* HEADER */}

      <div className="readiness-header">

        <p className="section-label">
          JOB READINESS
        </p>

        <h1>
          Full Stack Developer
        </h1>

        <p>
          Your current preparation and job-readiness
          analysis.
        </p>

      </div>


      {/* MAIN SCORE */}

      <div className="readiness-main-card">

        <div className="readiness-score">

          <div className="score-circle">

            <span>
              {readiness}%
            </span>

          </div>

          <div>

            <h2>
              Job Readiness
            </h2>

            <p>
              You are making good progress. Keep
              improving your weak areas before applying
              for jobs.
            </p>

          </div>

        </div>

      </div>


      {/* SKILLS */}

      <section className="readiness-section">

        <div className="readiness-section-header">

          <p className="section-label">
            SKILL ANALYSIS
          </p>

          <h2>
            Your Technical Skills
          </h2>

        </div>


        <div className="readiness-skills">

          {skills.map((skill) => (

            <div
              className="readiness-skill-card"
              key={skill.name}
            >

              <div className="skill-card-top">

                <strong>
                  {skill.name}
                </strong>

                <span>
                  {skill.score}%
                </span>

              </div>

              <div className="readiness-progress">

                <div
                  style={{
                    width: `${skill.score}%`
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* ASSESSMENT */}

      <section className="readiness-section">

        <div className="readiness-section-header">

          <p className="section-label">
            ASSESSMENT
          </p>

          <h2>
            Your Performance
          </h2>

        </div>


        <div className="assessment-grid">

          <div className="assessment-card">

            <span>
              TECHNICAL QUIZ
            </span>

            <h3>
              8 / 10
            </h3>

            <p>
              Good technical fundamentals.
            </p>

          </div>


          <div className="assessment-card">

            <span>
              CODING PROBLEMS
            </span>

            <h3>
              14 / 20
            </h3>

            <p>
              Improve problem-solving speed.
            </p>

          </div>


          <div className="assessment-card">

            <span>
              INTERVIEW
            </span>

            <h3>
              7 / 10
            </h3>

            <p>
              Work on explaining your solutions.
            </p>

          </div>

        </div>

      </section>


      {/* AI ANALYSIS */}

      <section className="ai-analysis">

        <p className="section-label">
          AI ANALYSIS
        </p>

        <h2>
          What should you improve?
        </h2>


        <div className="analysis-grid">

          <div className="analysis-card strong">

            <h3>
              Your Strengths
            </h3>

            <ul>

              <li>
                JavaScript fundamentals
              </li>

              <li>
                Database concepts
              </li>

              <li>
                Technical understanding
              </li>

            </ul>

          </div>


          <div className="analysis-card improve">

            <h3>
              Needs Improvement
            </h3>

            <ul>

              <li>
                Node.js
              </li>

              <li>
                Problem solving
              </li>

              <li>
                Interview communication
              </li>

            </ul>

          </div>

        </div>

      </section>


      {/* RECOMMENDATION */}

      <section className="recommendation-card">

        <p className="section-label">
          RECOMMENDED NEXT STEP
        </p>

        <h2>
          Practice Node.js and coding problems
        </h2>

        <p>
          Based on your current performance, improving
          backend development and problem-solving skills
          can increase your job readiness.
        </p>

        <button
          onClick={() => navigate("/jobs")}
        >
          Continue Learning →
        </button>

      </section>

    </div>
  );
}

export default JobReadiness;