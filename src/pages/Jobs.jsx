import { useNavigate } from "react-router-dom";

function Jobs() {

  const navigate = useNavigate();


  /*
  ========================================
  JOB ROLES
  ========================================
  */

  const jobRoles = [

    {
      number: "01",

      title: "Full Stack Developer",

      description:
        "Learn frontend, backend, databases, APIs and full stack development.",

      skills:
        "HTML, CSS, JavaScript, React, Node.js, Express, MongoDB"
    },


    {
      number: "02",

      title: "Java Developer",

      description:
        "Prepare for Java development roles with programming and backend concepts.",

      skills:
        "Java, OOP, Collections, Spring Boot, SQL, REST APIs"
    },


    {
      number: "03",

      title: "Frontend Developer",

      description:
        "Build modern and responsive user interfaces for web applications.",

      skills:
        "HTML, CSS, JavaScript, React, Git"
    },


    {
      number: "04",

      title: "Backend Developer",

      description:
        "Learn how servers, APIs, databases and backend applications work.",

      skills:
        "Node.js, Express, Java, Python, SQL, MongoDB"
    },


    {
      number: "05",

      title: "Python Developer",

      description:
        "Learn Python programming and prepare for software development roles.",

      skills:
        "Python, OOP, SQL, APIs, Django / Flask"
    },


    {
      number: "06",

      title: "Software Developer",

      description:
        "Build strong programming and problem-solving skills for software roles.",

      skills:
        "Programming, DSA, OOP, DBMS, OS, Computer Networks"
    }

  ];


  /*
  ========================================
  SELECT JOB ROLE
  ========================================
  */

  const handleRole = (role) => {

    localStorage.setItem(
      "selectedJobRole",
      JSON.stringify(role)
    );


    navigate(
      "/jobs/options"
    );

  };


  /*
  ========================================
  CODING PRACTICE
  ========================================
  */

  const handleCoding =
    () => {

      navigate(
        "/jobs/coding"
      );

    };


  /*
  ========================================
  INTERVIEW PRACTICE
  ========================================
  */

  const handleInterview =
    () => {

      navigate(
        "/jobs/practice"
      );

    };


  /*
  ========================================
  TECHNICAL QUIZ
  ========================================
  */

  const handleQuiz =
    () => {

      navigate(
        "/jobs/quiz"
      );

    };


  /*
  ========================================
  JOB READINESS
  ========================================
  */

  const handleReadiness =
    () => {

      navigate(
        "/jobs/readiness"
      );

    };


  /*
  ========================================
  PAGE
  ========================================
  */

  return (

    <div className="jobs-page">


      {/* ==================================
          PAGE HEADER
      ================================== */}

      <div className="jobs-header">

        <p className="section-label">
          JOBS & INTERVIEWS
        </p>


        <h1>
          Choose your career role
        </h1>


        <p>
          Select a job role and start learning
          the skills, solving problems and
          preparing for interviews.
        </p>

      </div>


      {/* ==================================
          JOB ROLES
      ================================== */}

      <div className="job-options">

        {jobRoles.map(
          (role) => (

            <div
              className="job-card"
              key={role.number}
            >

              <span>
                {role.number}
              </span>


              <h2>
                {role.title}
              </h2>


              <p>
                {role.description}
              </p>


              <div className="job-skills">

                <strong>
                  Important Skills
                </strong>


                <p>
                  {role.skills}
                </p>

              </div>


              <button
                onClick={() =>
                  handleRole(role)
                }
              >
                Start Preparation →
              </button>

            </div>

          )
        )}

      </div>


      {/* ==================================
          CAREER PREPARATION
      ================================== */}

      <div
        className="jobs-header"
        style={{
          paddingTop: "80px",
          paddingBottom: "30px"
        }}
      >

        <p className="section-label">
          CAREER PREPARATION
        </p>


        <h1>
          Prepare for Your Career
        </h1>


        <p>
          Practice coding, improve your interview
          skills, test your technical knowledge
          and check your job readiness.
        </p>

      </div>


      {/* ==================================
          PREPARATION OPTIONS
      ================================== */}

      <div className="job-options">


        {/* ==================================
            CODING
        ================================== */}

        <div className="job-card">

          <span>
            07
          </span>


          <h2>
            Coding Practice
          </h2>


          <p>
            Solve programming problems and improve
            your coding and problem-solving skills.
          </p>


          <div className="job-skills">

            <strong>
              Practice Areas
            </strong>


            <p>
              JavaScript, Python, Java, SQL,
              Arrays, Strings and more
            </p>

          </div>


          <button
            onClick={handleCoding}
          >
            Start Coding →
          </button>

        </div>


        {/* ==================================
            INTERVIEW
        ================================== */}

        <div className="job-card">

          <span>
            08
          </span>


          <h2>
            Interview Practice
          </h2>


          <p>
            Practice technical interview questions
            and evaluate your interview performance.
          </p>


          <div className="job-skills">

            <strong>
              Practice Areas
            </strong>


            <p>
              Technical questions, fundamentals,
              APIs, React and programming
            </p>

          </div>


          <button
            onClick={handleInterview}
          >
            Start Interview →
          </button>

        </div>


        {/* ==================================
            QUIZ
        ================================== */}

        <div className="job-card">

          <span>
            09
          </span>


          <h2>
            Technical Quiz
          </h2>


          <p>
            Test your technical knowledge and
            understand your current preparation level.
          </p>


          <div className="job-skills">

            <strong>
              Quiz Areas
            </strong>


            <p>
              HTML, JavaScript, React, APIs,
              MongoDB and backend concepts
            </p>

          </div>


          <button
            onClick={handleQuiz}
          >
            Take Technical Quiz →
          </button>

        </div>


        {/* ==================================
            JOB READINESS
        ================================== */}

        <div className="job-card">

          <span>
            10
          </span>


          <h2>
            Job Readiness
          </h2>


          <p>
            View your combined performance and
            understand how prepared you are for jobs.
          </p>


          <div className="job-skills">

            <strong>
              Analysis Includes
            </strong>


            <p>
              Coding, interview performance,
              technical knowledge and overall readiness
            </p>

          </div>


          <button
            onClick={handleReadiness}
          >
            View Job Readiness →
          </button>

        </div>


      </div>


      {/* ==================================
          BOTTOM SPACE
      ================================== */}

      <div
        style={{
          height: "80px"
        }}
      />

    </div>

  );

}


export default Jobs;