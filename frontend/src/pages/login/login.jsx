import "./login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../auth/auth";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT DECORATIVE PANEL */}
      <div className="left-panel">
        <Link to="/" className="panel-logo">Usu <span>Loqui</span></Link>
        <h2 className="panel-quote">Fluency comes from <em>doing</em>, not just studying.</h2>
        <p className="panel-sub">Practice real Spanish conversations with an AI that adapts to your level. Every session makes you better.</p>
        <div className="panel-badges">
          <span className="badge">🗣 Freeform chat</span>
          <span className="badge">📊 Progress tracking</span>
          <span className="badge">🔍 NLP feedback</span>
          <span className="badge">📖 CEFR aligned</span>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="right-panel">
        <div className="form-container">

          <div className="tabs">
            <button className="tab active">Log In</button>
            <Link to="/register" className="tab">Sign Up</Link>
          </div>

          <h2 className="form-title">Welcome back</h2>
          <p className="form-subtitle">Log in to continue your Spanish practice.</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-email">Email address</label>
              <input
                type="email"
                id="login-email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <a href="#" className="forgot">Forgot password?</a>
            </div>
            {message && <p className="msg error">{message}</p>}
            <button className="btn-submit" type="submit">Log In</button>
          </form>

          <div className="divider">or</div>
          <p className="terms">Don't have an account? <Link to="/register">Sign up for free</Link></p>

        </div>
      </div>
    </div>
  );
}