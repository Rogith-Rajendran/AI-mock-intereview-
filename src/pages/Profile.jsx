import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    degree: "",
    branch: "",
    year: "",
    cgpa: "",
    skills: "",
    interests: ""
  });

  const [resume, setResume] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [resumeMessage, setResumeMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // ========================================
  // CURRENT USER
  // ========================================

  const userData =
    localStorage.getItem("careerAIUser");

  const user = userData
    ? JSON.parse(userData)
    : null;

  const userId =
    user?._id ||
    user?.id ||
    user?.email;

  const profileKey =
    userId
      ? `careerAIProfile_${userId}`
      : null;

  // ========================================
  // LOAD PROFILE
  // ========================================

  useEffect(() => {
    if (!profileKey) {
      return;
    }

    const savedProfile =
      localStorage.getItem(profileKey);

    if (savedProfile) {
      try {
        setProfile(
          JSON.parse(savedProfile)
        );
      } catch (error) {
        console.error(
          "Unable to load profile:",
          error
        );
      }
    }
  }, [profileKey]);

  // ========================================
  // LOAD RESUME INFORMATION
  // ========================================

  useEffect(() => {
    if (!userId) {
      return;
    }

    const savedResume =
      localStorage.getItem(
        `careerAIResume_${userId}`
      );

    if (savedResume) {
      try {
        const resumeData =
          JSON.parse(savedResume);

        setResumeName(
          resumeData.fileName || ""
        );
      } catch (error) {
        console.error(
          "Unable to load resume:",
          error
        );
      }
    }
  }, [userId]);

  // ========================================
  // PROFILE INPUT
  // ========================================

  const handleChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]:
        event.target.value
    });
  };

  // ========================================
  // RESUME SELECT
  // ========================================

  const handleResumeChange = (event) => {
    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    setResume(file);
    setResumeMessage("");
  };

  // ========================================
  // UPLOAD RESUME
  // ========================================

  const handleResumeUpload = async () => {
    if (!userId) {
      setResumeMessage(
        "Please login again."
      );
      return;
    }

    if (!resume) {
      setResumeMessage(
        "Please select a resume first."
      );
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (
      !allowedTypes.includes(
        resume.type
      )
    ) {
      setResumeMessage(
        "Only PDF and DOCX files are allowed."
      );
      return;
    }

    if (
      resume.size >
      5 * 1024 * 1024
    ) {
      setResumeMessage(
        "Resume must be smaller than 5 MB."
      );
      return;
    }

    try {
      setUploading(true);
      setResumeMessage("");

      const formData =
        new FormData();

      formData.append(
        "resume",
        resume
      );

      formData.append(
        "userId",
        userId
      );

      const response =
        await fetch(
          "http://localhost:5000/api/resume/upload",
          {
            method: "POST",
            body: formData
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        setResumeMessage(
          data.message ||
          "Resume upload failed."
        );
        return;
      }

      // Save resume information
      // for this specific user
      localStorage.setItem(
        `careerAIResume_${userId}`,
        JSON.stringify({
          fileName: resume.name,
          fileType: resume.type,
          uploadedAt:
            new Date().toISOString()
        })
      );

      setResumeName(
        resume.name
      );

      setResume(null);

      setResumeMessage(
        "Resume uploaded successfully!"
      );

    } catch (error) {

      console.error(
        "Resume upload error:",
        error
      );

      setResumeMessage(
        "Unable to connect to the backend."
      );

    } finally {

      setUploading(false);

    }
  };

  // ========================================
  // SAVE PROFILE
  // ========================================

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!userId) {
      alert(
        "User not found. Please login again."
      );

      navigate("/login");
      return;
    }

    localStorage.setItem(
      `careerAIProfile_${userId}`,
      JSON.stringify(profile)
    );

    alert(
      "Profile saved successfully!"
    );

    navigate("/dashboard");
  };

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-header">

          <p className="dashboard-label">
            STUDENT PROFILE
          </p>

          <h1>
            Tell us about yourself
          </h1>

          <p>
            This information will help CareerAI
            understand your interests and career goals.
          </p>

        </div>


        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >

          <label>
            Degree
          </label>

          <input
            type="text"
            name="degree"
            placeholder="Example: B.Tech"
            value={profile.degree}
            onChange={handleChange}
            required
          />


          <label>
            Branch
          </label>

          <input
            type="text"
            name="branch"
            placeholder="Example: Computer Science"
            value={profile.branch}
            onChange={handleChange}
            required
          />


          <label>
            Current Year
          </label>

          <select
            name="year"
            value={profile.year}
            onChange={handleChange}
            required
          >

            <option value="">
              Select your year
            </option>

            <option value="1st Year">
              1st Year
            </option>

            <option value="2nd Year">
              2nd Year
            </option>

            <option value="3rd Year">
              3rd Year
            </option>

            <option value="4th Year">
              4th Year
            </option>

          </select>


          <label>
            CGPA
          </label>

          <input
            type="number"
            name="cgpa"
            placeholder="Example: 8.2"
            step="0.01"
            value={profile.cgpa}
            onChange={handleChange}
            required
          />


          <label>
            Your Skills
          </label>

          <input
            type="text"
            name="skills"
            placeholder="Example: Java, React, Python, SQL"
            value={profile.skills}
            onChange={handleChange}
            required
          />


          <label>
            Your Interests
          </label>

          <textarea
            name="interests"
            placeholder="Example: Web development, AI, business..."
            value={profile.interests}
            onChange={handleChange}
            rows="4"
            required
          />


          {/* ==================================
              RESUME
          ================================== */}

          <label>
            Resume
          </label>

          {resumeName && (
            <p>
              Current Resume:{" "}
              <strong>
                {resumeName}
              </strong>
            </p>
          )}

          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleResumeChange}
          />

          {resume && (
            <p>
              Selected:{" "}
              <strong>
                {resume.name}
              </strong>
            </p>
          )}

          <button
            type="button"
            onClick={handleResumeUpload}
            disabled={uploading}
          >
            {uploading
              ? "Uploading Resume..."
              : resumeName
                ? "Replace Resume"
                : "Upload Resume"}
          </button>

          {resumeMessage && (
            <p>
              {resumeMessage}
            </p>
          )}


          {/* ==================================
              SAVE PROFILE
          ================================== */}

          <button type="submit">
            Save Profile
          </button>

        </form>

      </div>

    </div>
  );
}

export default Profile;