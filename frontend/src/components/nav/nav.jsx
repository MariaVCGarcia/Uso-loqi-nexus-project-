import "./nav.css";
import { useNavigate } from "react-router-dom";
export default function Navbar({ user }) {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    if (user) {
      alert("Welcome back! Let's start practicing.");
    } else {
      navigate("/register");
    }
  };

  return (
    <nav>
      <a href="/" onClick={() => navigate("/")} className="nav-logo">
        Usu <span>Loqui</span>
      </a>

      <ul className="nav-links">
        <li>
          <a href="/#features">Features</a>
        </li>
        <li>
          <a href="/#how">How it works</a>
        </li>
        <li>
          <a href="/#levels">Levels</a>
        </li>
        <li>
          <a onClick={handleGetStarted} className="btn-nav">
            Get Started
          </a>
        </li>
      </ul>
    </nav>
  );
}
