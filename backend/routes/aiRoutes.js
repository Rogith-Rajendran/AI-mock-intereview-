/*
========================================
CAREERAI ARTIFICIAL INTELLIGENCE ENGINE
========================================

This system analyzes the student's:

- Academic profile
- Skills
- Interests
- Coding performance
- Technical quiz performance
- Interview performance
- Overall job readiness

The AI identifies:

- Student strengths
- Student weaknesses
- Skill gaps
- Suitable career paths
- Personalized learning roadmap

This AI engine will later support:

1. AI HR Interview
2. Higher Studies Guidance
3. Business Guidance
4. Final Career Report

========================================
*/

const express = require("express");

const router = express.Router();


/*
========================================
GEMINI CLIENT
========================================
*/

let geminiAI = null;


/*
========================================
INITIALIZE GEMINI
========================================
*/

async function getGeminiAI() {

  if (!geminiAI) {

    const {
      GoogleGenAI
    } = await import("@google/genai");


    geminiAI = new GoogleGenAI({

      apiKey:
        process.env.GEMINI_API_KEY

    });

  }


  return geminiAI;

}


/*
========================================
TEST ROUTE
========================================
*/

router.get("/test", (req, res) => {

  res.json({

    success: true,

    message:
      "CareerAI Gemini AI route is working"

  });

});


/*
========================================
AI CAREER ANALYSIS
========================================
*/

router.post("/analyze", async (req, res) => {

  try {

    /*
    ----------------------------------------
    GET STUDENT DATA
    ----------------------------------------
    */

    const {

      profile,

      coding,

      quiz,

      interview,

      readiness

    } = req.body;


    /*
    ----------------------------------------
    VALIDATION
    ----------------------------------------
    */

    if (!profile) {

      return res.status(400).json({

        success: false,

        message:
          "Student profile is required"

      });

    }


    /*
    ----------------------------------------
    CHECK API KEY
    ----------------------------------------
    */

    if (!process.env.GEMINI_API_KEY) {

      return res.status(500).json({

        success: false,

        message:
          "Gemini API key is not configured"

      });

    }


    /*
    ----------------------------------------
    GEMINI CLIENT
    ----------------------------------------
    */

    const ai =
      await getGeminiAI();


    /*
    ----------------------------------------
    STUDENT DATA
    ----------------------------------------
    */

    const studentData = {

      profile:
        profile || {},

      coding:
        coding || {},

      quiz:
        quiz || {},

      interview:
        interview || {},

      readiness:
        readiness || {}

    };


    /*
    ----------------------------------------
    AI INSTRUCTION
    ----------------------------------------
    */

    const prompt = `

You are CareerAI, an intelligent career
guidance system for college students.

Your job is to analyze the student's complete
profile and performance.

STUDENT DATA:

${JSON.stringify(
  studentData,
  null,
  2
)}


Analyze the student carefully.

Identify:

1. Strengths
2. Weaknesses
3. Skill gaps
4. Suitable career paths
5. Personalized learning roadmap
6. Higher study suggestions
7. Job preparation suggestions


IMPORTANT:

- Do not invent information about the student.
- Base the analysis on the supplied data.
- Be realistic.
- Give practical recommendations.
- Explain why each recommendation is suitable.
- Focus on helping the student improve.
- Do not make decisions based on protected characteristics.
- Do not claim to diagnose personality or mental health.


Return ONLY valid JSON using this structure:

{
  "summary": "short overall analysis",

  "strengths": [
    "strength 1",
    "strength 2"
  ],

  "weaknesses": [
    "weakness 1",
    "weakness 2"
  ],

  "skillGaps": [
    "skill gap 1",
    "skill gap 2"
  ],

  "recommendedCareers": [
    {
      "career": "career name",
      "reason": "why this career fits"
    }
  ],

  "higherStudies": [
    {
      "program": "program name",
      "reason": "why this program may fit"
    }
  ],

  "jobPreparation": [
    "recommendation 1",
    "recommendation 2"
  ],

  "roadmap": [
    {
      "step": 1,
      "title": "step title",
      "description": "what the student should do"
    }
  ],

  "overallAssessment": {
    "score": 0,
    "level": "Beginner"
  }
}

The score must be between 0 and 100.

The level must be one of:

Beginner
Developing
Intermediate
Job Ready

`;


    /*
    ----------------------------------------
    CALL GEMINI
    ----------------------------------------
    */

    const response =
      await ai.models.generateContent({

        model:
          "gemini-3.6-flash",

        contents:
          prompt,

        config: {

          responseMimeType:
            "application/json"

        }

      });


    /*
    ----------------------------------------
    GET AI RESPONSE
    ----------------------------------------
    */

    const responseText =
      response.text;


    /*
    ----------------------------------------
    PARSE JSON
    ----------------------------------------
    */

    let analysis;


    try {

      analysis =
        JSON.parse(responseText);

    } catch (parseError) {

      console.error(
        "Gemini returned invalid JSON:",
        responseText
      );


      return res.status(500).json({

        success: false,

        message:
          "Gemini returned an invalid analysis"

      });

    }


    /*
    ----------------------------------------
    RETURN RESULT
    ----------------------------------------
    */

    res.json({

      success: true,

      message:
        "AI career analysis generated successfully",

      analysis:

        analysis

    });

  }

  catch (error) {

    console.error(
      "Gemini AI Error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "AI career analysis failed",

      error:
        error.message

    });

  }

});


/*
========================================
EXPORT ROUTER
========================================
*/

module.exports = router;