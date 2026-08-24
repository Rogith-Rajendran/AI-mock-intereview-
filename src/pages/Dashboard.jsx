import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [jobReadiness, setJobReadiness] =
    useState(null);

  const [interviewProgress, setInterviewProgress] =
    useState(null);

  const [codingProgress, setCodingProgress] =
    useState(null);

  /*
  ========================================
  CURRENT LOGIN DATA
  ========================================
  */

  const loggedIn =
    localStorage.getItem("careerAILoggedIn");

  const userData =
    localStorage.getItem("careerAIUser");

  let user = null;

  try {
    user = userData
      ? JSON.parse(userData)
      : null;
  } catch (error) {
    console.error(
      "Unable to read user data:",
      error
    );
  }

  /*
  ========================================
  USER ID
  ========================================
  */

  const userId =
    user?._id ||
    user?.id ||
    user?.email ||
    null;

  /*
  ========================================
  USER-SPECIFIC PROFILE KEY
  ========================================
  */

  const profileKey =
    userId
      ? `careerAIProfile_${userId}`
      : null;

  /*
  ========================================
  LOGIN CHECK
  ========================================
  */

  useEffect(() => {
    if (loggedIn !== "true") {
      navigate("/login");
    }
  }, [loggedIn, navigate]);

  /*
  ========================================
  LOAD USER PROFILE
  ========================================
  */

  const [profile, setProfile] =
    useState(null);

  useEffect(() => {
    if (!profileKey) {
      setProfile(null);
      return;
    }

    const savedProfile =
      localStorage.getItem(profileKey);

    if (!savedProfile) {
      setProfile(null);
      return;
    }

    try {
      setProfile(
        JSON.parse(savedProfile)
      );
    } catch (error) {
      console.error(
        "Unable to load profile:",
        error
      );

      setProfile(null);
    }
  }, [profileKey]);

  /*
  ========================================
  LOAD JOB READINESS
  ========================================
  */

  useEffect(() => {
    if (!userId) {
      setJobReadiness(null);
      return;
    }

    /*
      New user-specific key
    */
    const userSpecificKey =
      `careerAIJobReadinessResult_${userId}`;

    let savedResult =
      localStorage.getItem(
        userSpecificKey
      );

    /*
      Backward compatibility:
      If user-specific data does not exist,
      check the old global key.
    */
    if (!savedResult) {
      savedResult =
        localStorage.getItem(
          "careerAIJobReadinessResult"
        );
    }

    if (savedResult) {
      try {
        setJobReadiness(
          JSON.parse(savedResult)
        );
      } catch (error) {
        console.error(
          "Unable to load Job Readiness result:",
          error
        );

        setJobReadiness(null);
      }
    } else {
      setJobReadiness(null);
    }
  }, [userId]);

  /*
  ========================================
  LOAD INTERVIEW PROGRESS
  ========================================
  */

  useEffect(() => {
    if (!userId) {
      setInterviewProgress(null);
      return;
    }

    /*
      New user-specific key
    */
    const userSpecificKey =
      `careerAIInterviewProgress_${userId}`;

    let savedProgress =
      localStorage.getItem(
        userSpecificKey
      );

    /*
      Backward compatibility
    */
    if (!savedProgress) {
      savedProgress =
        localStorage.getItem(
          "careerAIInterviewProgress"
        );
    }

    if (savedProgress) {
      try {
        setInterviewProgress(
          JSON.parse(savedProgress)
        );
      } catch (error) {
        console.error(
          "Unable to load Interview progress:",
          error
        );

        setInterviewProgress(null);
      }
    } else {
      setInterviewProgress(null);
    }
  }, [userId]);

  /*
  ========================================
  LOAD CODING PROGRESS
  ========================================
  */

  useEffect(() => {
    if (!userId) {
      setCodingProgress(null);
      return;
    }

    /*
      New user-specific key
    */
    const userSpecificKey =
      `careerAICodingProgress_${userId}`;

    let savedProgress =
      localStorage.getItem(
        userSpecificKey
      );

    /*
      Backward compatibility
    */
    if (!savedProgress) {
      savedProgress =
        localStorage.getItem(
          "careerAICodingProgress"
        );
    }

    if (savedProgress) {
      try {
        setCodingProgress(
          JSON.parse(savedProgress)
        );
      } catch (error) {
        console.error(
          "Unable to load Coding progress:",
          error
        );

        setCodingProgress(null);
      }
    } else {
      setCodingProgress(null);
    }
  }, [userId]);

  /*
  ========================================
  LOGOUT
  ========================================
  */

  const handleLogout = () => {
    localStorage.removeItem(
      "careerAILoggedIn"
    );

    navigate("/login");
  };

  /*
  ========================================
  PROFILE
  ========================================
  */

  const handleProfile = () => {
    navigate("/profile");
  };

  /*
  ========================================
  HIGHER EDUCATION
  ========================================
  */

  const handleEducation = () => {
    navigate("/education");
  };

  /*
  ========================================
  JOBS
  ========================================
  */

  const handleJobs = () => {
    navigate("/jobs");
  };

  /*
  ========================================
  JOB READINESS
  ========================================
  */

  const handleJobReadiness = () => {
    navigate("/jobs/readiness");
  };

  /*
  ========================================
  INTERVIEW
  ========================================
  */

  const handleInterview = () => {
    navigate("/jobs/practice");
  };

  /*
  ========================================
  CODING
  ========================================
  */

  const handleCoding = () => {
    navigate("/jobs/coding");
  };

  /*
  ========================================
  INTERVIEW PERCENTAGE
  ========================================
  */

  const interviewPercentage =
    interviewProgress &&
    interviewProgress.totalQuestions > 0
      ? Math.min(
          100,
          Math.round(
            (
              (interviewProgress.currentQuestion + 1) /
              interviewProgress.totalQuestions
            ) * 100
          )
        )
      : 0;

  const interviewCompleted =
    interviewProgress?.completed === true;

  /*
  ========================================
  CODING PROGRESS
  ========================================
  */

  const totalCodingProblems = 8;

  const solvedCodingProblems =
    codingProgress?.solvedProblems?.length || 0;

  const codingPercentage =
    totalCodingProblems > 0
      ? Math.min(
          100,
          Math.round(
            (
              solvedCodingProblems /
              totalCodingProblems
            ) * 100
          )
        )
      : 0;

  /*
  ========================================
  PAGE
  ========================================
  */

  return (
    <div className="dashboard-page">

      {/* ==================================
          HEADER
      ================================== */}

      <div className="dashboard-top">

        <div>

          <p className="dashboard-label">
            CAREERAI DASHBOARD
          </p>

          <h1>
            Welcome, {user?.name || "Student"}
          </h1>

          <p>
            Explore your career possibilities and
            plan your future.
          </p>

        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>


      {/* ==================================
          PROFILE
      ================================== */}

      <div className="profile-summary">

        <div>

          <h2>
            Your Profile
          </h2>

          {profile ? (

            <div className="profile-details">

              <div>
                <span>
                  Degree
                </span>

                <strong>
                  {profile.degree}
                </strong>
              </div>


              <div>
                <span>
                  Branch
                </span>

                <strong>
                  {profile.branch}
                </strong>
              </div>


              <div>
                <span>
                  Year
                </span>

                <strong>
                  {profile.year}
                </strong>
              </div>


              <div>
                <span>
                  CGPA
                </span>

                <strong>
                  {profile.cgpa}
                </strong>
              </div>


              <div>
                <span>
                  Skills
                </span>

                <strong>
                  {profile.skills}
                </strong>
              </div>


              <div>
                <span>
                  Interests
                </span>

                <strong>
                  {profile.interests}
                </strong>
              </div>

            </div>

          ) : (

            <div className="profile-empty">

              <p>
                Your profile is not completed yet.
              </p>

              <button
                onClick={handleProfile}
              >
                Complete Your Profile →
              </button>

            </div>

          )}

        </div>

      </div>


      {/* ==================================
          CAREER PROGRESS
      ================================== */}

      <section
        style={{
          marginTop: "30px",
          padding: "30px",
          background: "white",
          borderRadius: "16px",
          border: "1px solid #e2e8f0"
        }}
      >

        <div
          style={{
            marginBottom: "25px"
          }}
        >

          <p
            style={{
              margin: 0,
              color: "#2563eb",
              fontSize: "13px",
              fontWeight: "bold",
              letterSpacing: "1px"
            }}
          >
            CAREER PROGRESS
          </p>


          <h2
            style={{
              margin: "8px 0"
            }}
          >
            Your Current Progress
          </h2>


          <p
            style={{
              margin: 0,
              color: "#64748b"
            }}
          >
            Track your preparation and job readiness
            from one place.
          </p>

        </div>


        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}
        >

          {/* ==================================
              JOB READINESS
          ================================== */}

          <div
            style={{
              padding: "25px",
              borderRadius: "12px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0"
            }}
          >

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "13px",
                fontWeight: "bold"
              }}
            >
              JOB READINESS
            </p>


            {jobReadiness ? (

              <>

                <h2
                  style={{
                    margin: "10px 0 5px",
                    fontSize: "32px",
                    color: "#2563eb"
                  }}
                >
                  {jobReadiness.score}%
                </h2>


                <p
                  style={{
                    margin: "0 0 15px",
                    color: "#166534",
                    fontWeight: "bold"
                  }}
                >
                  {jobReadiness.readinessLevel}
                </p>


                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "#e2e8f0",
                    borderRadius: "10px",
                    overflow: "hidden"
                  }}
                >

                  <div
                    style={{
                      width:
                        `${Math.min(
                          100,
                          Math.max(
                            0,
                            Number(
                              jobReadiness.score
                            ) || 0
                          )
                        )}%`,
                      height: "100%",
                      background: "#2563eb",
                      borderRadius: "10px"
                    }}
                  />

                </div>


                <p
                  style={{
                    marginTop: "12px",
                    color: "#64748b",
                    fontSize: "14px"
                  }}
                >
                  {jobReadiness.correctAnswers}
                  {" "}
                  out of{" "}
                  {jobReadiness.totalAnswered}
                  {" "}
                  correct
                </p>

              </>

            ) : (

              <>

                <h2
                  style={{
                    margin: "10px 0",
                    fontSize: "28px"
                  }}
                >
                  Not Assessed
                </h2>


                <p
                  style={{
                    color: "#64748b",
                    lineHeight: "1.5"
                  }}
                >
                  Complete the Job Readiness
                  assessment to see your score.
                </p>


                <button
                  onClick={handleJobReadiness}
                  style={{
                    marginTop: "10px",
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#2563eb",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Take Assessment →
                </button>

              </>

            )}

          </div>


          {/* ==================================
              INTERVIEW PROGRESS
          ================================== */}

          <div
            style={{
              padding: "25px",
              borderRadius: "12px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0"
            }}
          >

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "13px",
                fontWeight: "bold"
              }}
            >
              INTERVIEW PRACTICE
            </p>


            {interviewProgress ? (

              <>

                <h2
                  style={{
                    margin: "10px 0 5px",
                    fontSize: "32px",
                    color: "#2563eb"
                  }}
                >
                  {Math.min(
                    interviewProgress.currentQuestion + 1,
                    interviewProgress.totalQuestions
                  )}
                  {" / "}
                  {interviewProgress.totalQuestions}
                </h2>


                <p
                  style={{
                    margin: "0 0 15px",
                    color:
                      interviewCompleted
                        ? "#166534"
                        : "#64748b",
                    fontWeight: "bold"
                  }}
                >
                  {interviewCompleted
                    ? "Interview Practice Complete"
                    : `${interviewPercentage}% completed`}
                </p>


                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "#e2e8f0",
                    borderRadius: "10px",
                    overflow: "hidden"
                  }}
                >

                  <div
                    style={{
                      width:
                        `${interviewPercentage}%`,
                      height: "100%",
                      background: "#2563eb",
                      borderRadius: "10px"
                    }}
                  />

                </div>


                <p
                  style={{
                    marginTop: "12px",
                    color: "#64748b",
                    fontSize: "14px"
                  }}
                >
                  Current score:{" "}
                  {interviewProgress.score}
                  {" / "}
                  {interviewProgress.totalQuestions}
                </p>


                <button
                  onClick={handleInterview}
                  style={{
                    marginTop: "5px",
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#111827",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Continue Interview →
                </button>

              </>

            ) : (

              <>

                <h2
                  style={{
                    margin: "10px 0",
                    fontSize: "28px"
                  }}
                >
                  Not Started
                </h2>


                <p
                  style={{
                    color: "#64748b",
                    lineHeight: "1.5"
                  }}
                >
                  Start interview practice to
                  improve your technical communication.
                </p>


                <button
                  onClick={handleInterview}
                  style={{
                    marginTop: "10px",
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#111827",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Start Interview Practice →
                </button>

              </>

            )}

          </div>


          {/* ==================================
              CODING PROGRESS
          ================================== */}

          <div
            style={{
              padding: "25px",
              borderRadius: "12px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0"
            }}
          >

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "13px",
                fontWeight: "bold"
              }}
            >
              CODING PRACTICE
            </p>


            {codingProgress ? (

              <>

                <h2
                  style={{
                    margin: "10px 0 5px",
                    fontSize: "32px",
                    color: "#2563eb"
                  }}
                >
                  {solvedCodingProblems}
                  {" / "}
                  {totalCodingProblems}
                </h2>


                <p
                  style={{
                    margin: "0 0 15px",
                    color:
                      codingPercentage === 100
                        ? "#166534"
                        : "#64748b",
                    fontWeight: "bold"
                  }}
                >
                  {codingPercentage === 100
                    ? "Coding Practice Complete"
                    : `${codingPercentage}% completed`}
                </p>


                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "#e2e8f0",
                    borderRadius: "10px",
                    overflow: "hidden"
                  }}
                >

                  <div
                    style={{
                      width:
                        `${codingPercentage}%`,
                      height: "100%",
                      background: "#2563eb",
                      borderRadius: "10px"
                    }}
                  />

                </div>


                <p
                  style={{
                    marginTop: "12px",
                    color: "#64748b",
                    fontSize: "14px"
                  }}
                >
                  {solvedCodingProblems}
                  {" "}
                  out of{" "}
                  {totalCodingProblems}
                  {" "}
                  problems solved
                </p>


                <button
                  onClick={handleCoding}
                  style={{
                    marginTop: "5px",
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#111827",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Continue Coding →
                </button>

              </>

            ) : (

              <>

                <h2
                  style={{
                    margin: "10px 0",
                    fontSize: "28px"
                  }}
                >
                  Not Started
                </h2>


                <p
                  style={{
                    color: "#64748b",
                    lineHeight: "1.5"
                  }}
                >
                  Solve coding problems to improve
                  your problem-solving skills.
                </p>


                <button
                  onClick={handleCoding}
                  style={{
                    marginTop: "10px",
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#111827",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Start Coding →
                </button>

              </>

            )}

          </div>

        </div>

      </section>


      {/* ==================================
          CAREER OPTIONS
      ================================== */}

      <h2 className="dashboard-section-title">
        Explore Your Career Options
      </h2>


      <div className="dashboard-options">

        {/* ==================================
            HIGHER EDUCATION
        ================================== */}

        <div className="dashboard-card">

          <span>
            01
          </span>

          <h2>
            Higher Education
          </h2>

          <p>
            Explore M.Tech, M.Com, MBA, MS and other
            master's degree opportunities after graduation.
          </p>

          <button
            onClick={handleEducation}
          >
            Explore Higher Education →
          </button>

        </div>


        {/* ==================================
            JOBS
        ================================== */}

        <div className="dashboard-card">

          <span>
            02
          </span>

          <h2>
            Jobs & Interviews
          </h2>

          <p>
            Practice coding, technical questions,
            assessments and interview preparation.
          </p>

          <button
            onClick={handleJobs}
          >
            Explore Jobs →
          </button>

        </div>


        {/* ==================================
            BUSINESS
        ================================== */}

        <div className="dashboard-card">

          <span>
            03
          </span>

          <h2>
            Business Ideas
          </h2>

          <p>
            Discover trending business ideas, startup
            opportunities and entrepreneurship paths.
          </p>

          <button
            onClick={() =>
              alert(
                "Business opportunities module is coming soon."
              )
            }
          >
            Explore Business →
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;