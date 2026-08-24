import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {

  const navigate = useNavigate();


  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");



  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");


    if (!email || !password) {

      setError(
        "Please enter your email and password."
      );

      return;

    }


    try {

      setLoading(true);


      const response =
        await fetch(
          "http://localhost:5000/api/auth/login",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              email:
                email.trim().toLowerCase(),

              password:
                password

            })

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        setError(
          data.message ||
          "Invalid email or password."
        );

        return;

      }


      if (!data.success) {

        setError(
          data.message ||
          "Login failed."
        );

        return;

      }


      // ========================================
      // SAVE LOGIN
      // ========================================

      localStorage.setItem(
        "careerAILoggedIn",
        "true"
      );


      localStorage.setItem(
        "careerAIUser",
        JSON.stringify(
          data.user
        )
      );


      // ========================================
      // GO TO DASHBOARD
      // ========================================

      navigate(
        "/dashboard",
        {
          replace: true
        }
      );

    }

    catch (error) {

      console.error(
        "Login error:",
        error
      );


      setError(
        "Unable to connect to the backend."
      );

    }

    finally {

      setLoading(false);

    }

  };



  return (

    <div className="login-page">

      <div className="login-card">


        <div className="login-header">

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to continue your career journey.
          </p>

        </div>



        <form
          className="login-form"
          onSubmit={handleLogin}
        >


          <label>
            Email Address
          </label>


          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />



          <label>
            Password
          </label>


          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />



          {error && (

            <p
              style={{
                color: "red",
                marginTop: "10px"
              }}
            >
              {error}
            </p>

          )}



          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>


        </form>



        <p className="register-text">

          Don't have an account?

          <a href="/register">
            Create an account
          </a>

        </p>


      </div>

    </div>

  );

}


export default Login;