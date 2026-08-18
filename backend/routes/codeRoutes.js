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

    message:
      "Code route is working"

  });

});


/*
========================================
GET ALL CODING PROBLEMS
========================================
*/

router.get("/problems", (req, res) => {

  const language =
    req.query.language;


  if (!language) {

    return res.json({

      success: true,

      count:
        problems.length,

      problems:
        problems

    });

  }


  const filteredProblems =
    problems.filter(
      (problem) =>
        problem.language.toLowerCase() ===
        language.toLowerCase()
    );


  res.json({

    success: true,

    language:
      language,

    count:
      filteredProblems.length,

    problems:
      filteredProblems

  });

});


/*
========================================
GET ONE CODING PROBLEM
========================================
*/

router.get(
  "/problems/:id",
  (req, res) => {

    const problemId =
      Number(req.params.id);


    const problem =
      problems.find(
        (item) =>
          item.id === problemId
      );


    if (!problem) {

      return res.status(404).json({

        success: false,

        message:
          "Problem not found"

      });

    }


    res.json({

      success: true,

      problem:
        problem

    });

  }
);


/*
========================================
CONTROLLED CODE EVALUATOR
========================================

This first version does NOT execute
arbitrary student code on the server.

Instead, it checks whether the submitted
code contains the required programming
logic for the supported beginner problems.

A real production platform should later
use an isolated sandbox/container.
========================================
*/


function evaluateCode(
  problem,
  language,
  code
) {

  const normalizedCode =
    code
      .toLowerCase()
      .replace(/\s+/g, " ");


  /*
  ========================================
  JAVASCRIPT
  ========================================
  */

  if (
    language === "javascript"
  ) {

    /*
    ----------------------------------------
    REVERSE STRING
    ----------------------------------------
    */

    if (problem.id === 1) {

      const hasReverseLogic =

        normalizedCode.includes(
          ".split("
        ) &&

        normalizedCode.includes(
          ".reverse("
        ) &&

        normalizedCode.includes(
          ".join("
        );


      if (hasReverseLogic) {

        return {

          passed: true,

          status: "accepted",

          message:
            "All test cases passed."

        };

      }


      return {

        passed: false,

        status: "wrong_answer",

        message:
          "Your solution does not appear to contain the required string-reversal logic."

      };

    }


    /*
    ----------------------------------------
    FIND LARGEST NUMBER
    ----------------------------------------
    */

    if (problem.id === 2) {

      const hasLargestLogic =

        normalizedCode.includes(
          "math.max"
        ) ||

        normalizedCode.includes(
          "math.max("
        ) ||

        (
          normalizedCode.includes(
            "max"
          ) &&
          (
            normalizedCode.includes(
              "reduce"
            ) ||
            normalizedCode.includes(
              "sort"
            )
          )
        );


      if (hasLargestLogic) {

        return {

          passed: true,

          status: "accepted",

          message:
            "All test cases passed."

        };

      }


      return {

        passed: false,

        status: "wrong_answer",

        message:
          "Your solution does not appear to contain logic for finding the largest number."

      };

    }

  }


  /*
  ========================================
  PYTHON
  ========================================
  */

  if (
    language === "python"
  ) {

    /*
    ----------------------------------------
    REVERSE STRING
    ----------------------------------------
    */

    if (problem.id === 3) {

      const hasReverseLogic =

        normalizedCode.includes(
          "[::-1]"
        ) ||

        normalizedCode.includes(
          "reversed("
        );


      if (hasReverseLogic) {

        return {

          passed: true,

          status: "accepted",

          message:
            "All test cases passed."

        };

      }


      return {

        passed: false,

        status: "wrong_answer",

        message:
          "Your solution does not appear to contain the required string-reversal logic."

      };

    }


    /*
    ----------------------------------------
    FIND MAXIMUM
    ----------------------------------------
    */

    if (problem.id === 4) {

      const hasMaximumLogic =

        normalizedCode.includes(
          "max("
        );


      if (hasMaximumLogic) {

        return {

          passed: true,

          status: "accepted",

          message:
            "All test cases passed."

        };

      }


      return {

        passed: false,

        status: "wrong_answer",

        message:
          "Your solution does not appear to contain logic for finding the maximum value."

      };

    }

  }


  /*
  ========================================
  JAVA
  ========================================
  */

  if (
    language === "java"
  ) {

    /*
    ----------------------------------------
    REVERSE STRING
    ----------------------------------------
    */

    if (problem.id === 5) {

      const hasReverseLogic =

        normalizedCode.includes(
          "reverse()"
        ) ||

        normalizedCode.includes(
          "stringbuilder"
        );


      if (hasReverseLogic) {

        return {

          passed: true,

          status: "accepted",

          message:
            "All test cases passed."

        };

      }


      return {

        passed: false,

        status: "wrong_answer",

        message:
          "Your solution does not appear to contain the required string-reversal logic."

      };

    }


    /*
    ----------------------------------------
    FIND LARGEST NUMBER
    ----------------------------------------
    */

    if (problem.id === 6) {

      const hasLargestLogic =

        normalizedCode.includes(
          "math.max"
        ) ||

        normalizedCode.includes(
          "max("
        );


      if (hasLargestLogic) {

        return {

          passed: true,

          status: "accepted",

          message:
            "All test cases passed."

        };

      }


      return {

        passed: false,

        status: "wrong_answer",

        message:
          "Your solution does not appear to contain logic for finding the largest number."

      };

    }

  }


  /*
  ========================================
  SQL
  ========================================
  */

  if (
    language === "sql"
  ) {

    /*
    ----------------------------------------
    SELECT ALL EMPLOYEES
    ----------------------------------------
    */

    if (problem.id === 7) {

      const normalizedSql =
        normalizedCode
          .replace(/\s+/g, " ")
          .trim();


      const validQuery =
        normalizedSql.includes(
          "select * from employees"
        );


      if (validQuery) {

        return {

          passed: true,

          status: "accepted",

          message:
            "SQL query matches the expected solution."

        };

      }


      return {

        passed: false,

        status: "wrong_answer",

        message:
          "Your SQL query should select all records from the employees table."

      };

    }


    /*
    ----------------------------------------
    HIGH SALARY
    ----------------------------------------
    */

    if (problem.id === 8) {

      const normalizedSql =
        normalizedCode
          .replace(/\s+/g, " ")
          .trim();


      const validQuery =

        normalizedSql.includes(
          "select * from employees"
        ) &&

        normalizedSql.includes(
          "where"
        ) &&

        normalizedSql.includes(
          "salary > 50000"
        );


      if (validQuery) {

        return {

          passed: true,

          status: "accepted",

          message:
            "SQL query matches the expected solution."

        };

      }


      return {

        passed: false,

        status: "wrong_answer",

        message:
          "Your SQL query should find employees whose salary is greater than 50000."

      };

    }

  }


  /*
  ========================================
  UNSUPPORTED PROBLEM
  ========================================
  */

  return {

    passed: false,

    status: "not_supported",

    message:
      "This problem is not yet supported by the current evaluator."

  };

}


/*
========================================
SUBMIT CODE
========================================
*/

router.post(
  "/submit",
  (req, res) => {

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
          item.id ===
          Number(problemId)
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
    EVALUATE
    ----------------------------------------
    */

    const evaluation =
      evaluateCode(
        problem,
        language.toLowerCase(),
        code
      );


    /*
    ----------------------------------------
    RETURN RESULT
    ----------------------------------------
    */

    return res.json({

      success: true,

      message:
        evaluation.message,

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
          evaluation.status,

        passed:
          evaluation.passed,

        message:
          evaluation.message

      }

    });

  }
);


/*
========================================
EXPORT ROUTER
========================================
*/

module.exports = router;