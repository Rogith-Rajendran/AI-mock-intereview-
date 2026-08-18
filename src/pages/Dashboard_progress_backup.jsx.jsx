import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const [jobReadiness, setJobReadiness] =
    useState(null);


  const loggedIn =
    localStorage.getItem("careerAILoggedIn");

  const userData =
    localStorage.getItem("careerAIUser");

  const profileData =
    localStorage.getItem("careerAIProfile");


  const user = userData
    ? JSON.parse(userData)
    : null;

  const profile = profileData
    ? JSON.parse(profileData)
    : null;


  // ========================================
  // LOGIN CHECK
  // ========================================

  useEffect(() => {

    if (loggedIn !== "true") {

      navigate("/login");

    }

  }, [loggedIn, navigate]);


  // ========================================
  // LOAD JOB READINESS RESULT
  // ========================================

  useEffect(() => {

    const savedResult =
      localStorage.getItem(
        "careerAIJobReadinessResult"
      );


    if (savedResult) {

      try {

        const parsedResult =
          JSON.parse(savedResult);

        setJobReadiness(
          parsedResult
        );

      } catch (error) {

        console.error(
          "Unable to load Job Readiness result:",
          error
        );

      }

    }

  }, []);


  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {

    localStorage.removeItem(
      "careerAILoggedIn"
    );

    navigate("/login");

  };


  // ========================================
  // PROFILE
  // ========================================

  const handleProfile = () => {

    navigate("/profile");

  };


  // ========================================
  // HIGHER EDUCATION
  // ========================================

  const handleEducation = () => {

    navigate("/education");

  };


  // ========================================
  // JOBS
  // ========================================

  const handleJobs = () => {

    navigate("/jobs");

  };


  // ========================================
  // JOB READINESS
  // ========================================

  const handleJobReadiness = () => {

    navigate("/jobs/readiness");

  };


  // ========================================
  // DASHBOARD
  // ========================================

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
          border:
            "1px solid #e2e8f0"
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
              margin:
                "8px 0 8px"
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

          {/* JOB READINESS */}

          <div
            style={{
              padding: "25px",
              borderRadius: "12px",
              background: "#f8fafc",
              border:
                "1px solid #e2e8f0"
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
                    margin:
                      "10px 0 5px",
                    fontSize: "32px",
                    color: "#2563eb"
                  }}
                >
                  {jobReadiness.score}%
                </h2>


                <p
                  style={{
                    margin:
                      "0 0 15px",
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
                    background:
                      "#e2e8f0",
                    borderRadius:
                      "10px",
                    overflow:
                      "hidden"
                  }}
                >

                  <div
                    style={{
                      width:
                        `${jobReadiness.score}%`,
                      height: "100%",
                      background:
                        "#2563eb",
                      borderRadius:
                        "10px"
                    }}
                  />

                </div>


                <p
                  style={{
                    marginTop:
                      "12px",
                    color:
                      "#64748b",
                    fontSize:
                      "14px"
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
                    margin:
                      "10px 0",
                    fontSize:
                      "28px"
                  }}
                >
                  Not Assessed
                </h2>


                <p
                  style={{
                    color:
                      "#64748b",
                    lineHeight:
                      "1.5"
                  }}
                >
                  Complete the Job Readiness
                  assessment to see your score.
                </p>


                <button
                  onClick={
                    handleJobReadiness
                  }
                  style={{
                    marginTop:
                      "10px",
                    padding:
                      "10px 16px",
                    border:
                      "none",
                    borderRadius:
                      "8px",
                    background:
                      "#2563eb",
                    color:
                      "white",
                    cursor:
                      "pointer",
                    fontWeight:
                      "bold"
                  }}
                >
                  Take Assessment →
                </button>

              </>

            )}

          </div>


          {/* INTERVIEW */}

          <div
            style={{
              padding: "25px",
              borderRadius: "12px",
              background: "#f8fafc",
              border:
                "1px solid #e2e8f0"
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


            <h2
              style={{
                margin:
                  "10px 0 5px",
                fontSize:
                  "28px"
              }}
            >
              Practice
            </h2>


            <p
              style={{
                color:
                  "#64748b",
                lineHeight:
                  "1.5"
              }}
            >
              Improve your technical interview
              preparation.
            </p>


            <button
              onClick={() =>
                navigate(
                  "/jobs/practice"
                )
              }
              style={{
                marginTop:
                  "10px",
                padding:
                  "10px 16px",
                border:
                  "none",
                borderRadius:
                  "8px",
                background:
                  "#111827",
                color:
                  "white",
                cursor:
                  "pointer",
                fontWeight:
                  "bold"
              }}
            >
              Practice Interview →
            </button>

          </div>


          {/* CODING */}

          <div
            style={{
              padding: "25px",
              borderRadius: "12px",
              background: "#f8fafc",
              border:
                "1px solid #e2e8f0"
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


            <h2
              style={{
                margin:
                  "10px 0 5px",
                fontSize:
                  "28px"
              }}
            >
              Practice
            </h2>


            <p
              style={{
                color:
                  "#64748b",
                lineHeight:
                  "1.5"
              }}
            >
              Solve coding problems and improve
              your problem-solving skills.
            </p>


            <button
              onClick={() =>
                navigate(
                  "/jobs/coding"
                )
              }
              style={{
                marginTop:
                  "10px",
                padding:
                  "10px 16px",
                border:
                  "none",
                borderRadius:
                  "8px",
                background:
                  "#111827",
                color:
                  "white",
                cursor:
                  "pointer",
                fontWeight:
                  "bold"
              }}
            >
              Practice Coding →
            </button>

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

        {/* HIGHER EDUCATION */}

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
            onClick={
              handleEducation
            }
          >
            Explore Higher Education →
          </button>

        </div>


        {/* JOBS */}

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
            onClick={
              handleJobs
            }
          >
            Explore Jobs →
          </button>

        </div>


        {/* BUSINESS */}

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


          <button>
            Explore Business →
          </button>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;