import { useNavigate } from "react-router-dom";

function JobOptions() {
  const navigate = useNavigate();

  const roleData = localStorage.getItem("selectedJobRole");

  const role = roleData
    ? JSON.parse(roleData)
    : null;

  return (
    <div className="job-options-page">

      <div className="job-options-header">

        <p className="section-label">
          JOB PREPARATION
        </p>

        <h1>
          {role?.title || "Job Role"}
        </h1>

        <p>
          Choose how you want to prepare for your
          selected career role.
        </p>

      </div>


      <div className="job-learning-options">

        {/* LEARN SKILLS */}

        <div className="job-learning-card">

          <span>
            01
          </span>

          <h2>
            Learn Skills
          </h2>

          <p>
            Learn the important technologies, concepts
            and skills required for this job role.
          </p>

          <button
            onClick={() => navigate("/jobs/skills")}
          >
            Start Learning →
          </button>

        </div>


        {/* INTERVIEW QUESTIONS */}

        <div className="job-learning-card">

          <span>
            02
          </span>

          <h2>
            Interview Questions
          </h2>

          <p>
            Practice technical and common interview
            questions asked for this career role.
          </p>

          <button
            onClick={() => navigate("/jobs/practice")}
          >
            Practice Interviews →
          </button>

        </div>


        {/* TECHNICAL QUIZ */}

        <div className="job-learning-card">

          <span>
            03
          </span>

          <h2>
            Technical Quiz
          </h2>

          <p>
            Test your technical knowledge with
            multiple-choice questions and get your score.
          </p>

          <button
            onClick={() => navigate("/jobs/quiz")}
          >
            Start Technical Quiz →
          </button>

        </div>


        {/* PLACEMENT ASSESSMENT */}

        <div className="job-learning-card placement-card">

          <span>
            04
          </span>

          <h2>
            Placement Assessment
          </h2>

          <p>
            Complete a realistic four-round placement
            assessment designed for your selected job role.
          </p>

          <div className="placement-rounds">

            <span>1. Aptitude</span>
            <span>2. Coding</span>
            <span>3. Group Discussion</span>
            <span>4. AI HR Interview</span>

          </div>

          <button
            onClick={() => navigate("/jobs/assessment")}
          >
            Start Placement Assessment →
          </button>

        </div>

      </div>

    </div>
  );
}

export default JobOptions;