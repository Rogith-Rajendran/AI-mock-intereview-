function Register() {
  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <h1>
            Create Account
          </h1>

          <p>
            Start your career journey with CareerAI.
          </p>

        </div>


        <form className="login-form">

          <label>
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your full name"
          />


          <label>
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
          />


          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Create a password"
          />


          <label>
            Confirm Password
          </label>

          <input
            type="password"
            placeholder="Confirm your password"
          />


          <button type="submit">
            Create Account
          </button>

        </form>


        <p className="register-text">
          Already have an account?

          <a href="/login">
            Login
          </a>
        </p>

      </div>

    </div>
  );
}

export default Register;