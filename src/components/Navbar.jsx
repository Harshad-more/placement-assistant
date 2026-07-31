import { Link } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <Link to="/">Dashboard</Link>
      {" | "}

      <Link to="/applications">
        Applications
      </Link>
      {" | "}

      <Link to="/interview">
        Interview Tracker
      </Link>
      {" | "}

      <Link to="/resources">
        Resources
      </Link>
      {" | "}

      <Link to="/planner">
        Planner
      </Link>
      {" | "}

      <Link to="/resume">
        Resume
      </Link>
      {" | "}

      <Link to="/resume-analyzer">
        ATS Analyzer
      </Link>
      {" | "}

      {user ? (
        <>
          <span>
            Welcome, {user.name}
          </span>
          {" | "}

          <button onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login">
            Login
          </Link>
          {" | "}

          <Link to="/register">
            Register
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;