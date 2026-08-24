const express = require("express");

const router = express.Router();


// ========================================
// GEMINI CLIENT
// ========================================

let geminiAI = null;


async function getGeminiAI() {

  if (!geminiAI) {

    const {
      GoogleGenAI
    } = await import("@google/genai");

    geminiAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

  }

  return geminiAI;
}


// ========================================
// TEST ROUTE
// ========================================

router.get("/", (req, res) => {

  res.json({
    success: true,
    message: "CareerAI AI HR backend is working"
  });

});


// ========================================
// START AI HR INTERVIEW
// ========================================

router.post("/start", async (req, res) => {

  console.log("=================================");
  console.log("NEW AI HR /start ROUTE HIT");
  console.log("=================================");

  try {

    const {
      userId,
      resume,
      round1,
      round2,
      round3
    } = req.body;


    // ========================================
    // VALIDATE USER
    // ========================================

    if (!userId) {

      return res.status(400).json({
        success: false,
        message: "User ID is required."
      });

    }


    // ========================================
    // VALIDATE RESUME
    // ========================================

    if (!resume) {

      return res.status(400).json({
        success: false,
        message: "Resume is required."
      });

    }


    // ========================================
    // VALIDATE GEMINI KEY
    // ========================================

    if (!process.env.GEMINI_API_KEY) {

      console.error(
        "GEMINI_API_KEY is missing."
      );

      return res.status(500).json({
        success: false,
        message:
          "Gemini API key is not configured."
      });

    }


    // ========================================
    // GET ROUND SCORES
    // ========================================

    const aptitudeScore =
      round1?.percentage ??
      round1?.score ??
      0;


    const codingScore =
      round2?.percentage ??
      round2?.score ??
      0;


    const gdScore =
      round3?.percentage ??
      round3?.score ??
      round3?.overall ??
      0;


    // ========================================
    // GET RESUME TEXT
    // ========================================

    const resumeText =
      resume?.text ||
      resume?.resumeText ||
      resume?.parsedText ||
      resume?.extractedText ||
      "";


    console.log(
      "User ID:",
      userId
    );

    console.log(
      "Resume file:",
      resume?.fileName ||
      resume?.originalName ||
      "Unknown"
    );

    console.log(
      "Resume text available:",
      Boolean(resumeText)
    );

    console.log(
      "Resume text length:",
      resumeText.length
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


    // ========================================
    // GEMINI CLIENT
    // ========================================

    const ai =
      await getGeminiAI();


    // ========================================
    // AI HR PROMPT
    // ========================================

    const prompt = `

You are CareerAI's AI HR interviewer.

You are conducting the FINAL INTERVIEW
for a college student.

Your job is to ask personalized questions
based on the candidate's resume and
performance in the previous three rounds.


========================================
CANDIDATE
========================================

User ID:
${userId}


========================================
RESUME
========================================

${resumeText || "The actual resume text is unavailable. Do not invent resume information."}


========================================
PREVIOUS ROUND PERFORMANCE
========================================

Round 1 - Aptitude:
${aptitudeScore}%

Round 2 - Coding:
${codingScore}%

Round 3 - Group Discussion:
${gdScore}%


========================================
INTERVIEW OBJECTIVE
========================================

Analyze the candidate's supplied information.

The interview should be personalized.

If the resume contains Java,
ask questions related to Java when appropriate.

If the resume contains Spring Boot,
ask questions related to Spring Boot when appropriate.

If the resume contains backend development,
ask backend questions when appropriate.

If the resume contains React,
ask React/web-development questions when appropriate.

If the resume contains projects,
ask questions about those projects.

If the resume contains internships,
ask about those internships.

If the resume contains technical skills,
ask questions about those skills.

Do NOT invent skills,
projects,
companies,
internships,
experience,
or technologies.

Only use information actually supplied.


========================================
USE PERFORMANCE
========================================

Use the previous round scores to personalize
the interview.

A low aptitude score may justify
problem-solving questions.

A low coding score may justify
additional technical questions.

A low GD score may justify
communication, teamwork and situational questions.

A high coding score may justify
deeper technical questions.

The interview should not consist only
of questions from the lowest score.

It should evaluate the candidate
as a complete candidate.


========================================
QUESTION TYPES
========================================

The interview can contain:

1. Introduction
2. Resume questions
3. Project questions
4. Technical questions
5. Behavioral questions
6. Situational questions
7. Career questions
8. Strength and weakness questions


========================================
IMPORTANT
========================================

Ask ONLY ONE question.

Do not ask multiple questions.

Do not provide the answer.

Do not provide an explanation to the candidate.

Do not make up information.

Return ONLY valid JSON.


========================================
FIRST QUESTION
========================================

Generate the first interview question.

The first question should normally be
an appropriate opening HR question.

Return exactly:

{
  "question": "question here",
  "category": "HR",
  "reason": "short reason"
}

`;


    console.log(
      "Sending request to Gemini..."
    );


    // ========================================
    // CALL GEMINI
    // ========================================

    const response =
      await ai.models.generateContent({

        model:
          "gemini-2.5-flash",

        contents:
          prompt,

        config: {

          responseMimeType:
            "application/json"

        }

      });


    // ========================================
    // GET GEMINI RESPONSE
    // ========================================

    const responseText =
      response.text;


    console.log(
      "Gemini response received."
    );


    console.log(
      "Gemini response:",
      responseText
    );


    // ========================================
    // PARSE JSON
    // ========================================

    let result;


    try {

      result =
        JSON.parse(responseText);

    } catch (error) {

      console.error(
        "Gemini returned invalid JSON:",
        responseText
      );

      return res.status(500).json({

        success: false,

        message:
          "Gemini returned invalid interview data."

      });

    }


    // ========================================
    // CHECK QUESTION
    // ========================================

    if (!result.question) {

      return res.status(500).json({

        success: false,

        message:
          "Gemini did not generate a question."

      });

    }


    // ========================================
    // SEND QUESTION TO FRONTEND
    // ========================================

    return res.json({

      success: true,

      message:
        "AI HR interview started successfully.",

      question:
        result.question,

      category:
        result.category ||
        "HR",

      reason:
        result.reason ||
        "",

      performance: {

        aptitude:
          aptitudeScore,

        coding:
          codingScore,

        gd:
          gdScore

      }

    });

  }

  catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "AI HR ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================="
    );


    return res.status(500).json({

      success: false,

      message:
        "Unable to generate AI HR question.",

      error:
        error.message

    });

  }

});


module.exports = router;