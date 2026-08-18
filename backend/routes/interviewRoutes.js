const express = require("express");

const router = express.Router();

const interviewQuestions =
  require("../data/interviewQuestions");


/*
========================================
TEST INTERVIEW ROUTE
========================================
*/

router.get("/test", (req, res) => {

  res.json({

    success: true,

    message:
      "Interview route is working"

  });

});


/*
========================================
GET ALL INTERVIEW QUESTIONS
========================================
*/

router.get("/questions", (req, res) => {

  res.json({

    success: true,

    count:
      interviewQuestions.length,

    questions:
      interviewQuestions

  });

});


/*
========================================
GET QUESTIONS BY CATEGORY
========================================

Example:

/api/interview/questions?category=JavaScript

========================================
*/

router.get(
  "/questions/category/:category",
  (req, res) => {

    const category =
      req.params.category;


    const filteredQuestions =
      interviewQuestions.filter(
        (question) =>
          question.category.toLowerCase() ===
          category.toLowerCase()
      );


    res.json({

      success: true,

      category:
        category,

      count:
        filteredQuestions.length,

      questions:
        filteredQuestions

    });

  }
);


/*
========================================
GET QUESTIONS BY ROLE
========================================

Example:

/api/interview/questions/role/Full%20Stack%20Developer

========================================
*/

router.get(
  "/questions/role/:role",
  (req, res) => {

    const role =
      req.params.role;


    const filteredQuestions =
      interviewQuestions.filter(
        (question) =>
          question.role.toLowerCase() ===
          role.toLowerCase()
      );


    res.json({

      success: true,

      role:
        role,

      count:
        filteredQuestions.length,

      questions:
        filteredQuestions

    });

  }
);


/*
========================================
GET ONE QUESTION
========================================

Example:

/api/interview/questions/1

========================================
*/

router.get(
  "/questions/:id",
  (req, res) => {

    const questionId =
      Number(req.params.id);


    const question =
      interviewQuestions.find(
        (item) =>
          item.id === questionId
      );


    if (!question) {

      return res.status(404).json({

        success: false,

        message:
          "Interview question not found"

      });

    }


    res.json({

      success: true,

      question:
        question

    });

  }
);


/*
========================================
EXPORT ROUTER
========================================
*/

module.exports = router;