const express = require("express");

const router = express.Router();

const problems = require("../data/problems");


/*
========================================
TEST CODE ROUTE
========================================
*/

router.get("/test", (req, res) => {

  res.json({
    success: true,
    message: "Code route is working"
  });

});


/*
========================================
GET ALL CODING PROBLEMS
========================================
*/

router.get("/problems", (req, res) => {

  const language = req.query.language;


  /*
  ----------------------------------------
  NO LANGUAGE FILTER
  ----------------------------------------
  */

  if (!language) {

    return res.json({
      success: true,
      count: problems.length,
      problems: problems
    });

  }


  /*
  ----------------------------------------
  FILTER BY LANGUAGE
  ----------------------------------------
  */

  const filteredProblems =
    problems.filter(
      (problem) =>
        problem.language.toLowerCase() ===
        language.toLowerCase()
    );


  res.json({

    success: true,

    language: language,

    count: filteredProblems.length,

    problems: filteredProblems

  });

});


/*
========================================
GET ONE CODING PROBLEM
========================================
*/

router.get("/problems/:id", (req, res) => {

  const problemId =
    Number(req.params.id);


  const problem =
    problems.find(
      (item) =>
        item.id === problemId
    );


  /*
  ----------------------------------------
  PROBLEM NOT FOUND
  ----------------------------------------
  */

  if (!problem) {

    return res.status(404).json({

      success: false,

      message:
        "Problem not found"

    });

  }


  /*
  ----------------------------------------
  RETURN PROBLEM
  ----------------------------------------
  */

  res.json({

    success: true,

    problem: problem

  });

});


/*
========================================
SUBMIT CODE
========================================

This route receives the student's
submission.

Actual secure code execution will be
connected later.

========================================
*/

router.post("/submit", (req, res) => {

  const {
    problemId,
    language,
    code
  } = req.body;


  /*
  ----------------------------------------
  VALIDATION
  ----------------------------------------
  */

  if (!problemId) {

    return res.status(400).json({

      success: false,

      message:
        "Problem ID is required"

    });

  }


  if (!language) {

    return res.status(400).json({

      success: false,

      message:
        "Programming language is required"

    });

  }


  if (!code || !code.trim()) {

    return res.status(400).json({

      success: false,

      message:
        "Code is required"

    });

  }


  /*
  ----------------------------------------
  FIND PROBLEM
  ----------------------------------------
  */

  const problem =
    problems.find(
      (item) =>
        item.id === Number(problemId)
    );


  if (!problem) {

    return res.status(404).json({

      success: false,

      message:
        "Problem not found"

    });

  }


  /*
  ----------------------------------------
  CHECK LANGUAGE
  ----------------------------------------
  */

  if (
    problem.language.toLowerCase() !==
    language.toLowerCase()
  ) {

    return res.status(400).json({

      success: false,

      message:
        "Selected language does not match the problem"

    });

  }


  /*
  ----------------------------------------
  TEMPORARY RESPONSE
  ----------------------------------------
  */

  res.json({

    success: true,

    message:
      "Code submission received successfully",

    submission: {

      problemId:
        problem.id,

      problemTitle:
        problem.title,

      language:
        language,

      codeLength:
        code.length

    },

    execution: {

      status:
        "pending",

      message:
        "Secure code execution engine will be connected next"

    }

  });

});


/*
========================================
EXPORT ROUTER
========================================
*/

module.exports = router;