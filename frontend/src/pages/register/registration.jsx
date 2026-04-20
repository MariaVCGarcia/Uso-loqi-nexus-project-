import { useState } from "react";
import { registerUser } from "../../auth/auth";
import "./register.css";

export default function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, password);
      setMessage("Registration successful!");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="login-body">
      <div class="panel" id="panel-signup">
        <h2 class="form-title">Create account</h2>
        <p class="form-subtitle">
          Start practicing Spanish in under 5 minutes.
        </p>

        <div class="msg error" id="signup-error">
          Please fill in all fields.
        </div>
        <div class="msg success" id="signup-success">
          Account created! Redirecting to your dashboard…
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="signup-first">First name</label>
            <input type="text" id="signup-first" placeholder="Maria" />
          </div>
          <div class="form-group">
            <label for="signup-last">Last name</label>
            <input type="text" id="signup-last" placeholder="Colon" />
          </div>
        </div>
        <div class="form-group">
          <label for="signup-username">Username</label>
          <input type="text" id="signup-username" placeholder="mariacolon" />
        </div>
        <div class="form-group">
          <label for="signup-email">Email address</label>
          <input type="email" id="signup-email" placeholder="you@example.com" />
        </div>
        <div class="form-group">
          <label for="signup-password">Password</label>
          <input
            type="password"
            id="signup-password"
            placeholder="At least 8 characters"
          />
        </div>
        <div class="form-group">
          <label for="signup-level">Spanish proficiency level</label>
          <select id="signup-level">
            <option value="">Select your level…</option>
            <option value="beginner">Beginner (A1–A2)</option>
            <option value="intermediate">Intermediate (B1–B2)</option>
            <option value="advanced">Advanced (C1–C2)</option>
          </select>
        </div>

        <button class="btn-submit" onclick="handleSignup()">
          Create Account
        </button>
        <p class="terms" className="margin-top:1rem;">
          Already have an account?{" "}
          <a href="#" onclick="switchTab('login')">
            Log in
          </a>
        </p>
        <p class="terms">
          By signing up you agree to our <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
