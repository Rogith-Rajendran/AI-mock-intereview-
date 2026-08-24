import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

function GroupDiscussionRound() {
  const navigate = useNavigate();

  const recognitionRef = useRef(null);
  const transcriptRef = useRef([]);
  const sessionRef = useRef(null);

  const finishedRef = useRef(false);
  const processingRef = useRef(false);
  const startedRef = useRef(false);
  const mountedRef = useRef(false);

  const [role, setRole] = useState("Software Developer");
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);

  const [currentSpeech, setCurrentSpeech] = useState("");
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(600);
  const [finished, setFinished] = useState(false);
  const [report, setReport] = useState(null);


  // ========================================
  // SAFE MOUNT CHECK
  // ========================================

  const isMounted = () => mountedRef.current;


  // ========================================
  // GET CURRENT USER
  // ========================================

  const getCurrentUserId = () => {
    const userData =
      localStorage.getItem("careerAIUser");

    if (!userData) {
      return null;
    }

    try {
      const user = JSON.parse(userData);

      return (
        user?._id ||
        user?.id ||
        user?.email ||
        null
      );

    } catch (error) {
      console.error(
        "Unable to read current user:",
        error
      );

      return null;
    }
  };


  // ========================================
  // INITIAL SETUP
  // ========================================

  useEffect(() => {
    mountedRef.current = true;

    const savedRole =
      localStorage.getItem("selectedJobRole");

    if (savedRole) {
      try {
        const parsed = JSON.parse(savedRole);

        if (parsed?.title) {
          setRole(parsed.title);
        }
      } catch {
        // Keep default role
      }
    }

    return () => {
      mountedRef.current = false;

      stopListening();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);


  // ========================================
  // START DISCUSSION
  // ========================================

  useEffect(() => {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;

    startDiscussion();
  }, []);


  // ========================================
  // START DISCUSSION API
  // ========================================

  const startDiscussion = async () => {
    try {
      setLoading(true);
      setError("");

      finishedRef.current = false;

      const saved =
        localStorage.getItem("selectedJobRole");

      let selectedRole =
        "Software Developer";

      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          selectedRole =
            parsed?.title ||
            selectedRole;
        } catch {
          // Use default
        }
      }

      if (isMounted()) {
        setRole(selectedRole);
      }

      const response = await fetch(
        `${API_URL}/api/gd/start`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            role: selectedRole
          })
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          `Server returned an invalid response (${response.status}).`
        );
      }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
          `Unable to start group discussion. Server status: ${response.status}`
        );
      }

      sessionRef.current = data;

      if (isMounted()) {
        setSession(data);

        setTimeLeft(
          Number(data.duration || 10) * 60
        );
      }

      const opening =
        `Welcome to the group discussion. Today's topic is "${data.topic}". You have ten minutes. Please give your opinion clearly and support your points with reasoning. You may begin.`;

      addMessage(
        "ai",
        opening
      );

      speakAI(
        opening,
        true
      );

    } catch (err) {
      console.error(
        "START GD ERROR:",
        err
      );

      if (isMounted()) {
        setError(
          err?.message ||
          "Unable to start group discussion. Check whether the backend is running."
        );
      }

    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  };


  // ========================================
  // ADD MESSAGE
  // ========================================

  const addMessage = (
    speaker,
    text
  ) => {
    if (!text) {
      return;
    }

    const message = {
      speaker,
      text,
      timestamp: Date.now()
    };

    transcriptRef.current = [
      ...transcriptRef.current,
      message
    ];

    if (isMounted()) {
      setMessages([
        ...transcriptRef.current
      ]);
    }
  };


  // ========================================
  // AI SPEECH
  // ========================================

  const speakAI = (
    text,
    listenAfter = false
  ) => {
    if (
      !text ||
      finishedRef.current
    ) {
      return;
    }

    if (
      !("speechSynthesis" in window)
    ) {
      if (
        listenAfter &&
        !finishedRef.current
      ) {
        setTimeout(() => {
          if (
            !finishedRef.current &&
            isMounted()
          ) {
            startListening();
          }
        }, 500);
      }

      return;
    }

    stopListening();

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 0.85;
    utterance.volume = 1;

    const voices =
      window.speechSynthesis.getVoices();

    const voice =
      voices.find((item) =>
        item.lang
          ?.toLowerCase()
          .startsWith("en-us")
      ) ||
      voices.find((item) =>
        item.lang
          ?.toLowerCase()
          .startsWith("en")
      );

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      if (
        !isMounted() ||
        finishedRef.current
      ) {
        return;
      }

      setSpeaking(true);
      setThinking(false);
      setListening(false);
    };

    utterance.onend = () => {
      if (!isMounted()) {
        return;
      }

      setSpeaking(false);

      if (
        listenAfter &&
        !finishedRef.current
      ) {
        setTimeout(() => {
          if (
            !finishedRef.current &&
            isMounted()
          ) {
            startListening();
          }
        }, 600);
      }
    };

    utterance.onerror = (event) => {
      console.error(
        "Speech synthesis error:",
        event
      );

      if (!isMounted()) {
        return;
      }

      setSpeaking(false);

      if (
        listenAfter &&
        !finishedRef.current
      ) {
        setTimeout(() => {
          if (
            !finishedRef.current &&
            isMounted()
          ) {
            startListening();
          }
        }, 600);
      }
    };

    window.speechSynthesis.speak(
      utterance
    );
  };


  // ========================================
  // START LISTENING
  // ========================================

  const startListening = () => {
    if (
      finishedRef.current ||
      processingRef.current ||
      listening ||
      speaking
    ) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. Please use Microsoft Edge or Google Chrome."
      );

      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }

      recognitionRef.current = null;
    }

    setError("");
    setCurrentSpeech("");

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      if (
        !isMounted() ||
        finishedRef.current
      ) {
        try {
          recognition.stop();
        } catch {
          // Ignore
        }

        return;
      }

      setListening(true);
      setSpeaking(false);
      setError("");
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const result =
          event.results[i];

        const text =
          result?.[0]?.transcript ||
          "";

        if (result.isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      if (
        interimText &&
        isMounted()
      ) {
        setCurrentSpeech(
          interimText
        );
      }

      if (finalText.trim()) {
        const answer =
          finalText.trim();

        setCurrentSpeech("");

        try {
          recognition.stop();
        } catch {
          // Ignore
        }

        recognitionRef.current =
          null;

        if (isMounted()) {
          setListening(false);
        }

        addMessage(
          "student",
          answer
        );

        setTimeout(() => {
          if (!finishedRef.current) {
            askAI(answer);
          }
        }, 200);
      }
    };

    recognition.onerror = (event) => {
      console.error(
        "SPEECH RECOGNITION ERROR:",
        event.error
      );

      recognitionRef.current =
        null;

      if (isMounted()) {
        setListening(false);
      }

      switch (event.error) {
        case "not-allowed":
        case "service-not-allowed":
          setError(
            "Microphone permission was denied. Allow microphone access in the browser."
          );
          break;

        case "no-speech":
          setError(
            "No speech detected. Press Start Speaking and speak clearly."
          );
          break;

        case "audio-capture":
          setError(
            "No microphone was detected. Check your microphone."
          );
          break;

        case "network":
          setError(
            "Browser speech recognition had a network problem. Try again."
          );
          break;

        case "aborted":
          break;

        default:
          setError(
            `Speech recognition error: ${event.error}`
          );
      }
    };

    recognition.onend = () => {
      recognitionRef.current =
        null;

      if (isMounted()) {
        setListening(false);
        setCurrentSpeech("");
      }
    };

    recognitionRef.current =
      recognition;

    try {
      recognition.start();
    } catch (err) {
      console.error(
        "Unable to start microphone:",
        err
      );

      recognitionRef.current =
        null;

      if (isMounted()) {
        setListening(false);

        setError(
          "Unable to start the microphone. Check microphone permission."
        );
      }
    }
  };


  // ========================================
  // STOP LISTENING
  // ========================================

  const stopListening = () => {
    const recognition =
      recognitionRef.current;

    recognitionRef.current =
      null;

    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // Already stopped
      }
    }

    if (isMounted()) {
      setListening(false);
      setCurrentSpeech("");
    }
  };


  // ========================================
  // ASK AI
  // ========================================

  const askAI = async (
    studentAnswer
  ) => {
    if (
      !studentAnswer ||
      processingRef.current ||
      finishedRef.current
    ) {
      return;
    }

    processingRef.current =
      true;

    if (isMounted()) {
      setThinking(true);
      setError("");
    }

    try {
      const response =
        await fetch(
          `${API_URL}/api/gd/respond`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              role,

              topic:
                sessionRef.current
                  ?.topic || "",

              studentAnswer,

              conversation:
                transcriptRef.current
            })
          }
        );

      let data;

      try {
        data =
          await response.json();
      } catch {
        throw new Error(
          `AI server returned invalid JSON (${response.status}).`
        );
      }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
          `AI response failed. Server status: ${response.status}`
        );
      }

      const aiResponse =
        String(
          data.response || ""
        ).trim();

      if (!aiResponse) {
        throw new Error(
          "AI returned an empty response."
        );
      }

      addMessage(
        "ai",
        aiResponse
      );

      speakAI(
        aiResponse,
        true
      );

    } catch (err) {
      console.error(
        "AI RESPONSE ERROR:",
        err
      );

      if (isMounted()) {
        setThinking(false);

        setError(
          err?.message ||
          "AI response failed."
        );
      }

    } finally {
      processingRef.current =
        false;
    }
  };


  // ========================================
  // TIMER
  // ========================================

  useEffect(() => {
    if (
      loading ||
      finished
    ) {
      return;
    }

    const timer =
      setInterval(() => {
        setTimeLeft(
          (previous) => {
            if (previous <= 1) {
              clearInterval(timer);

              finishDiscussion();

              return 0;
            }

            return previous - 1;
          }
        );
      }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    loading,
    finished
  ]);


  // ========================================
  // FINISH DISCUSSION
  // ========================================

  const finishDiscussion =
    async () => {
      if (
        finishedRef.current
      ) {
        return;
      }

      finishedRef.current =
        true;

      processingRef.current =
        false;

      stopListening();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      if (isMounted()) {
        setSpeaking(false);
        setListening(false);
        setThinking(false);
        setFinished(true);
        setError("");
      }

      try {
        const response =
          await fetch(
            `${API_URL}/api/gd/analyze`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                role,

                topic:
                  sessionRef.current
                    ?.topic || "",

                transcript:
                  transcriptRef.current,

                duration:
                  600 - timeLeft
              })
            }
          );

        let data;

        try {
          data =
            await response.json();
        } catch {
          throw new Error(
            `Analysis server returned invalid JSON (${response.status}).`
          );
        }

        console.log(
          "GD ANALYSIS:",
          data
        );

        if (data.success) {
          if (isMounted()) {
            setReport(
              data.report
            );
          }

          // ========================================
          // SAVE ROUND 3 FOR CURRENT USER
          // ========================================

          const userId =
            getCurrentUserId();

          if (userId) {
            const overallScore =
              Number(
                data.report
                  ?.scores
                  ?.overall || 0
              );

            const communication =
              Number(
                data.report
                  ?.scores
                  ?.communication ||
                0
              );

            const reasoning =
              Number(
                data.report
                  ?.scores
                  ?.reasoning ||
                0
              );

            const participation =
              Number(
                data.report
                  ?.scores
                  ?.participation ||
                0
              );

            const round3Result = {
              round: 3,

              title:
                "Group Discussion",

              score:
                overallScore,

              percentage:
                overallScore,

              communication,

              reasoning,

              participation,

              topic:
                sessionRef.current
                  ?.topic || "",

              completed: true,

              completedAt:
                new Date()
                  .toISOString()
            };

            localStorage.setItem(
              `careerAIRound3_${userId}`,
              JSON.stringify(
                round3Result
              )
            );

            console.log(
              "Round 3 result saved for user:",
              userId,
              round3Result
            );
          }

        } else {
          if (isMounted()) {
            setError(
              data.message ||
              "GD ended, but the report could not be generated."
            );
          }
        }

      } catch (err) {
        console.error(
          "GD ANALYSIS ERROR:",
          err
        );

        if (isMounted()) {
          setError(
            "GD ended, but the analysis server could not be reached."
          );
        }
      }
    };


  // ========================================
  // FORMAT TIME
  // ========================================

  const formatTime = (
    seconds
  ) => {
    const minutes =
      Math.floor(
        seconds / 60
      );

    const remaining =
      seconds % 60;

    return (
      String(minutes).padStart(
        2,
        "0"
      ) +
      ":" +
      String(remaining).padStart(
        2,
        "0"
      )
    );
  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="gd-page">

        <div className="gd-loading">

          <h1>
            Preparing Group Discussion
          </h1>

          <p>
            Preparing your AI discussion...
          </p>

          {error && (
            <div className="gd-error">
              {error}
            </div>
          )}

        </div>

      </div>
    );
  }


  // ========================================
  // RESULT PAGE
  // ========================================

  if (finished) {
    return (
      <div className="gd-page">

        <div className="gd-result">

          <p className="section-label">
            ROUND 3 COMPLETED
          </p>

          <h1>
            Group Discussion Report
          </h1>


          {report ? (
            <>
              <div className="gd-score-grid">

                <div className="gd-score">

                  <span>
                    Communication
                  </span>

                  <strong>
                    {
                      report.scores
                        ?.communication
                    }%
                  </strong>

                </div>


                <div className="gd-score">

                  <span>
                    Reasoning
                  </span>

                  <strong>
                    {
                      report.scores
                        ?.reasoning
                    }%
                  </strong>

                </div>


                <div className="gd-score">

                  <span>
                    Participation
                  </span>

                  <strong>
                    {
                      report.scores
                        ?.participation
                    }%
                  </strong>

                </div>


                <div className="gd-score">

                  <span>
                    Overall
                  </span>

                  <strong>
                    {
                      report.scores
                        ?.overall
                    }%
                  </strong>

                </div>

              </div>


              <p>
                {
                  report.recommendation
                }
              </p>

            </>
          ) : (
            <p>
              {
                error ||
                "Generating your GD report..."
              }
            </p>
          )}


          {/* ========================================
              IMPORTANT:
              GO DIRECTLY TO AI HR
          ======================================== */}

          <button
            type="button"
            className="gd-primary-button"
            onClick={() =>
              navigate(
                "/jobs/hr-interview"
              )
            }
          >
            Continue to AI HR Interview →
          </button>

        </div>

      </div>
    );
  }


  // ========================================
  // MAIN PAGE
  // ========================================

  return (
    <div className="gd-page">

      <div className="gd-container">

        {/* HEADER */}

        <div className="gd-header">

          <div>

            <p className="section-label">
              ROUND 3 · AI GROUP DISCUSSION
            </p>

            <h1>
              AI Group Discussion
            </h1>

            <p>
              {role}
            </p>

          </div>


          <div className="gd-timer">
            {formatTime(timeLeft)}
          </div>


          <button
            type="button"
            className="gd-finish-button"
            onClick={
              finishDiscussion
            }
            disabled={finished}
          >
            End GD
          </button>

        </div>


        {/* TOPIC */}

        <div className="gd-topic">

          <p className="section-label">
            DISCUSSION TOPIC
          </p>

          <h2>
            {session?.topic}
          </h2>

          <p>
            Give your opinion, explain your
            reasoning and respond naturally
            to the AI participant.
          </p>

        </div>


        {/* AI PANEL */}

        <div className="gd-ai-panel">

          <div className="gd-avatar">

            <div className="gd-avatar-fallback">
              AI
            </div>

            {speaking && (
              <div className="gd-speaking-ring" />
            )}

          </div>


          <div className="gd-ai-info">

            <div className="gd-ai-name">
              AI DISCUSSION PARTICIPANT
            </div>

            <h2>
              Alex
            </h2>

            <p>
              {
                messages
                  .filter(
                    (message) =>
                      message.speaker ===
                      "ai"
                  )
                  .slice(-1)[0]?.text ||
                "Preparing the discussion..."
              }
            </p>


            <div className="gd-ai-status">

              {speaking
                ? "AI is speaking..."
                : thinking
                ? "AI is thinking..."
                : listening
                ? "Listening to you..."
                : "Ready"}

            </div>

          </div>

        </div>


        {/* CONVERSATION */}

        <div className="gd-conversation">

          <div className="gd-conversation-header">

            <h2>
              Live Discussion
            </h2>

            <span>
              {messages.length} messages
            </span>

          </div>


          <div className="gd-messages">

            {messages.map(
              (
                message,
                index
              ) => (

                <div
                  key={`${message.timestamp}-${index}`}
                  className={
                    message.speaker ===
                    "student"
                      ? "gd-message student"
                      : "gd-message ai"
                  }
                >

                  <strong>
                    {message.speaker ===
                    "student"
                      ? "YOU"
                      : "ALEX"}
                  </strong>


                  <p>
                    {message.text}
                  </p>

                </div>

              )
            )}

          </div>

        </div>


        {/* CURRENT SPEECH */}

        {currentSpeech && (
          <div className="gd-current-speech">

            <span>
              LISTENING
            </span>

            <p>
              {currentSpeech}
            </p>

          </div>
        )}


        {/* ERROR */}

        {error && (
          <div className="gd-error">
            {error}
          </div>
        )}


        {/* CONTROLS */}

        <div className="gd-controls">

          <button
            type="button"
            className="gd-speak-button"
            onClick={
              startListening
            }
            disabled={
              listening ||
              speaking ||
              thinking ||
              finished
            }
          >

            🎙{" "}

            {listening
              ? "Listening..."
              : thinking
              ? "AI Thinking..."
              : speaking
              ? "AI Speaking..."
              : "Start Speaking"}

          </button>


          {listening && (
            <button
              type="button"
              className="gd-stop-button"
              onClick={
                stopListening
              }
            >
              Stop Listening
            </button>
          )}


          <button
            type="button"
            className="gd-finish-button"
            onClick={
              finishDiscussion
            }
            disabled={finished}
          >
            End GD
          </button>

        </div>

      </div>

    </div>
  );
}

export default GroupDiscussionRound;