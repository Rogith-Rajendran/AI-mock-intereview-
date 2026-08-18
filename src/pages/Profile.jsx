import { useState } from "react";
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

  const handleChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    localStorage.setItem(
      "careerAIProfile",
      JSON.stringify(profile)
    );

    alert("Profile saved successfully!");

    navigate("/dashboard");
  };

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
            This information will help CareerAI understand
            your interests and career goals.
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


          <button type="submit">
            Save Profile
          </button>

        </form>

      </div>

    </div>
  );
}

export default Profile;