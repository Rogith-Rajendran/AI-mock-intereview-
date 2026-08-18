import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="site-navbar">

      <div className="navbar-container">

        {/* Logo */}

        <Link
          to="/"
          className="navbar-logo"
        >
          CareerAI
        </Link>


        {/* Navigation */}

        <nav className="navbar-menu">

          <Link
            to="/"
            className="navbar-link"
          >
            Home
          </Link>


          <a
            href="/#about"
            className="navbar-link"
          >
            About
          </a>


          <a
            href="/#how-it-works"
            className="navbar-link"
          >
            How It Works
          </a>


          <Link
            to="/login"
            className="navbar-login"
          >
            Login
          </Link>

        </nav>

      </div>

    </header>
  );
}

export default Navbar;