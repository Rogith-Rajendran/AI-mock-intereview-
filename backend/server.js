require("dotenv").config();
const express = require("express");
const cors = require("cors");

const codeRoutes =
  require("./routes/codeRoutes");

const interviewRoutes =
  require("./routes/interviewRoutes");

const jobReadinessRoutes =
  require("./routes/jobReadinessRoutes");

const aiRoutes =
  require("./routes/aiRoutes");


const app = express();

const PORT = 5000;


/*
========================================
MIDDLEWARE
========================================
*/

app.use(cors());

app.use(express.json());


/*
========================================
MAIN BACKEND TEST
========================================
*/

app.get("/", (req, res) => {

  res.json({

    success: true,

    message:
      "CareerAI backend is running"

  });

});


/*
========================================
CODE ROUTES
========================================
*/

app.use(
  "/api/code",
  codeRoutes
);


/*
========================================
INTERVIEW ROUTES
========================================
*/

app.use(
  "/api/interview",
  interviewRoutes
);


/*
========================================
JOB READINESS ROUTES
========================================
*/

app.use(
  "/api/job-readiness",
  jobReadinessRoutes
);


/*
========================================
AI CAREER ANALYSIS ROUTES
========================================
*/

app.use(
  "/api/ai",
  aiRoutes
);


/*
========================================
START SERVER
========================================
*/

app.listen(
  PORT,
  () => {

    console.log(
      `CareerAI backend running on http://localhost:${PORT}`
    );

  }
);