const express = require("express");

const router = express.Router();

/*
====================================================
CAREERAI - AI HR INTERVIEW
====================================================

EXACT INTERVIEW STRUCTURE

Question 1:
Introduction

Question 2:
Technical

Question 3:
Technical

Question 4:
Technical

Question 5:
Technical

Question 6:
Technical

Question 7:
Feedback

After Question 7:
Interview finishes.

The server NEVER generates Question 8.
====================================================
*/


/*
====================================================
GEMINI
====================================================
*/

let geminiAI = null;

async function getGeminiAI() {

  if (!process.env.GEMINI_API_KEY) {

    throw new Error(
      "GEMINI_API_KEY is not configured in .env"
    );

  }

  if (!geminiAI) {

    const {
      GoogleGenAI
    } = await import(
      "@google/genai"
    );

    geminiAI =
      new GoogleGenAI({
        apiKey:
          process.env.GEMINI_API_KEY
      });

  }

  return geminiAI;
}


/*
====================================================
MODEL
====================================================
*/

const GEMINI_MODEL =
  "gemini-3.6-flash";


/*
====================================================
INTERVIEW CONFIGURATION
====================================================
*/

const TOTAL_QUESTIONS = 7;


/*
====================================================
SAFE TEXT
====================================================
*/

function safeText(
  value,
  fallback = ""
) {

  if (
    value === undefined ||
    value === null
  ) {
    return fallback;
  }

  return String(
    value
  ).trim();
}


/*
====================================================
SAFE NUMBER
====================================================
*/

function safeNumber(
  value,
  fallback = 0
) {

  const number =
    Number(value);

  if (
    Number.isFinite(number)
  ) {
    return number;
  }

  return fallback;
}


/*
====================================================
CLEAN GEMINI RESPONSE
====================================================
*/

function cleanGeminiText(
  text
) {

  if (!text) {
    return "";
  }

  let result =
    String(text).trim();

  result =
    result
      .replace(
        /^```json/i,
        ""
      )
      .replace(
        /^```/i,
        ""
      )
      .replace(
        /```$/i,
        ""
      )
      .trim();

  return result;
}


/*
====================================================
WAIT
====================================================
*/

function wait(
  milliseconds
) {

  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        milliseconds
      )
  );
}


/*
====================================================
GENERATE GEMINI RESPONSE
====================================================

Includes retry handling for temporary
connection failures.
====================================================
*/

async function generateGemini(
  prompt
) {

  const ai =
    await getGeminiAI();

  const MAX_RETRIES = 3;

  let lastError = null;

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {

    try {

      console.log(
        `Gemini request attempt ${attempt}/${MAX_RETRIES}`
      );

      const response =
        await ai.models.generateContent({

          model:
            GEMINI_MODEL,

          contents:
            prompt,

        });

      const text =
        response?.text ||
        "";

      const cleaned =
        cleanGeminiText(
          text
        );

      if (!cleaned) {

        throw new Error(
          "Gemini returned an empty response."
        );

      }

      console.log(
        "Gemini response received successfully."
      );

      return cleaned;

    } catch (error) {

      lastError =
        error;

      console.error(
        `Gemini attempt ${attempt} failed:`,
        error?.message ||
        error
      );

      if (
        attempt <
        MAX_RETRIES
      ) {

        const delay =
          attempt * 2000;

        console.log(
          `Retrying Gemini in ${delay / 1000} seconds...`
        );

        await wait(
          delay
        );
      }
    }
  }

  throw new Error(
    `Gemini request failed after ${MAX_RETRIES} attempts: ${
      lastError?.message ||
      "Unknown Gemini error"
    }`
  );
}


/*
====================================================
TEST
====================================================
*/

router.get(
  "/test",
  (req, res) => {

    res.json({

      success:
        true,

      message:
        "CareerAI AI HR route is working.",

      model:
        GEMINI_MODEL,

      totalQuestions:
        TOTAL_QUESTIONS,

      structure: {
        question1:
          "Introduction",

        questions2to6:
          "Technical",

        question7:
          "Feedback",
      },

    });

  }
);


/*
====================================================
START INTERVIEW
====================================================
*/

router.post(
  "/start",
  async (req, res) => {

    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      "AI HR START REQUEST RECEIVED"
    );
    console.log(
      "======================================"
    );

    try {

      const {
        user,
        resume,
        resumeText,
        aptitude,
        coding,
        gd,
        role
      } = req.body || {};


      const candidateName =
        safeText(
          user?.name,
          "Candidate"
        );

      const candidateRole =
        safeText(
          role,
          "Software Developer"
        );

      const resumeContent =
        safeText(
          resumeText,
          ""
        );

      const aptitudeScore =
        safeNumber(
          aptitude,
          0
        );

      const codingScore =
        safeNumber(
          coding,
          0
        );

      const gdScore =
        safeNumber(
          gd,
          0
        );


      console.log(
        "Candidate:",
        candidateName
      );

      console.log(
        "Role:",
        candidateRole
      );

      console.log(
        "Resume text length:",
        resumeContent.length
      );

      console.log(
        "Aptitude:",
        aptitudeScore
      );

      console.log(
        "Coding:",
        codingScore
      );

      console.log(
        "GD:",
        gdScore
      );


      /*
      ============================================
      QUESTION 1
      ============================================

      We don't need Gemini to decide the
      introduction question.

      This guarantees Q1 is always introduction.
      ============================================
      */

      const firstQuestion =
        `Hello ${candidateName}, welcome to the interview. Could you please tell me about yourself, your educational background, and what interests you about becoming a Software Developer?`;


      console.log(
        "FIRST QUESTION:",
        firstQuestion
      );


      return res.json({

        success:
          true,

        question:
          firstQuestion,

        questionNumber:
          1,

        totalQuestions:
          TOTAL_QUESTIONS,

        category:
          "HR",

        interviewStarted:
          true,

      });

    } catch (error) {

      console.error(
        "AI HR START ERROR:",
        error
      );

      return res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to start AI HR interview.",

        error:
          error?.message ||
          "Unknown error",

      });

    }

  }
);


/*
====================================================
ANSWER
====================================================
*/

router.post(
  "/answer",
  async (req, res) => {

    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      "AI HR ANSWER REQUEST RECEIVED"
    );
    console.log(
      "======================================"
    );

    try {

      const {
        user,
        question,
        answer,
        questionNumber,
        totalQuestions,
        history,
        resumeText,
        aptitude,
        coding,
        gd,
        role
      } = req.body || {};


      const candidateName =
        safeText(
          user?.name,
          "Candidate"
        );

      const currentQuestion =
        safeText(
          question
        );

      const candidateAnswer =
        safeText(
          answer
        );

      /*
      IMPORTANT:
      The server ALWAYS uses 7.

      It does NOT trust a larger number
      sent by the frontend.
      */

      const currentNumber =
        safeNumber(
          questionNumber,
          1
        );


      if (!currentQuestion) {

        return res.status(
          400
        ).json({

          success:
            false,

          message:
            "Interview question is required.",

        });

      }


      if (!candidateAnswer) {

        return res.status(
          400
        ).json({

          success:
            false,

          message:
            "Candidate answer is required.",

        });

      }


      console.log(
        "Candidate:",
        candidateName
      );

      console.log(
        "Question number:",
        currentNumber
      );

      console.log(
        "Answer:",
        candidateAnswer
      );


      /*
      ============================================
      HISTORY
      ============================================
      */

      const previousHistory =
        Array.isArray(history)
          ? history
          : [];


      const updatedHistory = [

        ...previousHistory,

        {
          question:
            currentQuestion,

          answer:
            candidateAnswer,
        },

      ];


      /*
      ============================================
      QUESTION 7
      ============================================

      NEVER GENERATE QUESTION 8.

      ============================================
      */

      if (
        currentNumber >=
        TOTAL_QUESTIONS
      ) {

        console.log(
          "Question 7 completed."
        );

        console.log(
          "Interview finished."
        );


        return res.json({

          success:
            true,

          finished:
            true,

          completed:
            true,

          question:
            null,

          nextQuestion:
            null,

          questionNumber:
            TOTAL_QUESTIONS,

          totalQuestions:
            TOTAL_QUESTIONS,

          history:
            updatedHistory,

        });

      }


      /*
      ============================================
      QUESTION 2 TO QUESTION 6
      ============================================

      ONLY TECHNICAL QUESTIONS.
      ============================================
      */

      const nextNumber =
        currentNumber + 1;


      /*
      --------------------------------------------
      PREPARE HISTORY
      --------------------------------------------
      */

      const historyText =
        updatedHistory
          .map(
            (item, index) => {

              return `
Question ${index + 1}:
${safeText(item.question)}

Candidate Answer:
${safeText(item.answer)}
`;

            }
          )
          .join("\n");


      /*
      ============================================
      QUESTION 7
      ============================================

      If the next question is Q7, don't ask
      Gemini to invent a question.

      Use a fixed feedback question.
      ============================================
      */

      if (
        nextNumber === 7
      ) {

        const feedbackQuestion =
          "Before we conclude the interview, do you have any feedback about this interview experience or anything else you would like to share?";


        console.log(
          "NEXT QUESTION: Feedback"
        );


        return res.json({

          success:
            true,

          finished:
            false,

          question:
            feedbackQuestion,

          nextQuestion:
            feedbackQuestion,

          questionNumber:
            7,

          totalQuestions:
            TOTAL_QUESTIONS,

          category:
            "Feedback",

          history:
            updatedHistory,

        });

      }


      /*
      ============================================
      TECHNICAL QUESTION PROMPT
      ============================================
      */

      const prompt = `

You are CareerAI conducting a professional
technical interview for a Software Developer.

This is technical interview question
number ${nextNumber} of 7.

Candidate:
${candidateName}

Target role:
${safeText(
  role,
  "Software Developer"
)}

Previous performance:

Aptitude:
${safeNumber(
  aptitude,
  0
)}%

Coding:
${safeNumber(
  coding,
  0
)}%

Group Discussion:
${safeNumber(
  gd,
  0
)}%

Resume information:
${safeText(
  resumeText,
  "Not available"
)}

Previous interview conversation:

${historyText}

The candidate has just answered the previous
interview question.

Generate ONE technical interview question
for a Software Developer.

Technical areas can include:

- Programming
- Data Structures
- Algorithms
- Object-Oriented Programming
- DBMS
- SQL
- Operating Systems
- Computer Networks
- Web Development
- Software Engineering
- Programming language concepts

If the resume contains specific technical
skills, you may ask a question related to
those skills.

Rules:

1. Ask exactly ONE technical question.
2. The question must be suitable for a college
   placement interview.
3. Do not ask HR questions.
4. Do not ask behavioral questions.
5. Do not ask motivational questions.
6. Do not ask multiple questions together.
7. Do not provide the answer.
8. Do not mention Gemini.
9. Do not mention AI.
10. Do not mention internal scoring.
11. Do not invent resume information.
12. Keep the question concise.
13. Do not repeat an earlier question.

Return ONLY the question.
Do not return JSON.
Do not use markdown.

`;


      console.log(
        `Generating technical Question ${nextNumber}...`
      );


      const nextQuestion =
        await generateGemini(
          prompt
        );


      if (!nextQuestion) {

        throw new Error(
          "Gemini returned an empty technical question."
        );

      }


      console.log(
        `QUESTION ${nextNumber}:`,
        nextQuestion
      );


      return res.json({

        success:
          true,

        finished:
          false,

        question:
          nextQuestion,

        nextQuestion:
          nextQuestion,

        questionNumber:
          nextNumber,

        totalQuestions:
          TOTAL_QUESTIONS,

        category:
          "Technical",

        history:
          updatedHistory,

      });

    } catch (error) {

      console.error(
        "AI HR ANSWER ERROR:"
      );

      console.error(
        error
      );


      return res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to process your interview answer.",

        error:
          error?.message ||
          "Unknown AI HR error",

      });

    }

  }
);


/*
====================================================
RESPOND
====================================================

Alias for /answer.

====================================================
*/

router.post(
  "/respond",
  async (req, res) => {

    /*
    For compatibility with any older frontend,
    simply use the same endpoint logic by
    forwarding the request internally.

    The frontend we are using now calls /answer,
    but this endpoint remains available.
    */

    try {

      const {
        user,
        question,
        answer,
        questionNumber,
        totalQuestions,
        history,
        resumeText,
        aptitude,
        coding,
        gd,
        role
      } = req.body || {};


      /*
      Reuse the answer route by calling
      the same processing logic through
      an HTTP request is unnecessary.

      Instead return a compatibility message
      telling the client to use /answer.
      */

      return res.status(
        200
      ).json({

        success:
          true,

        message:
          "Use /api/ai-hr/answer for interview responses.",

        redirectEndpoint:
          "/api/ai-hr/answer",

      });

    } catch (error) {

      console.error(
        "AI HR RESPOND ERROR:",
        error
      );

      return res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to process AI HR response.",

        error:
          error?.message ||
          "Unknown error",

      });

    }

  }
);


/*
====================================================
EVALUATE
====================================================
*/

router.post(
  "/evaluate",
  async (req, res) => {

    console.log(
      "AI HR EVALUATION REQUEST RECEIVED"
    );


    try {

      const {
        user,
        history,
        resumeText,
        aptitude,
        coding,
        gd,
        role
      } = req.body || {};


      const candidateName =
        safeText(
          user?.name,
          "Candidate"
        );


      const interviewHistory =
        Array.isArray(history)
          ? history
          : [];


      if (
        interviewHistory.length === 0
      ) {

        return res.status(
          400
        ).json({

          success:
            false,

          message:
            "Interview history is required.",

        });

      }


      const historyText =
        interviewHistory
          .map(
            (item, index) => {

              return `
Question ${index + 1}:
${safeText(item.question)}

Candidate Answer:
${safeText(item.answer)}
`;

            }
          )
          .join("\n");


      const prompt = `

You are CareerAI evaluating a completed
Software Developer interview.

Candidate:
${candidateName}

Target role:
${safeText(
  role,
  "Software Developer"
)}

Previous assessment performance:

Aptitude:
${safeNumber(
  aptitude,
  0
)}%

Coding:
${safeNumber(
  coding,
  0
)}%

Group Discussion:
${safeNumber(
  gd,
  0
)}%

Resume:
${safeText(
  resumeText,
  "Not available"
)}

COMPLETED AI HR INTERVIEW:

${historyText}

Evaluate the candidate based ONLY on the
information supplied above.

Return ONLY valid JSON.

Use exactly this structure:

{
  "overallScore": 0,
  "communicationScore": 0,
  "confidenceScore": 0,
  "technicalAwarenessScore": 0,
  "professionalismScore": 0,
  "hrFitScore": 0,
  "strengths": [],
  "improvements": [],
  "summary": "",
  "recommendation": "",
  "completed": true
}

Rules:

- Scores must be integers from 0 to 100.
- Evaluate the technical answers carefully.
- Evaluate communication based on the answers.
- Evaluate professionalism.
- Do not use protected characteristics.
- Do not diagnose personality or mental health.
- Do not invent facts.
- Keep recommendations practical.

`;


      const result =
        await generateGemini(
          prompt
        );


      let evaluation;


      try {

        evaluation =
          JSON.parse(
            result
          );

      } catch (parseError) {

        console.error(
          "Invalid Gemini evaluation:",
          result
        );


        evaluation = {

          overallScore:
            0,

          communicationScore:
            0,

          confidenceScore:
            0,

          technicalAwarenessScore:
            0,

          professionalismScore:
            0,

          hrFitScore:
            0,

          strengths:
            [],

          improvements:
            [],

          summary:
            "Unable to parse AI evaluation.",

          recommendation:
            "Please review the interview manually.",

          completed:
            true,
        };

      }


      return res.json({

        success:
          true,

        evaluation:
          evaluation,

      });

    } catch (error) {

      console.error(
        "AI HR EVALUATE ERROR:",
        error
      );


      return res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to evaluate AI HR interview.",

        error:
          error?.message ||
          "Unknown AI HR error",

      });

    }

  }
);


/*
====================================================
FINISH
====================================================

Called after Question 7.

====================================================
*/

router.post(
  "/finish",
  async (req, res) => {

    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      "AI HR FINISH REQUEST RECEIVED"
    );
    console.log(
      "======================================"
    );


    try {

      const {
        user,
        history,
        resumeText,
        aptitude,
        coding,
        gd,
        role
      } = req.body || {};


      const interviewHistory =
        Array.isArray(history)
          ? history
          : [];


      if (
        interviewHistory.length === 0
      ) {

        return res.status(
          400
        ).json({

          success:
            false,

          message:
            "Interview history is required.",

        });

      }


      /*
      IMPORTANT:

      The interview must have exactly
      7 answers before final evaluation.
      */

      if (
        interviewHistory.length <
        TOTAL_QUESTIONS
      ) {

        return res.status(
          400
        ).json({

          success:
            false,

          message:
            `Interview is incomplete. Expected ${TOTAL_QUESTIONS} answers but received ${interviewHistory.length}.`,

        });

      }


      const candidateName =
        safeText(
          user?.name,
          "Candidate"
        );


      const historyText =
        interviewHistory
          .slice(
            0,
            TOTAL_QUESTIONS
          )
          .map(
            (item, index) => {

              return `
Question ${index + 1}:
${safeText(item.question)}

Candidate Answer:
${safeText(item.answer)}
`;

            }
          )
          .join("\n");


      const prompt = `

You are CareerAI.

You are evaluating a completed
7-question Software Developer interview.

Interview structure:

Question 1:
Introduction

Questions 2-6:
Technical questions

Question 7:
Candidate feedback

Candidate:
${candidateName}

Target role:
${safeText(
  role,
  "Software Developer"
)}

Previous performance:

Aptitude:
${safeNumber(
  aptitude,
  0
)}%

Coding:
${safeNumber(
  coding,
  0
)}%

Group Discussion:
${safeNumber(
  gd,
  0
)}%

Resume:
${safeText(
  resumeText,
  "Not available"
)}

COMPLETE INTERVIEW:

${historyText}

Evaluate the candidate.

Return ONLY valid JSON.

Use exactly this structure:

{
  "overallScore": 0,
  "communicationScore": 0,
  "confidenceScore": 0,
  "technicalAwarenessScore": 0,
  "professionalismScore": 0,
  "hrFitScore": 0,
  "strengths": [],
  "improvements": [],
  "summary": "",
  "recommendation": "",
  "completed": true
}

Rules:

- Scores must be integers from 0 to 100.
- Evaluate technical knowledge from Questions 2-6.
- Evaluate communication from all answers.
- Evaluate professionalism.
- Consider the candidate's previous performance.
- Do not use protected characteristics.
- Do not diagnose personality or mental health.
- Do not invent information.
- Keep the recommendation practical.
- The feedback in Question 7 should not be treated
  as a technical answer.

`;


      console.log(
        "Generating final AI HR evaluation..."
      );


      const result =
        await generateGemini(
          prompt
        );


      let evaluation;


      try {

        evaluation =
          JSON.parse(
            result
          );

      } catch (parseError) {

        console.error(
          "Invalid Gemini final evaluation:",
          result
        );


        evaluation = {

          overallScore:
            0,

          communicationScore:
            0,

          confidenceScore:
            0,

          technicalAwarenessScore:
            0,

          professionalismScore:
            0,

          hrFitScore:
            0,

          strengths:
            [],

          improvements:
            [],

          summary:
            "Interview completed, but the AI evaluation could not be parsed.",

          recommendation:
            "Please review the interview manually.",

          completed:
            true,

        };

      }


      console.log(
        "AI HR FINAL EVALUATION COMPLETED"
      );


      return res.json({

        success:
          true,

        completed:
          true,

        evaluation:
          evaluation,

        history:
          interviewHistory.slice(
            0,
            TOTAL_QUESTIONS
          ),

      });

    } catch (error) {

      console.error(
        "AI HR FINISH ERROR:",
        error
      );


      return res.status(
        500
      ).json({

        success:
          false,

        message:
          "Unable to finish AI HR interview.",

        error:
          error?.message ||
          "Unknown AI HR error",

      });

    }

  }
);


/*
====================================================
EXPORT
====================================================
*/

module.exports =
  router;