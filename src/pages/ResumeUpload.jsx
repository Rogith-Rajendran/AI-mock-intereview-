import { useState } from "react";

function ResumeUpload() {
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setResume(file);
    setMessage("");
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!resume) {
      setMessage("Please select your resume.");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(resume.type)) {
      setMessage(
        "Please upload a PDF or DOCX resume."
      );
      return;
    }

    if (resume.size > 5 * 1024 * 1024) {
      setMessage(
        "Resume must be smaller than 5 MB."
      );
      return;
    }

    const userData =
      localStorage.getItem("careerAIUser");

    if (!userData) {
      setMessage(
        "Please login before uploading your resume."
      );
      return;
    }

    let user;

    try {
      user = JSON.parse(userData);
    } catch (error) {
      setMessage(
        "Unable to read user information."
      );
      return;
    }

    const userId =
      user._id ||
      user.id;

    if (!userId) {
      setMessage(
        "User ID not found. Please login again."
      );
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append(
        "resume",
        resume
      );

      formData.append(
        "userId",
        userId
      );

      const response = await fetch(
        "http://localhost:5000/api/resume/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        setMessage(
          data.message ||
          "Resume upload failed."
        );
        return;
      }

      setMessage(
        "Resume uploaded successfully!"
      );

    } catch (error) {

      console.error(
        "Resume upload error:",
        error
      );

      setMessage(
        "Unable to connect to the backend."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-header">

          <p className="dashboard-label">
            AI HR INTERVIEW
          </p>

          <h1>
            Upload Your Resume
          </h1>

          <p>
            Your resume will be used to create
            personalized AI HR interview questions.
          </p>

        </div>

        <form
          className="profile-form"
          onSubmit={handleUpload}
        >

          <label>
            Resume
          </label>

          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
          />

          {resume && (
            <p>
              Selected: {resume.name}
            </p>
          )}

          {message && (
            <p>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Uploading..."
              : "Upload Resume"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default ResumeUpload;