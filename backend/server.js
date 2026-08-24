/*
========================================================
CAREERAI BACKEND SERVER
========================================================

Main backend server for:

- Authentication
- Student assessments
- Coding round
- Group Discussion
- AI HR Interview
- Resume processing
- AI Career Analysis
- Job Readiness

Server:
http://localhost:5000

========================================================
*/

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


/*
========================================================
ROUTES
========================================================
*/

const authRoutes =
  require("./routes/authRoutes");

const assessmentRoutes =
  require("./routes/assessmentRoutes");

const gdRoutes =
  require("./routes/gdRoutes");

const codeRoutes =
  require("./routes/codeRoutes");

const interviewRoutes =
  require("./routes/interviewRoutes");

const jobReadinessRoutes =
  require("./routes/jobReadinessRoutes");

const aiRoutes =
  require("./routes/aiRoutes");

const resumeRoutes =
  require("./routes/resumeRoutes");

const aiHRRoutes =
  require("./routes/aiHRRoutes");


/*
========================================================
CREATE EXPRESS APP
========================================================
*/

const app =
  express();


/*
========================================================
PORT
========================================================
*/

const PORT =
  process.env.PORT || 5000;


/*
========================================================
MIDDLEWARE
========================================================
*/

/*
Allow frontend requests.
*/

app.use(
  cors({
    origin: true,
    credentials: true
  })
);


/*
Parse JSON requests.
*/

app.use(
  express.json({
    limit: "10mb"
  })
);


/*
Parse form data.
*/

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb"
  })
);


/*
========================================================
REQUEST LOGGER
========================================================
*/

app.use(
  (req, res, next) => {

    console.log(
      `${req.method} ${req.originalUrl}`
    );

    next();

  }
);


/*
========================================================
MONGODB CONNECTION
========================================================
*/

if (!process.env.MONGO_URI) {

  console.error(
    "ERROR: MONGO_URI is missing from .env"
  );

}
else {

  mongoose
    .connect(
      process.env.MONGO_URI
    )
    .then(() => {

      console.log(
        "MongoDB connected successfully"
      );

    })
    .catch((error) => {

      console.error(
        "MongoDB connection failed:"
      );

      console.error(
        error.message
      );

    });

}


/*
========================================================
MAIN BACKEND TEST
========================================================
*/

app.get(
  "/",
  (req, res) => {

    res.json({

      success: true,

      message:
        "CareerAI backend is running",

      server:
        "http://localhost:5000"

    });

  }
);


/*
========================================================
HEALTH CHECK
========================================================
*/

app.get(
  "/health",
  (req, res) => {

    res.json({

      success: true,

      message:
        "CareerAI backend is healthy",

      mongodb:
        mongoose.connection.readyState === 1
          ? "connected"
          : "disconnected"

    });

  }
);


/*
========================================================
AUTH ROUTES
========================================================

POST /api/auth/register
POST /api/auth/login

========================================================
*/

app.use(
  "/api/auth",
  authRoutes
);


/*
========================================================
ASSESSMENT ROUTES
========================================================

/api/assessment

========================================================
*/

app.use(
  "/api/assessment",
  assessmentRoutes
);


/*
========================================================
GROUP DISCUSSION ROUTES
========================================================

/api/gd

========================================================
*/

app.use(
  "/api/gd",
  gdRoutes
);


/*
========================================================
CODING ROUTES
========================================================

/api/code

========================================================
*/

app.use(
  "/api/code",
  codeRoutes
);


/*
========================================================
INTERVIEW ROUTES
========================================================

/api/interview

========================================================
*/

app.use(
  "/api/interview",
  interviewRoutes
);


/*
========================================================
JOB READINESS ROUTES
========================================================

/api/job-readiness

========================================================
*/

app.use(
  "/api/job-readiness",
  jobReadinessRoutes
);


/*
========================================================
GENERAL AI CAREER ROUTES
========================================================

/api/ai

========================================================
*/

app.use(
  "/api/ai",
  aiRoutes
);


/*
========================================================
RESUME ROUTES
========================================================

/api/resume

========================================================
*/

app.use(
  "/api/resume",
  resumeRoutes
);


/*
========================================================
AI HR INTERVIEW ROUTES
========================================================

IMPORTANT

This is the final AI HR interview.

Endpoints provided by aiHRRoutes.js:

POST /api/ai-hr/start

POST /api/ai-hr/answer

POST /api/ai-hr/respond

POST /api/ai-hr/evaluate

POST /api/ai-hr/finish

GET /api/ai-hr/test

========================================================
*/

app.use(
  "/api/ai-hr",
  aiHRRoutes
);


/*
========================================================
404 HANDLER
========================================================

If the frontend calls an endpoint that doesn't
exist, return JSON instead of HTML.

This prevents errors such as:

Unexpected token '<'

because Express otherwise may return an
HTML error page.

========================================================
*/

app.use(
  (req, res) => {

    console.error(
      `Route not found: ${req.method} ${req.originalUrl}`
    );


    res.status(404).json({

      success: false,

      message:
        `Route not found: ${req.method} ${req.originalUrl}`

    });

  }
);


/*
========================================================
GLOBAL ERROR HANDLER
========================================================
*/

app.use(
  (error, req, res, next) => {

    console.error(
      "SERVER ERROR:"
    );

    console.error(
      error
    );


    if (
      res.headersSent
    ) {

      return next(error);

    }


    res.status(
      error.status || 500
    ).json({

      success: false,

      message:
        error.message ||
        "Internal server error"

    });

  }
);


/*
========================================================
START SERVER
========================================================
*/

app.listen(
  PORT,
  () => {

    console.log("");
    console.log(
      "========================================"
    );

    console.log(
      "CareerAI backend running"
    );

    console.log(
      `http://localhost:${PORT}`
    );

    console.log(
      "========================================"
    );

    console.log(
      "AI HR:"
    );

    console.log(
      `POST http://localhost:${PORT}/api/ai-hr/start`
    );

    console.log(
      `POST http://localhost:${PORT}/api/ai-hr/answer`
    );

    console.log(
      `POST http://localhost:${PORT}/api/ai-hr/respond`
    );

    console.log(
      `POST http://localhost:${PORT}/api/ai-hr/evaluate`
    );

    console.log(
      `POST http://localhost:${PORT}/api/ai-hr/finish`
    );

    console.log(
      "========================================"
    );

  }
);