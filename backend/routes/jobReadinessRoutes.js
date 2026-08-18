const express = require("express");

const router = express.Router();

const jobReadinessQuestions =
  require("../data/jobReadinessQuestions");


/*
========================================
TEST ROUTE
========================================
*/

router.get("/test", (req, res) => {

  res.json({

    success: true,

    message:
      "Job readiness route is working"

  });

});


/*
========================================
GET ALL QUESTIONS
========================================
*/

router.get("/questions", (req, res) => {

  res.json({

    success: true,

    count:
      jobReadinessQuestions.length,

    questions:
      jobReadinessQuestions

  });

});


/*
========================================
GET QUESTIONS BY CATEGORY
========================================
*/

router.get(
  "/questions/category/:category",
  (req, res) => {

    const category =
      req.params.category;


    const filteredQuestions =
      jobReadinessQuestions.filter(
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
GET ONE QUESTION
========================================
*/

router.get(
  "/questions/:id",
  (req, res) => {

    const questionId =
      Number(req.params.id);


    const question =
      jobReadinessQuestions.find(
        (item) =>
          item.id === questionId
      );


    if (!question) {

      return res.status(404).json({

        success: false,

        message:
          "Job readiness question not found"

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
SUBMIT ASSESSMENT
========================================

The frontend will send:

{
  "answers": [
    {
      "questionId": 1,
      "answer": "const"
    }
  ]
}

========================================
*/

router.post(
  "/submit",
  (req, res) => {

    const {
      answers
    } = req.body;


    if (!Array.isArray(answers)) {

      return res.status(400).json({

        success: false,

        message:
          "Answers must be provided as an array"

      });

    }


    let correctAnswers = 0;


    answers.forEach(
      (submittedAnswer) => {

        const question =
          jobReadinessQuestions.find(
            (item) =>
              item.id ===
              Number(
                submittedAnswer.questionId
              )
          );


        if (!question) {
          return;
        }


        if (
          question.correctAnswer ===
          submittedAnswer.answer
        ) {

          correctAnswers++;

        }

      }
    );


    const totalAnswered =
      answers.length;


    const totalQuestions =
      jobReadinessQuestions.length;


    const score =
      totalAnswered === 0
        ? 0
        : Math.round(
            (correctAnswers /
              totalAnswered) *
              100
          );


    let readinessLevel;


    if (score >= 80) {

      readinessLevel =
        "Job Ready";

    } else if (score >= 60) {

      readinessLevel =
        "Almost Ready";

    } else if (score >= 40) {

      readinessLevel =
        "Needs Improvement";

    } else {

      readinessLevel =
        "Beginner";

    }


    res.json({

      success: true,

      result: {

        correctAnswers:
          correctAnswers,

        totalAnswered:
          totalAnswered,

        totalQuestions:
          totalQuestions,

        score:
          score,

        readinessLevel:
          readinessLevel

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