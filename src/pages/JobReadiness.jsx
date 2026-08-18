import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function JobReadiness() {

  const navigate = useNavigate();


  // ========================================
  // PROGRESS STATE
  // ========================================

  const [codingProgress, setCodingProgress] =
    useState(null);

  const [interviewProgress, setInterviewProgress] =
    useState(null);

  const [quizProgress, setQuizProgress] =
    useState(null);


  // ========================================
  // LOAD ALL PROGRESS
  // ========================================

  useEffect(() => {

    // ----------------------------------------
    // CODING
    // ----------------------------------------

    const savedCodingProgress =
      localStorage.getItem(
        "careerAICodingProgress"
      );


    if (savedCodingProgress) {

      try {

        setCodingProgress(
          JSON.parse(
            savedCodingProgress
          )
        );

      } catch (error) {

        console.error(
          "Unable to load coding progress:",
          error
        );

      }

    }


    // ----------------------------------------
    // INTERVIEW
    // ----------------------------------------

    const savedInterviewProgress =
      localStorage.getItem(
        "careerAIInterviewProgress"
      );


    if (savedInterviewProgress) {

      try {

        setInterviewProgress(
          JSON.parse(
            savedInterviewProgress
          )
        );

      } catch (error) {

        console.error(
          "Unable to load interview progress:",
          error
        );

      }

    }


    // ----------------------------------------
    // TECHNICAL QUIZ
    // ----------------------------------------

    const savedQuizProgress =
      localStorage.getItem(
        "careerAIQuizProgress"
      );


    if (savedQuizProgress) {

      try {

        setQuizProgress(
          JSON.parse(
            savedQuizProgress
          )
        );

      } catch (error) {

        console.error(
          "Unable to load quiz progress:",
          error
        );

      }

    }

  }, []);


  // ========================================
  // CODING SCORE
  // ========================================

  const totalCodingProblems = 8;


  const solvedCodingProblems =
    codingProgress?.solvedProblems?.length || 0;


  const codingPercentage =
    Math.round(
      (
        solvedCodingProblems /
        totalCodingProblems
      ) * 100
    );


  // ========================================
  // INTERVIEW SCORE
  // ========================================

  const totalInterviewQuestions =
    interviewProgress?.totalQuestions || 3;


  const interviewScore =
    interviewProgress?.score || 0;


  const interviewPercentage =
    Math.round(
      (
        interviewScore /
        totalInterviewQuestions
      ) * 100
    );


  const interviewCompleted =
    interviewProgress?.completed === true;


  // ========================================
  // TECHNICAL QUIZ SCORE
  // ========================================

  const totalQuizQuestions =
    quizProgress?.totalQuestions || 5;


  const quizScore =
    quizProgress?.score || 0;


  const quizPercentage =
    Math.round(
      (
        quizScore /
        totalQuizQuestions
      ) * 100
    );


  const quizCompleted =
    quizProgress?.completed === true;


  // ========================================
  // OVERALL JOB READINESS
  // ========================================

  const scores = [];


  /*
  ----------------------------------------
  CODING
  ----------------------------------------
  */

  if (codingProgress) {

    scores.push(
      codingPercentage
    );

  }


  /*
  ----------------------------------------
  INTERVIEW
  ----------------------------------------
  */

  if (interviewCompleted) {

    scores.push(
      interviewPercentage
    );

  }


  /*
  ----------------------------------------
  QUIZ
  ----------------------------------------
  */

  if (quizCompleted) {

    scores.push(
      quizPercentage
    );

  }


  /*
  ----------------------------------------
  CALCULATE AVERAGE
  ----------------------------------------
  */

  const readiness =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (total, score) =>
              total + score,
            0
          ) / scores.length
        )
      : 0;


  // ========================================
  // READINESS MESSAGE
  // ========================================

  let readinessMessage =
    "Start your career preparation journey.";


  if (readiness >= 80) {

    readinessMessage =
      "Excellent preparation. You are approaching strong job readiness.";

  }

  else if (readiness >= 60) {

    readinessMessage =
      "Good progress. Continue strengthening your skills.";

  }

  else if (readiness >= 40) {

    readinessMessage =
      "You are making progress. Focus on your weaker areas.";

  }

  else {

    readinessMessage =
      "You are still building your foundation. Keep practicing consistently.";

  }


  // ========================================
  // SKILL ANALYSIS
  // ========================================

  const skills = [

    {
      name: "Problem Solving",
      score: codingPercentage
    },

    {
      name: "Technical Knowledge",
      score: quizPercentage
    },

    {
      name: "Interview Performance",
      score: interviewPercentage
    },

    {
      name: "Overall Preparation",
      score: readiness
    }

  ];


  // ========================================
  // RECOMMENDATION
  // ========================================

  let recommendation =
    "Continue practicing";


  if (codingPercentage < 50) {

    recommendation =
      "Practice more coding problems";

  }

  else if (
    !interviewCompleted
  ) {

    recommendation =
      "Complete interview practice";

  }

  else if (
    interviewPercentage < 50
  ) {

    recommendation =
      "Improve your interview performance";

  }

  else if (
    !quizCompleted
  ) {

    recommendation =
      "Complete the technical quiz";

  }

  else if (
    quizPercentage < 50
  ) {

    recommendation =
      "Strengthen your technical fundamentals";

  }

  else if (
    readiness >= 80
  ) {

    recommendation =
      "Continue advanced job preparation";

  }


  // ========================================
  // CONTINUE LEARNING
  // ========================================

  const handleContinueLearning =
    () => {

      if (
        codingPercentage < 100
      ) {

        navigate(
          "/jobs/coding"
        );

        return;

      }


      if (
        !interviewCompleted
      ) {

        navigate(
          "/jobs/practice"
        );

        return;

      }


      if (
        !quizCompleted
      ) {

        navigate(
          "/jobs/quiz"
        );

        return;

      }


      if (
        interviewPercentage < 70
      ) {

        navigate(
          "/jobs/practice"
        );

        return;

      }


      if (
        quizPercentage < 70
      ) {

        navigate(
          "/jobs/quiz"
        );

        return;

      }


      navigate(
        "/jobs"
      );

    };


  // ========================================
  // PAGE
  // ========================================

  return (

    <div className="readiness-page">


      {/* ==================================
          HEADER
      ================================== */}

      <div className="readiness-header">

        <p className="section-label">
          JOB READINESS
        </p>


        <h1>
          Full Stack Developer
        </h1>


        <p>
          Your current preparation and
          job-readiness analysis.
        </p>

      </div>


      {/* ==================================
          MAIN SCORE
      ================================== */}

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
              {readinessMessage}
            </p>

          </div>

        </div>

      </div>


      {/* ==================================
          THREE ASSESSMENTS
      ================================== */}

      <section className="readiness-section">

        <div className="readiness-section-header">

          <p className="section-label">
            PERFORMANCE
          </p>


          <h2>
            Your Assessment Results
          </h2>

        </div>


        <div className="assessment-grid">


          {/* CODING */}

          <div className="assessment-card">

            <span>
              CODING PRACTICE
            </span>


            <h3>
              {solvedCodingProblems}
              {" / "}
              {totalCodingProblems}
            </h3>


            <p>
              {codingPercentage}% completed
            </p>

          </div>


          {/* INTERVIEW */}

          <div className="assessment-card">

            <span>
              INTERVIEW PRACTICE
            </span>


            {interviewCompleted ? (

              <>

                <h3>
                  {interviewScore}
                  {" / "}
                  {totalInterviewQuestions}
                </h3>


                <p>
                  {interviewPercentage}% score
                </p>

              </>

            ) : (

              <>

                <h3>
                  Not Completed
                </h3>


                <p>
                  Complete interview practice.
                </p>

              </>

            )}

          </div>


          {/* QUIZ */}

          <div className="assessment-card">

            <span>
              TECHNICAL QUIZ
            </span>


            {quizCompleted ? (

              <>

                <h3>
                  {quizScore}
                  {" / "}
                  {totalQuizQuestions}
                </h3>


                <p>
                  {quizPercentage}% score
                </p>

              </>

            ) : (

              <>

                <h3>
                  Not Completed
                </h3>


                <p>
                  Complete the technical quiz.
                </p>

              </>

            )}

          </div>

        </div>

      </section>


      {/* ==================================
          SKILLS
      ================================== */}

      <section className="readiness-section">

        <div className="readiness-section-header">

          <p className="section-label">
            SKILL ANALYSIS
          </p>


          <h2>
            Your Current Performance
          </h2>

        </div>


        <div className="readiness-skills">

          {skills.map(
            (skill) => (

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
                      width:
                        `${skill.score}%`
                    }}
                  />

                </div>

              </div>

            )
          )}

        </div>

      </section>


      {/* ==================================
          AI ANALYSIS
      ================================== */}

      <section className="ai-analysis">

        <p className="section-label">
          AI ANALYSIS
        </p>


        <h2>
          What should you improve?
        </h2>


        <div className="analysis-grid">


          {/* STRENGTHS */}

          <div className="analysis-card strong">

            <h3>
              Your Strengths
            </h3>


            <ul>


              {codingPercentage >= 60 && (

                <li>
                  Good coding practice
                </li>

              )}


              {interviewPercentage >= 60 &&
                interviewCompleted && (

                <li>
                  Good interview performance
                </li>

              )}


              {quizPercentage >= 60 &&
                quizCompleted && (

                <li>
                  Strong technical knowledge
                </li>

              )}


              {readiness >= 60 && (

                <li>
                  Good overall preparation
                </li>

              )}


              {scores.length === 0 && (

                <li>
                  Start your assessments
                </li>

              )}

            </ul>

          </div>


          {/* IMPROVEMENT */}

          <div className="analysis-card improve">

            <h3>
              Needs Improvement
            </h3>


            <ul>


              {codingPercentage < 60 && (

                <li>
                  Solve more coding problems
                </li>

              )}


              {(!interviewCompleted ||
                interviewPercentage < 60) && (

                <li>
                  Improve interview preparation
                </li>

              )}


              {(!quizCompleted ||
                quizPercentage < 60) && (

                <li>
                  Strengthen technical knowledge
                </li>

              )}


              {readiness < 60 && (

                <li>
                  Continue consistent preparation
                </li>

              )}

            </ul>

          </div>

        </div>

      </section>


      {/* ==================================
          SCORE BREAKDOWN
      ================================== */}

      <section className="readiness-section">

        <div className="readiness-section-header">

          <p className="section-label">
            READINESS BREAKDOWN
          </p>


          <h2>
            How your score is calculated
          </h2>

        </div>


        <div className="assessment-grid">


          <div className="assessment-card">

            <span>
              CODING
            </span>


            <h3>
              {codingPercentage}%
            </h3>


            <p>
              Problem-solving performance
            </p>

          </div>


          <div className="assessment-card">

            <span>
              INTERVIEW
            </span>


            <h3>
              {interviewCompleted
                ? `${interviewPercentage}%`
                : "Pending"}
            </h3>


            <p>
              Interview performance
            </p>

          </div>


          <div className="assessment-card">

            <span>
              TECHNICAL QUIZ
            </span>


            <h3>
              {quizCompleted
                ? `${quizPercentage}%`
                : "Pending"}
            </h3>


            <p>
              Technical knowledge
            </p>

          </div>

        </div>

      </section>


      {/* ==================================
          RECOMMENDATION
      ================================== */}

      <section className="recommendation-card">

        <p className="section-label">
          RECOMMENDED NEXT STEP
        </p>


        <h2>
          {recommendation}
        </h2>


        <p>

          Your current overall readiness score is{" "}
          <strong>
            {readiness}%
          </strong>
          {" "}

          based on your available assessment
          results.

        </p>


        <button
          onClick={
            handleContinueLearning
          }
        >
          Continue Learning →
        </button>

      </section>


    </div>

  );

}


export default JobReadiness;