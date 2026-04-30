import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { db } from "../../auth/firebase";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import "./dashboard.css";

const LEVEL_MAP = {
  beginner:     { code: "A1", label: "Beginner" },
  intermediate: { code: "B1", label: "Intermediate" },
  advanced:     { code: "C1", label: "Advanced" },
};

const SCENARIO_META = {
  dining:    { label: "Dining" },
  travel:    { label: "Travel" },
  business:  { label: "Business" },
  casual:    { label: "Casual" },
  academic:  { label: "Academic" },
  practical: { label: "Practical" },
};

function scoreDotClass(score) {
  if (score >= 80) return "score-dot score-high";
  if (score >= 65) return "score-dot score-mid";
  return "score-dot score-low";
}

function formatDate(id) {
  const ts = parseInt(id);
  if (isNaN(ts)) return "—";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ─── Slide-out Drawer ─── */
function Drawer({ displayName, level, open, onClose }) {
  const badge = LEVEL_MAP[level] || null;

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-overlay" onClick={onClose} />

      {/* Panel */}
      <nav className="drawer" aria-label="Site navigation">
        <div className="drawer-header">
          <a href="/" className="drawer-logo">Usu <span>Loqui</span></a>
          <button className="drawer-close" onClick={onClose} aria-label="Close menu">✕</button>
        </div>

        <div className="drawer-body">
          <div className="drawer-section-label">Practice</div>
          <Link to="/chat"          className="drawer-link" onClick={onClose}><span className="drawer-link-icon">🗣</span> New Session</Link>
          <Link to="/dashboard"     className="drawer-link active" onClick={onClose}><span className="drawer-link-icon">🏠</span> Dashboard</Link>
          <Link to="/progress"      className="drawer-link" onClick={onClose}><span className="drawer-link-icon">📈</span> Progress</Link>
          <Link to="/conversations" className="drawer-link" onClick={onClose}><span className="drawer-link-icon">💬</span> Conversations</Link>

          <div className="drawer-section-label">Account</div>
          <button className="drawer-link" onClick={onClose}><span className="drawer-link-icon">⚙️</span> Settings</button>
        </div>

        <div className="drawer-footer">
          <div className="drawer-user">
            <div className="drawer-avatar">
              {displayName ? displayName[0].toUpperCase() : "?"}
            </div>
            <div>
              <div className="drawer-user-name">{displayName}</div>
              <div className="drawer-user-level">
                {badge ? `${badge.code} · ${badge.label}` : "Learner"}
              </div>
            </div>
            <button className="drawer-logout" title="Log out">↪</button>
          </div>
        </div>
      </nav>
    </>
  );
}

/* ─── Filter Dropdown ─── */
function FilterDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options = [
    { value: "all",      icon: "📋", label: "All sessions" },
    { value: "graded",   icon: "⭐", label: "Graded only" },
    { value: "dining",   icon: "🍽", label: "Dining" },
    { value: "travel",   icon: "✈️", label: "Travel" },
    { value: "business", icon: "💼", label: "Business" },
    { value: "casual",   icon: "💬", label: "Casual" },
  ];

  const current = options.find((o) => o.value === value) || options[0];

  return (
    <div className={`dropdown${open ? " dropdown-open" : ""}`} ref={ref}>
      <button className="dropdown-trigger" onClick={() => setOpen((v) => !v)}>
        {current.icon} {current.label}
        <span className="dropdown-chevron">▾</span>
      </button>
      <div className="dropdown-menu dropdown-right">
        <div className="dropdown-label">Filter by</div>
        {options.map((o) => (
          <button
            key={o.value}
            className="dropdown-item"
            onClick={() => { onChange(o.value); setOpen(false); }}
          >
            <span className="dropdown-item-icon">{o.icon}</span>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Session Detail Modal ─── */
function SessionModal({ convo, onClose }) {
  const isOpen = convo !== null;
  const scoreVal = convo?.score?.score;
  const msgCount = convo?.messages?.filter((m) => m.role === "user").length || 0;
  const meta = SCENARIO_META[convo?.scenario?.toLowerCase()] || { label: convo?.title || "General" };

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className={`modal-backdrop${isOpen ? " modal-open" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-modal="true"
      role="dialog"
    >
      <div className={`modal${scoreVal == null ? "" : scoreVal >= 80 ? "" : " modal-danger"}`}>
        <div className="modal-header">
          <h3 className="modal-title">Session Review</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          {convo && (
            <>
              <div className="modal-stat-row">
                <span className="modal-stat-label">Date</span>
                <span className="modal-stat-value">{formatDate(convo.id)}</span>
              </div>
              <div className="modal-stat-row">
                <span className="modal-stat-label">Scenario</span>
                <span className="modal-stat-value">{meta.label}</span>
              </div>
              <div className="modal-stat-row">
                <span className="modal-stat-label">Messages sent</span>
                <span className="modal-stat-value">{msgCount}</span>
              </div>
              <div className="modal-stat-row">
                <span className="modal-stat-label">Score</span>
                <span className="modal-stat-value">
                  {scoreVal != null
                    ? <><span className={scoreDotClass(scoreVal)}></span>{scoreVal}%</>
                    : <span style={{ color: "rgba(26,26,46,0.35)" }}>Not graded</span>
                  }
                </span>
              </div>
              {convo.score?.feedback && (
                <div className="modal-stat-row">
                  <span className="modal-stat-label">Feedback</span>
                  <span className="modal-stat-value" style={{ fontSize: "0.82rem", fontWeight: 400, maxWidth: 220, textAlign: "right" }}>
                    {convo.score.feedback}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn-ghost" onClick={onClose}>Close</button>
          <Link to="/conversations" className="modal-btn modal-btn-primary" onClick={onClose}>
            Full review →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function Dashboard({ user }) {
  const displayName = user?.displayName?.split(" ")[0] || user?.email || "there";

  const [level,         setLevel]         = useState(null);
  const [conversations, setConversations] = useState([]);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Dropdown filter state
  const [filter, setFilter] = useState("all");

  // Modal state — holds the selected convo or null
  const [selectedConvo, setSelectedConvo] = useState(null);

  // Sync drawer-open class on body (needed for CSS hamburger animation + scroll lock)
  useEffect(() => {
    document.body.classList.toggle("drawer-open", drawerOpen);
    return () => document.body.classList.remove("drawer-open");
  }, [drawerOpen]);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) setLevel(snap.data().level);
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const ref = collection(db, "users", user.uid, "conversations");
    const unsub = onSnapshot(ref, (snap) => {
      const convos = snap.docs.map((d) => d.data());
      convos.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      setConversations(convos);
    });
    return () => unsub();
  }, [user?.uid]);

  const badge = LEVEL_MAP[level] || null;

  const totalConvos   = conversations.length;
  const totalMessages = conversations.reduce((sum, c) => sum + (c.messages?.filter(m => m.role === "user").length || 0), 0);
  const gradedConvos  = conversations.filter(c => c.score?.score != null);
  const overallGrade  = gradedConvos.length
    ? Math.round(gradedConvos.reduce((sum, c) => sum + c.score.score, 0) / gradedConvos.length)
    : null;

  // Apply dropdown filter to conversation table
  const filteredConvos = conversations.filter((c) => {
    if (filter === "all")    return true;
    if (filter === "graded") return c.score?.score != null;
    return c.scenario?.toLowerCase() === filter;
  });

  return (
    <>
      {/* ── Slide-out Drawer ── */}
      <Drawer
        displayName={displayName}
        level={level}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* ── Session Detail Modal ── */}
      <SessionModal
        convo={selectedConvo}
        onClose={() => setSelectedConvo(null)}
      />

      <div className="page">

        {/* HEADER */}
        <div className="dash-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Hamburger — CSS hides this on desktop */}
            <button
              className="hamburger"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div>
              <h1>Your Progress</h1>
              <p>Welcome back, {displayName} · 5-day streak 🔥 · Last session: Today</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span className="dash-username">{displayName}</span>
            {badge && <div className="cefr-badge">{badge.code} <span>{badge.label}</span></div>}
          </div>
        </div>

        {/* TOP STAT CARDS */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-card-label">Total Conversations</div>
            <div className="stat-card-value">{totalConvos}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Messages Sent</div>
            <div className="stat-card-value">{totalMessages}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Time Practiced</div>
            <div className="stat-card-value">6.4h</div>
            <div className="stat-card-sub">Total time in Spanish</div>
            <div className="stat-card-trend trend-up">↑ 40m this week</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Overall Grade</div>
            <div className="stat-card-value">{overallGrade != null ? `${overallGrade}%` : "—"}</div>
            <div className="stat-card-sub">
              {gradedConvos.length > 0
                ? `Avg across ${gradedConvos.length} graded session${gradedConvos.length !== 1 ? "s" : ""}`
                : "No graded sessions yet"}
            </div>
          </div>
        </div>

        {/* CEFR PROGRESS */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div className="card-title">CEFR Proficiency Estimate</div>
          <div className="card-sub">Based on vocabulary usage, grammar accuracy, and response complexity</div>
          <div className="cefr-track"><div className="cefr-fill"></div></div>
          <div className="cefr-labels">
            <span>A1</span><span>A2</span><span>B1 ← You are here</span><span>B2</span><span>C1</span><span>C2</span>
          </div>
        </div>

        {/* ERROR BREAKDOWN + RADAR */}
        <div className="grid-2">
          <div className="card">
            <div className="card-title">Error Breakdown</div>
            <div className="card-sub">By category across all sessions</div>
            <div className="bar-chart">
              <div className="bar-row">
                <span className="bar-label">Grammar</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: "72%", background: "var(--terracotta)" }}></div></div>
                <span className="bar-val" style={{ color: "var(--terracotta)" }}>72%</span>
              </div>
              <div className="bar-row">
                <span className="bar-label">Verb conjugation</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: "58%", background: "var(--terracotta)" }}></div></div>
                <span className="bar-val" style={{ color: "var(--terracotta)" }}>58%</span>
              </div>
              <div className="bar-row">
                <span className="bar-label">Vocabulary</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: "45%", background: "var(--gold)" }}></div></div>
                <span className="bar-val" style={{ color: "var(--gold)" }}>45%</span>
              </div>
              <div className="bar-row">
                <span className="bar-label">Word order</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: "38%", background: "var(--gold)" }}></div></div>
                <span className="bar-val" style={{ color: "var(--gold)" }}>38%</span>
              </div>
              <div className="bar-row">
                <span className="bar-label">Pragmatics</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: "20%", background: "var(--sage)" }}></div></div>
                <span className="bar-val" style={{ color: "var(--sage)" }}>20%</span>
              </div>
              <div className="bar-row">
                <span className="bar-label">Articles</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: "15%", background: "var(--sage)" }}></div></div>
                <span className="bar-val" style={{ color: "var(--sage)" }}>15%</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Skill Radar</div>
            <div className="card-sub">Your strengths at a glance</div>
            <div className="radar-wrap">
              <svg className="radar" viewBox="0 0 200 200" width="200" height="200">
                <polygon points="100,30 170,65 170,135 100,170 30,135 30,65" fill="none" stroke="rgba(26,26,46,0.07)" strokeWidth="1"/>
                <polygon points="100,50 152,77 152,123 100,150 48,123 48,77" fill="none" stroke="rgba(26,26,46,0.07)" strokeWidth="1"/>
                <polygon points="100,70 134,89 134,111 100,130 66,111 66,89" fill="none" stroke="rgba(26,26,46,0.07)" strokeWidth="1"/>
                <line x1="100" y1="30" x2="100" y2="170" stroke="rgba(26,26,46,0.07)" strokeWidth="1"/>
                <line x1="30"  y1="65"  x2="170" y2="135" stroke="rgba(26,26,46,0.07)" strokeWidth="1"/>
                <line x1="170" y1="65"  x2="30"  y2="135" stroke="rgba(26,26,46,0.07)" strokeWidth="1"/>
                <polygon points="100,44 156,80 153,120 100,157 47,120 55,72" fill="rgba(196,98,45,0.15)" stroke="var(--terracotta)" strokeWidth="2"/>
                <text x="100" y="22"  textAnchor="middle" fontSize="10" fill="rgba(26,26,46,0.6)" fontFamily="DM Sans">Fluency</text>
                <text x="178" y="62"  textAnchor="start"  fontSize="10" fill="rgba(26,26,46,0.6)" fontFamily="DM Sans">Pragmatics</text>
                <text x="178" y="140" textAnchor="start"  fontSize="10" fill="rgba(26,26,46,0.6)" fontFamily="DM Sans">Comprehension</text>
                <text x="100" y="184" textAnchor="middle" fontSize="10" fill="rgba(26,26,46,0.6)" fontFamily="DM Sans">Conjugation</text>
                <text x="22"  y="140" textAnchor="end"    fontSize="10" fill="rgba(26,26,46,0.6)" fontFamily="DM Sans">Vocabulary</text>
                <text x="22"  y="62"  textAnchor="end"    fontSize="10" fill="rgba(26,26,46,0.6)" fontFamily="DM Sans">Grammar</text>
              </svg>
            </div>
          </div>
        </div>

        {/* VOCABULARY GROWTH + ACTIVITY HEATMAP */}
        <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
          <div className="card">
            <div className="card-title">Vocabulary Growth</div>
            <div className="card-sub">Unique words used per session</div>
            <div className="line-chart-wrap">
              <svg className="line-chart" viewBox="0 0 400 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(196,98,45,0.2)"/>
                    <stop offset="100%" stopColor="rgba(196,98,45,0)"/>
                  </linearGradient>
                </defs>
                <path d="M0,120 L33,108 L66,100 L99,90 L132,82 L165,74 L198,65 L231,58 L264,50 L297,42 L330,35 L363,28 L400,22 L400,140 L0,140 Z" fill="url(#grad)"/>
                <polyline points="0,120 33,108 66,100 99,90 132,82 165,74 198,65 231,58 264,50 297,42 330,35 363,28 400,22"
                  fill="none" stroke="var(--terracotta)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="0"   cy="120" r="3.5" fill="var(--terracotta)"/>
                <circle cx="66"  cy="100" r="3.5" fill="var(--terracotta)"/>
                <circle cx="132" cy="82"  r="3.5" fill="var(--terracotta)"/>
                <circle cx="198" cy="65"  r="3.5" fill="var(--terracotta)"/>
                <circle cx="264" cy="50"  r="3.5" fill="var(--terracotta)"/>
                <circle cx="330" cy="35"  r="3.5" fill="var(--terracotta)"/>
                <circle cx="400" cy="22"  r="5"   fill="var(--terracotta)" stroke="#fff" strokeWidth="2"/>
                <text x="0"   y="138" fontSize="9" fill="rgba(26,26,46,0.35)" fontFamily="DM Sans" textAnchor="middle">Feb</text>
                <text x="66"  y="138" fontSize="9" fill="rgba(26,26,46,0.35)" fontFamily="DM Sans" textAnchor="middle">Feb 28</text>
                <text x="132" y="138" fontSize="9" fill="rgba(26,26,46,0.35)" fontFamily="DM Sans" textAnchor="middle">Mar 7</text>
                <text x="198" y="138" fontSize="9" fill="rgba(26,26,46,0.35)" fontFamily="DM Sans" textAnchor="middle">Mar 14</text>
                <text x="264" y="138" fontSize="9" fill="rgba(26,26,46,0.35)" fontFamily="DM Sans" textAnchor="middle">Mar 21</text>
                <text x="330" y="138" fontSize="9" fill="rgba(26,26,46,0.35)" fontFamily="DM Sans" textAnchor="middle">Mar 28</text>
                <text x="400" y="138" fontSize="9" fill="rgba(26,26,46,0.35)" fontFamily="DM Sans" textAnchor="middle">Apr</text>
              </svg>
            </div>
            <div style={{ display: "flex", gap: "2rem", marginTop: "0.5rem" }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem" }}>248</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(26,26,46,0.45)" }}>Unique words total</div>
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem" }}>31</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(26,26,46,0.45)" }}>New this week</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Activity Heatmap</div>
            <div className="card-sub">Practice sessions this year</div>
            <div className="heatmap-months">
              <span>Feb</span><span>Mar</span><span></span><span>Apr</span><span></span>
              <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
            </div>
            <div className="heatmap-grid" id="heatmap"></div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.8rem", fontSize: "0.72rem", color: "rgba(26,26,46,0.4)" }}>
              Less
              <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--cream)", border: "1px solid rgba(26,26,46,0.1)" }}></div>
              <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "rgba(196,98,45,0.2)" }}></div>
              <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "rgba(196,98,45,0.45)" }}></div>
              <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "var(--terracotta)" }}></div>
              More
            </div>
          </div>
        </div>

        {/* STRENGTHS + RECOMMENDATIONS */}
        <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
          <div className="card">
            <div className="card-title">Strengths &amp; Areas to Improve</div>
            <div className="card-sub">Based on your last 5 sessions</div>
            <div style={{ marginBottom: "0.75rem", fontSize: "0.78rem", fontWeight: 500, color: "var(--sage)", letterSpacing: "0.05em", textTransform: "uppercase" }}>✓ Top Strengths</div>
            <div className="strength-list" style={{ marginBottom: "1.2rem" }}>
              <div className="strength-item good"><span className="strength-icon">🎯</span> Contextually appropriate responses in casual conversation</div>
              <div className="strength-item good"><span className="strength-icon">💬</span> Response fluency and sentence length improving</div>
              <div className="strength-item good"><span className="strength-icon">📚</span> Strong vocabulary diversity (31 new words this week)</div>
            </div>
            <div style={{ marginBottom: "0.75rem", fontSize: "0.78rem", fontWeight: 500, color: "var(--gold)", letterSpacing: "0.05em", textTransform: "uppercase" }}>⚠ Areas to Improve</div>
            <div className="strength-list">
              <div className="strength-item improve"><span className="strength-icon">🔧</span> Verb conjugation in past tense (preterite vs. imperfect)</div>
              <div className="strength-item improve"><span className="strength-icon">📝</span> Gender agreement with nouns and adjectives</div>
              <div className="strength-item improve"><span className="strength-icon">🔄</span> Use of subjunctive mood in complex sentences</div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Personalized Recommendations</div>
            <div className="card-sub">Suggested next steps for you</div>
            <div className="reco-list">
              <div className="reco-item">
                <span className="reco-icon">🍽</span>
                <div className="reco-text">
                  <strong>Practice: Dining scenario</strong>
                  <span>You're getting comfortable here. Push to Advanced difficulty.</span>
                </div>
              </div>
              <div className="reco-item">
                <span className="reco-icon">📖</span>
                <div className="reco-text">
                  <strong>Grammar: Preterite vs. Imperfect</strong>
                  <span>Focus on storytelling scenarios to practice past tense naturally.</span>
                </div>
              </div>
              <div className="reco-item">
                <span className="reco-icon">✈️</span>
                <div className="reco-text">
                  <strong>New scenario: Travel</strong>
                  <span>You haven't tried Travel yet — great for expanding vocabulary.</span>
                </div>
              </div>
              <div className="reco-item">
                <span className="reco-icon">🔥</span>
                <div className="reco-text">
                  <strong>Keep your streak alive!</strong>
                  <span>You're on a 5-day streak. Practice today to keep it going.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONVERSATION HISTORY */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <div className="card-title">Conversation History</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* Filter dropdown */}
              <FilterDropdown value={filter} onChange={setFilter} />
              <Link to="/conversations" style={{ fontSize: "0.82rem", color: "var(--terracotta)", textDecoration: "none" }}>+ New session</Link>
            </div>
          </div>
          <div className="card-sub">
            All saved sessions with performance data
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "var(--terracotta)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                Clear filter ✕
              </button>
            )}
          </div>
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th><th>Scenario</th><th>Duration</th><th>Messages</th><th>Score</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConvos.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "rgba(26,26,46,0.4)", padding: "1.5rem" }}>
                    {conversations.length === 0
                      ? "No conversations yet. Start a session to see your history."
                      : "No sessions match this filter."}
                  </td>
                </tr>
              )}
              {filteredConvos.map((convo) => {
                const meta     = SCENARIO_META[convo.scenario?.toLowerCase()] || { label: convo.title || "General" };
                const scoreVal = convo.score?.score;
                const msgCount = convo.messages?.filter(m => m.role === "user").length || 0;
                return (
                  <tr key={convo.id}>
                    <td>{formatDate(convo.id)}</td>
                    <td><span className={`tag ${convo.scenario?.toLowerCase()}`}>{meta.label}</span></td>
                    <td>—</td>
                    <td>{msgCount}</td>
                    <td>
                      {scoreVal != null
                        ? <><span className={scoreDotClass(scoreVal)}></span>{scoreVal}%</>
                        : <span style={{ color: "rgba(26,26,46,0.35)" }}>—</span>
                      }
                    </td>
                    <td style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      {/* Review button opens the modal */}
                      <button
                        onClick={() => setSelectedConvo(convo)}
                        style={{ fontSize: "0.8rem", color: "var(--terracotta)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}
