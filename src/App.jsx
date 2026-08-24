import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import HigherEducation from "./pages/HigherEducation";
import Jobs from "./pages/Jobs";
import JobOptions from "./pages/JobOptions";
import LearnSkills from "./pages/LearnSkills";
import JobPractice from "./pages/JobPractice";
import Quiz from "./pages/Quiz";
import TopicLesson from "./pages/TopicLesson";
import JobReadiness from "./pages/JobReadiness";
import CodingProblems from "./pages/CodingProblems";
import PlacementAssessment from "./pages/PlacementAssessment";
import AptitudeRound from "./pages/AptitudeRound";
import CodingRound from "./pages/CodingRound";
import GroupDiscussionRound from "./pages/GroupDiscussionRound";
import ResumeUpload from "./pages/ResumeUpload";
import AIHRInterview from "./pages/AIHRInterview";
import AIHRInterviewStart from "./pages/AIHRInterviewStart";


/*
========================================
HOME PAGE
========================================
*/

function Home() {

  const navigate = useNavigate();


  /*
  ========================================
  NAVIGATION FUNCTIONS
  ========================================
  */

  const goToRegister = () => {
    navigate("/register");
  };


  const goToEducation = () => {
    navigate("/education");
  };


  const goToJobs = () => {
    navigate("/jobs");
  };


  const goToBusiness = () => {

    alert(
      "Business opportunities module is coming soon."
    );

  };


  return (

    <div className="home">


      {/* ==================================
          NAVBAR
      ================================== */}

      <Navbar />


      {/* ==================================
          HERO
      ================================== */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-label">
            AI-POWERED CAREER GUIDANCE
          </p>


          <h1>

            Discover the

            <span>
              {" "}right career{" "}
            </span>

            for your future.

          </h1>


          <p className="hero-description">

            Confused about what to do after college?
            Explore higher education, job opportunities,
            and business ideas in one intelligent platform.

          </p>


          <button
            className="start-button"
            onClick={goToRegister}
          >
            Start Your Career Journey
          </button>

        </div>

      </section>


      {/* ==================================
          CAREER OPTIONS
      ================================== */}

      <section className="career-section">


        <p className="section-label">
          EXPLORE YOUR OPTIONS
        </p>


        <h2>
          Three paths. One clear direction.
        </h2>


        <p className="section-text">

          Explore different possibilities and discover
          which career path matches your interests and goals.

        </p>


        <div className="career-options">


          {/* ==================================
              HIGHER EDUCATION
          ================================== */}

          <div className="career-card">

            <div className="card-number">
              01
            </div>


            <h3>
              Higher Education
            </h3>


            <p>

              Explore M.Tech, M.Com, MBA, MS and other
              postgraduate opportunities.

            </p>


            <button
              className="card-button"
              onClick={goToEducation}
            >
              Explore Education →
            </button>

          </div>


          {/* ==================================
              JOBS
          ================================== */}

          <div className="career-card">

            <div className="card-number">
              02
            </div>


            <h3>
              Jobs & Interviews
            </h3>


            <p>

              Prepare for real-world jobs with skills,
              coding problems and interview practice.

            </p>


            <button
              className="card-button"
              onClick={goToJobs}
            >
              Explore Jobs →
            </button>

          </div>


          {/* ==================================
              BUSINESS
          ================================== */}

          <div className="career-card">

            <div className="card-number">
              03
            </div>


            <h3>
              Business Ideas
            </h3>


            <p>

              Discover trending business opportunities,
              startup ideas and entrepreneurship possibilities.

            </p>


            <button
              className="card-button"
              onClick={goToBusiness}
            >
              Explore Business →
            </button>

          </div>

        </div>

      </section>


      {/* ==================================
          ABOUT
      ================================== */}

      <section className="about-section">

        <div className="about-content">

          <p className="section-label">
            WHY CAREERAI?
          </p>


          <h2>
            Helping students make better career decisions.
          </h2>


          <p>

            Many college students are confused about what
            they should do after graduation.

          </p>


          <p>

            CareerAI brings higher education, jobs and
            business opportunities together in one platform.

          </p>


          <p>

            Artificial Intelligence will later provide
            personalized career guidance.

          </p>

        </div>

      </section>


      {/* ==================================
          HOW IT WORKS
      ================================== */}

      <section className="how-section">

        <div className="how-header">

          <p className="section-label">
            HOW IT WORKS
          </p>


          <h2>
            From confusion to career clarity.
          </h2>


          <p className="section-text">

            CareerAI helps students understand their options.

          </p>

        </div>


        <div className="steps">


          {/* STEP 1 */}

          <div className="step">

            <div className="step-number">
              01
            </div>


            <h3>
              Create Your Profile
            </h3>


            <p>
              Enter your degree, skills and interests.
            </p>

          </div>


          {/* STEP 2 */}

          <div className="step">

            <div className="step-number">
              02
            </div>


            <h3>
              Explore Options
            </h3>


            <p>
              Explore education, jobs and business.
            </p>

          </div>


          {/* STEP 3 */}

          <div className="step">

            <div className="step-number">
              03
            </div>


            <h3>
              AI Analysis
            </h3>


            <p>
              AI will analyze your profile and interests.
            </p>

          </div>


          {/* STEP 4 */}

          <div className="step">

            <div className="step-number">
              04
            </div>


            <h3>
              Career Guidance
            </h3>


            <p>
              Receive personalized career recommendations.
            </p>

          </div>

        </div>

      </section>


      {/* ==================================
          FOOTER
      ================================== */}

      <footer className="footer">

        <div className="footer-content">

          <div className="footer-brand">

            <h2>
              CareerAI
            </h2>


            <p>
              AI-powered career guidance platform.
            </p>

          </div>

        </div>


        <div className="footer-bottom">

          <p>
            © 2026 CareerAI
          </p>

        </div>

      </footer>

    </div>

  );

}


/*
========================================
APP ROUTES
========================================
*/

function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ==================================
            HOME
        ================================== */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* ==================================
            AUTHENTICATION
        ================================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==================================
            DASHBOARD
        ================================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* ==================================
            PROFILE
        ================================== */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* ==================================
            HIGHER EDUCATION
        ================================== */}

        <Route
          path="/education"
          element={<HigherEducation />}
        />


        {/* ==================================
            JOBS
        ================================== */}

        <Route
          path="/jobs"
          element={<Jobs />}
        />


        <Route
          path="/jobs/options"
          element={<JobOptions />}
        />


        {/* ==================================
            LEARN SKILLS
        ================================== */}

        <Route
          path="/jobs/skills"
          element={<LearnSkills />}
        />


        {/* ==================================
            LESSON
        ================================== */}

        <Route
          path="/jobs/learn/topic"
          element={<TopicLesson />}
        />


        {/* ==================================
            INTERVIEW
        ================================== */}

        <Route
          path="/jobs/practice"
          element={<JobPractice />}
        />


        {/* ==================================
            TECHNICAL QUIZ
        ================================== */}

        <Route
          path="/jobs/quiz"
          element={<Quiz />}
        />


        {/* ==================================
            CODING PROBLEMS
        ================================== */}

        <Route
          path="/jobs/coding"
          element={<CodingProblems />}
        />


        {/* ==================================
            PLACEMENT ASSESSMENT
        ================================== */}

        <Route
          path="/jobs/assessment"
          element={<PlacementAssessment />}
        />


        {/* ==================================
            ROUND 1 — APTITUDE
        ================================== */}

        <Route
          path="/jobs/assessment/round-1"
          element={<AptitudeRound />}
        />


        {/* ==================================
            ROUND 2 — CODING
        ================================== */}

        <Route
          path="/jobs/assessment/round-2"
          element={<CodingRound />}
        />


        {/* ==================================
            ROUND 3 — GD
        ================================== */}

        <Route
          path="/jobs/assessment/round-3"
          element={<GroupDiscussionRound />}
        />


        {/* ==================================
            JOB READINESS
        ================================== */}

        <Route
          path="/jobs/readiness"
          element={<JobReadiness />}
        />


        {/* ==================================
            RESUME UPLOAD
        ================================== */}

        <Route
          path="/resume-upload"
          element={<ResumeUpload />}
        />


        {/* ==================================
            AI HR INTERVIEW
        ================================== */}

        <Route
          path="/jobs/hr-interview"
          element={<AIHRInterview />}
        />


        {/* ==================================
            ACTUAL AI HR INTERVIEW
        ================================== */}

        <Route
  path="/jobs/hr-interview"
  element={<AIHRInterview />}
/>


      </Routes>

    </BrowserRouter>

  );

}


export default App;