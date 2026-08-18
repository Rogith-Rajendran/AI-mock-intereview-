function Login() {
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


        <form className="login-form">

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
            placeholder="Enter your password"
          />


          <button type="submit">
            Login
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