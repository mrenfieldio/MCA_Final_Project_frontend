import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className="nav"
      // style={scrolled ? { background: "rgba(5,12,26,0.97)" } : {}}
    >
      {/* 🔹 Logo → Landing Page */}
      <div
        className="nav-logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <div className="nav-logo-icon">L</div>
        LinkPro
      </div>

      {/* 🔹 Navigation Links */}
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/auth">Jobs</Link>
        </li>
        {/* <li>
          <Link to="/freelancers">Freelancers</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li> */}
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>

      {/* 🔹 Actions */}
      <div className="nav-actions">
        <button className="btn-primary" onClick={() => navigate("/auth")}>
          Login
        </button>
      </div>
    </nav>
  );
}
