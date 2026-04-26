import "./login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, registerUser, updateDisplayName } from "../../auth/auth";
import { db } from "../../auth/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();

  /* LOGIN STATE */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  /* TAB STATE */
  const [activeTab, setActiveTab] = useState("login");

  /* SIGNUP STATE */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [level, setLevel] = useState("");

  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  const switchTab = (tab) => {
    setActiveTab(tab);
    setMessage(null);
    setSignupError("");
    setSignupSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !username || !signupEmail || !signupPassword || !level) {
      setSignupError("Please fill in all fields.");
      setSignupSuccess("");
      return;
    }

    setSignupError("");

    try {
      const credential = await registerUser(signupEmail, signupPassword);
      await updateDisplayName(`${firstName} ${lastName}`);
      await setDoc(doc(db, "users", credential.user.uid), {
        firstName,
        lastName,
        username,
        email: signupEmail,
        level,
        createdAt: new Date(),
      });
      setSignupSuccess("Account created! Redirecting to your dashboard…");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setSignupError(err.message);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT DECORATIVE PANEL */}
      <div className="left-panel">
        <Link to="/" className="panel-logo">
          Usu <span>Loqui</span>
        </Link>

        <h2 className="panel-quote">
          Fluency comes from <em>doing</em>, not just studying.
        </h2>

        <p className="panel-sub">
          Practice real Spanish conversations with an AI that adapts to your
          level. Every session makes you better.
        </p>

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
          {/* TAB TOGGLE */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => switchTab("login")}
              type="button"
            >
              Log In
            </button>

            <button
              className={`tab ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => switchTab("signup")}
              type="button"
            >
              Sign Up
            </button>
          </div>

          {/* LOGIN PANEL */}
          <div
            id="panel-login"
            className={`panel ${activeTab === "login" ? "active" : ""}`}
          >
            <h2 className="form-title">Welcome back</h2>

            <p className="form-subtitle">
              Log in to continue your Spanish practice.
            </p>

            {message && <div className="msg error">{message}</div>}

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

                <a href="#" className="forgot">
                  Forgot password?
                </a>
              </div>

              <button className="btn-submit" type="submit">
                Log In
              </button>
            </form>

            <div className="divider">or</div>

            <p className="terms">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => switchTab("signup")}
                className="inline-link"
              >
                Sign up for free
              </button>
            </p>
          </div>

          {/* SIGNUP PANEL */}
          <div
            id="panel-signup"
            className={`panel ${activeTab === "signup" ? "active" : ""}`}
          >
            <h2 className="form-title">Create account</h2>

            <p className="form-subtitle">
              Start practicing Spanish in under 5 minutes.
            </p>

            {signupError && <div className="msg error">{signupError}</div>}

            {signupSuccess && (
              <div className="msg success">{signupSuccess}</div>
            )}

            <form onSubmit={handleSignup}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="signup-first">First name</label>

                  <input
                    type="text"
                    id="signup-first"
                    placeholder="Maria"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="signup-last">Last name</label>

                  <input
                    type="text"
                    id="signup-last"
                    placeholder="Colon"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-username">Username</label>

                <input
                  type="text"
                  id="signup-username"
                  placeholder="mariacolon"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-email">Email address</label>

                <input
                  type="email"
                  id="signup-email"
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-password">Password</label>

                <input
                  type="password"
                  id="signup-password"
                  placeholder="At least 8 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-level">Spanish proficiency level</label>

                <select
                  id="signup-level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option value="">Select your level…</option>
                  <option value="beginner">Beginner (A1–A2)</option>
                  <option value="intermediate">Intermediate (B1–B2)</option>
                  <option value="advanced">Advanced (C1–C2)</option>
                </select>
              </div>

              <button className="btn-submit" type="submit">
                Create Account
              </button>
            </form>

            <p className="terms" style={{ marginTop: "1rem" }}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchTab("login")}
                className="inline-link"
              >
                Log in
              </button>
            </p>

            <p className="terms">
              By signing up you agree to our <a href="#">Terms of Service</a>{" "}
              and <a href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
