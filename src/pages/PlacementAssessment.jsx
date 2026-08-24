import { useNavigate } from "react-router-dom";

function PlacementAssessment() {
  const navigate = useNavigate();

  let role = null;

  try {
    const roleData = localStorage.getItem("selectedJobRole");

    if (roleData) {
      role = JSON.parse(roleData);
    }
  } catch (error) {
    console.error("Unable to read selected job role:", error);
  }

  const startAssessment = () => {
    navigate("/jobs/assessment/round-1");
  };

  return (
    <div className="placement-page">

      <div className="placement-header">

        <p className="section-label">
          PLACEMENT ASSESSMENT
        </p>

        <h1>
          {role?.title || "Placement Assessment"}
        </h1>

        <p>
          Complete all four rounds to measure your
          placement readiness.
        </p>

      </div>


      <div className="assessment-rounds">

        <div className="assessment-round-card">

          <span>01</span>

          <h2>
            Aptitude & Quantitative
          </h2>

          <p>
            Test your quantitative, logical reasoning
            and problem-solving abilities.
          </p>

        </div>


        <div className="assessment-round-card">

          <span>02</span>

          <h2>
            Coding Round
          </h2>

          <p>
            Solve programming problems related to
            your selected career role.
          </p>

        </div>


        <div className="assessment-round-card">

          <span>03</span>

          <h2>
            AI Group Discussion
          </h2>

          <p>
            Participate in an AI-powered group discussion
            and demonstrate your communication and reasoning.
          </p>

        </div>


        <div className="assessment-round-card">

          <span>04</span>

          <h2>
            AI HR Interview
          </h2>

          <p>
            Complete a real-time AI technical HR interview
            based on your profile and assessment performance.
          </p>

        </div>

      </div>


      <div className="assessment-rules">

        <h2>
          Assessment Rules
        </h2>

        <p>
          Camera and microphone must remain enabled.
        </p>

        <p>
          Stay inside the assessment environment.
        </p>

        <p>
          Maximum warnings: 3.
        </p>

        <p>
          The assessment will end after the third warning.
        </p>

      </div>


      <button
        className="assessment-start"
        onClick={startAssessment}
      >
        Start Placement Assessment →
      </button>

    </div>
  );
}

export default PlacementAssessment;