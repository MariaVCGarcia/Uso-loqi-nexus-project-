import "./nav.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../auth/firebase";
export default function Navbar({ user }) {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate("/register");
  };
  const handleLogout = () => {
    signOut(auth);
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
        {!user && (
          <li>
            <a onClick={handleGetStarted} className="btn-nav">
              Get Started
            </a>
          </li>
        )}
        {!user && (
          <li>
            <a onClick={() => navigate("/login")} className="btn-nav btn-nav-outline">
              Login
            </a>
          </li>
        )}
        {user && (
          <li>
            <a onClick={handleLogout} className="btn-nav btn-nav-outline">
              Logout
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}
