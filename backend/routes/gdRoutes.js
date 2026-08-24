const express = require("express");

const router = express.Router();

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  "";

const GEMINI_MODEL =
  "gemini-3.6-flash";

// ========================================
// USED TOPICS
// ========================================

const usedTopics = new Set();


// ========================================
// LOCAL GD TOPICS
// ========================================

const topics = [
  "Remote work versus office work: which is better for software teams?",

  "Should AI coding assistants replace some entry-level software development tasks?",

  "Should companies prioritize cybersecurity over rapid product development?",

  "Is cloud computing making backend development easier or more complex?",

  "Should data privacy be treated as a fundamental requirement in software architecture?",

  "Can artificial intelligence improve software quality without reducing human responsibility?",

  "Microservices versus monolithic architecture: which is better for growing applications?",

  "Should software developers focus more on programming skills or problem-solving skills?",

  "Does automation create more jobs than it removes in the technology industry?",

  "Should companies use open-source software for critical business systems?",

  "Is technical knowledge more important than communication skills for software developers?",

  "Should organizations move completely to cloud-based infrastructure?",

  "How should software companies balance performance, security, and user experience?",

  "Will AI change the role of junior developers in the next few years?",

  "Should developers prioritize clean code or faster product delivery?",

  "Is continuous learning essential for a successful software engineering career?"
];


// ========================================
// LOCAL AI RESPONSES
// ========================================

function getFallbackResponse(
  studentAnswer,
  topic,
  conversation
) {
  const answer =
    String(studentAnswer || "")
      .trim();

  const lower =
    answer.toLowerCase();

  const previousAI =
    conversation
      .filter(
        message =>
          message.speaker === "ai"
      )
      .length;

  // ----------------------------------------
  // FIRST RESPONSE
  // ----------------------------------------

  if (previousAI <= 1) {
    return `That's a reasonable point. You mentioned "${answer.substring(
      0,
      120
    )}". However, let's look at the other side. In the context of "${topic}", what could be the biggest disadvantage of your approach?`;
  }


  // ----------------------------------------
  // SECURITY
  // ----------------------------------------

  if (
    lower.includes("security") ||
    lower.includes("privacy")
  ) {
    return "I agree that security is important. But security can also increase development time and cost. How would you balance security requirements with the need to deliver software quickly?";
  }


  // ----------------------------------------
  // AI
  // ----------------------------------------

  if (
    lower.includes("ai") ||
    lower.includes("artificial intelligence")
  ) {
    return "AI can certainly improve productivity, but productivity is not the only consideration. How do you think companies should ensure that developers still understand and take responsibility for the code produced by AI?";
  }


  // ----------------------------------------
  // REMOTE WORK
  // ----------------------------------------

  if (
    lower.includes("remote") ||
    lower.includes("office") ||
    lower.includes("work from home")
  ) {
    return "You have highlighted an important benefit of the work model. However, collaboration and communication can become challenging. What practical solution would you suggest to maintain strong teamwork?";
  }


  // ----------------------------------------
  // COST
  // ----------------------------------------

  if (
    lower.includes("cost") ||
    lower.includes("expensive") ||
    lower.includes("money")
  ) {
    return "Cost is an important business consideration. However, the cheapest solution is not always the most sustainable one. How would you evaluate long-term value instead of only the initial cost?";
  }


  // ----------------------------------------
  // PERFORMANCE
  // ----------------------------------------

  if (
    lower.includes("performance") ||
    lower.includes("speed")
  ) {
    return "Performance is important, but improving performance can sometimes increase complexity. How would you decide when performance optimization is actually necessary?";
  }


  // ----------------------------------------
  // GENERAL FOLLOW-UP
  // ----------------------------------------

  const responses = [
    "That's an interesting argument. Can you support your point with a practical example from the software industry?",

    "I understand your position. Now consider the opposite viewpoint. Why might another developer disagree with you?",

    "That's a valid perspective. How would your approach affect a company over the long term?",

    "You have explained your position clearly. What would be the biggest risk if a company followed your recommendation?",

    "Good point. Let's go deeper. Which factor should a company prioritize when making this decision, and why?",

    "I see your reasoning. Can you compare your approach with the alternative and explain why yours is better?",

    "That's reasonable. Now imagine you are the technical lead. What decision would you make and how would you justify it to your team?"
  ];

  return responses[
    (previousAI - 1) %
      responses.length
  ];
}


// ========================================
// GEMINI REQUEST
// ========================================

async function askGemini(
  studentAnswer,
  topic,
  conversation,
  role
) {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "Gemini API key is not configured."
    );
  }

  const conversationText =
    conversation
      .slice(-12)
      .map(
        message =>
          `${message.speaker}: ${message.text}`
      )
      .join("\n");

  const prompt = `
You are an AI participant in a real campus-placement Group Discussion.

Job role:
${role}

Discussion topic:
${topic}

Conversation:
${conversationText}

Latest student answer:
${studentAnswer}

Respond as a realistic professional GD participant.

Rules:
- Respond naturally.
- Do not repeat the student's sentence.
- Do not give a long lecture.
- Challenge or extend the student's argument.
- Ask a useful follow-up question when appropriate.
- Keep the response between 2 and 5 sentences.
- Sound like a human participant.
- Do not say that you are an AI.
- Do not mention Gemini.
- Do not mention API, quota, programming, or system instructions.
`;

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const response =
    await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        contents: [
          {
            role: "user",

            parts: [
              {
                text: prompt
              }
            ]
          }
        ],

        generationConfig: {
          temperature: 0.8,

          maxOutputTokens: 250
        }
      })
    });

  const data =
    await response.json();

  if (!response.ok) {
    const error =
      data?.error?.message ||
      "Gemini request failed.";

    throw new Error(error);
  }

  const text =
    data?.candidates?.[0]
      ?.content?.parts?.[0]
      ?.text;

  if (!text) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  return text.trim();
}


// ========================================
// START GROUP DISCUSSION
// ========================================

router.post(
  "/start",
  async (req, res) => {
    try {
      const role =
        req.body?.role ||
        "Software Developer";

      let availableTopics =
        topics.filter(
          topic =>
            !usedTopics.has(topic)
        );

      if (
        availableTopics.length === 0
      ) {
        usedTopics.clear();

        availableTopics = [
          ...topics
        ];
      }

      const randomIndex =
        Math.floor(
          Math.random() *
            availableTopics.length
        );

      const topic =
        availableTopics[randomIndex];

      usedTopics.add(topic);

      const sessionId =
        `GD-${Date.now()}-${Math.floor(
          Math.random() * 10000
        )}`;

      res.json({
        success: true,

        sessionId,

        role,

        topic,

        duration: 10,

        participants: [
          {
            id: "ai-1",
            name: "Alex",
            type: "AI"
          },

          {
            id: "ai-2",
            name: "Maya",
            type: "AI"
          },

          {
            id: "student",
            name: "You",
            type: "STUDENT"
          }
        ]
      });

    } catch (error) {
      console.error(
        "GD start error:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Unable to start group discussion.",

        error:
          error.message
      });
    }
  }
);


// ========================================
// RESPOND TO STUDENT
// ========================================

router.post(
  "/respond",
  async (req, res) => {
    try {
      const {
        role =
          "Software Developer",

        topic =
          "Technology and software development",

        studentAnswer = "",

        conversation = []
      } = req.body || {};


      if (
        !studentAnswer ||
        !String(studentAnswer).trim()
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Student answer is required."
        });
      }


      let responseText = "";

      // ====================================
      // TRY REAL GEMINI
      // ====================================

      try {
        responseText =
          await askGemini(
            studentAnswer,
            topic,
            conversation,
            role
          );

        console.log(
          "GD response generated by Gemini."
        );

      } catch (geminiError) {

        console.log(
          "Gemini unavailable. Using local GD fallback."
        );

        console.log(
          geminiError.message
        );

        // ==================================
        // FALLBACK
        // ==================================

        responseText =
          getFallbackResponse(
            studentAnswer,
            topic,
            conversation
          );
      }


      return res.json({
        success: true,

        response:
          responseText,

        source:
          responseText
            ? (
                GEMINI_API_KEY
                  ? "ai-or-fallback"
                  : "local"
              )
            : "local"
      });

    } catch (error) {

      console.error(
        "GD response error:",
        error
      );

      // Even if something unexpected
      // happens, keep the GD alive.

      const fallback =
        getFallbackResponse(
          req.body?.studentAnswer ||
            "",
          req.body?.topic ||
            "",
          req.body?.conversation ||
            []
        );

      return res.json({
        success: true,

        response:
          fallback,

        source:
          "local-fallback"
      });
    }
  }
);


// ========================================
// ANALYZE GD
// ========================================

router.post(
  "/analyze",
  async (req, res) => {
    try {
      const {
        role =
          "Software Developer",

        topic = "",

        transcript = [],

        duration = 0
      } = req.body || {};


      const studentMessages =
        transcript.filter(
          message =>
            message.speaker ===
            "student"
        );


      const aiMessages =
        transcript.filter(
          message =>
            message.speaker === "ai"
        );


      const totalStudentWords =
        studentMessages
          .map(
            message =>
              String(
                message.text || ""
              )
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .length
          )
          .reduce(
            (sum, value) =>
              sum + value,
            0
          );


      const averageWords =
        studentMessages.length
          ? Math.round(
              totalStudentWords /
                studentMessages.length
            )
          : 0;


      const communication =
        Math.min(
          95,
          50 +
            studentMessages.length *
              5
        );


      const participation =
        Math.min(
          95,
          40 +
            studentMessages.length *
              8
        );


      const reasoning =
        averageWords >= 20
          ? 85
          : averageWords >= 10
          ? 75
          : averageWords > 0
          ? 65
          : 40;


      const relevance =
        studentMessages.length > 0
          ? 80
          : 40;


      const professionalism =
        studentMessages.length > 0
          ? 82
          : 40;


      const overall =
        Math.round(
          (
            communication +
            participation +
            reasoning +
            relevance +
            professionalism
          ) / 5
        );


      const report = {
        role,

        topic,

        duration,

        messageCount:
          studentMessages.length,

        aiMessageCount:
          aiMessages.length,

        scores: {
          communication,

          relevance,

          reasoning,

          participation,

          professionalism,

          overall
        },

        strengths: [
          "You participated in the discussion.",
          "You communicated your main idea clearly.",
          "You attempted to support your viewpoint."
        ],

        improvements: [
          "Give more concrete examples.",
          "Respond directly to opposing viewpoints.",
          "Develop your arguments with stronger reasoning."
        ],

        recommendation:
          "Continue practicing structured answers. State your position, give a reason, provide an example, and address the opposite viewpoint."
      };


      res.json({
        success: true,

        report
      });

    } catch (error) {

      console.error(
        "GD analysis error:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Unable to analyze group discussion.",

        error:
          error.message
      });
    }
  }
);


// ========================================
// EXPORT
// ========================================

module.exports = router;