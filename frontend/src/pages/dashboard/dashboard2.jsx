import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { db } from "../../auth/firebase";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import "./dashboard2.css";

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
function Drawer({ displayName, level, onClose }) {
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
          <a href="/" className="drawer-logo">Uso <span>Loqui</span></a>
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

const QUOTES = [
  { text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela" },
  { text: "Learning another language is not only learning different words for the same things, but learning another way to think about things.",
    author:"Flora Lewis"},
  { text: "To have another language is to possess a second soul.",
    author: "Charlemagne" },
  { text: "One language sets you in a corridor for life. Two languages open every door along the way.",
    author: "Frank Smith" },
  { text: "Never give up trying to learn the language you want to learn, be consistent, have fun and trust the process.",
    author: "Camille Hanson" },
  { text: "Languages aren't just made of words. They're modes of looking at the world.",
    author: "R. F. Kuang" },
  { text: "Do the best you can until you know better. Then when you know better, do better.",
    author: "Maya Angelou" },
];

/* ─── Main Dashboard ─── */
export default function Dashboard({ user }) {
  const displayName = user?.displayName?.split(" ")[0] || user?.email || "there";

  const [level, setLevel] = useState(null);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [conversations, setConversations] = useState([]);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Dropdown filter state
  const [filter, setFilter] = useState("all");

  // Modal state — holds the selected convo or null
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [monthOffset, setMonthOffset] = useState(0);

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

  //for time saving function
  const totalSeconds = conversations.reduce((sum, c) => sum + (c.duration || 0), 0);
  const totalMinutes = (totalSeconds / 60).toFixed(1);


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
              <p>Welcome back, {displayName}!</p>
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
            <div className="stat-card-value">{totalMinutes}</div>
            <div className="stat-card-sub">active time in minutes</div>
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

        {/* INSPIRATIONAL QUOTE */}
        <div className="card quote-card" style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ fontSize: "2rem", lineHeight: 1 }}>💬</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontStyle: "italic", marginBottom: "0.35rem" }}>
              "{quote.text}"
            </div>
            <div style={{ fontSize: "0.78rem", color: "rgba(26,26,46,0.45)", fontWeight: 500 }}>— {quote.author}</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
        {(() => {
          const today = new Date();
          const display = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
          const year = display.getFullYear();
          const month = display.getMonth();
          const monthName = display.toLocaleString("en-US", { month: "long", year: "numeric" });
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;

          const activeDays = {};
          conversations.forEach((c) => {
            const ts = parseInt(c.id);
            if (!isNaN(ts)) {
              const key = new Date(ts).toDateString();
              activeDays[key] = (activeDays[key] || 0) + 1;
            }
          });

          function heatLevel(count) {
            return count ? "l4" : "";
          }

          const cells = [];
          for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
          for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

          return (
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                <div className="card-title">Calendar</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button onClick={() => setMonthOffset(o => o - 1)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", color: "var(--ink)", opacity: 0.6 }}>‹</button>
                  <span style={{ fontSize: "0.85rem", fontWeight: 500, minWidth: "7rem", textAlign: "center" }}>{monthName}</span>
                  <button onClick={() => setMonthOffset(o => Math.min(o + 1, 0))} disabled={monthOffset === 0} style={{ background: "none", border: "none", cursor: monthOffset < 0 ? "pointer" : "default", fontSize: "1.1rem", color: "var(--ink)", opacity: monthOffset < 0 ? 0.6 : 0.2 }}>›</button>
                </div>
              </div>
              <div className="card-sub">Practice sessions — {monthName}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginTop: "0.75rem", marginBottom: "4px" }}>
                {["M","T","W","T","F","S","S"].map((d, i) => (
                  <div key={i} style={{ textAlign: "center", fontSize: "0.65rem", color: "rgba(26,26,46,0.35)" }}>{d}</div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
                {cells.map((day, i) => {
                  if (!day) return <div key={i} />;
                  const count = activeDays[day.toDateString()] || 0;
                  const isToday = day.toDateString() === today.toDateString();
                  const tip = count
                    ? `${count} session${count !== 1 ? "s" : ""} · ${day.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                    : day.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  return (
                    <div
                      key={i}
                      className={`heat-cell ${heatLevel(count)}`}
                      data-tip={tip}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: count ? "#fff" : "rgba(26,26,46,0.35)", fontWeight: 500, ...(isToday ? { outline: "2px solid var(--terracotta)", outlineOffset: "1px" } : {}) }}
                    >
                      {day.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

          {/* FILLER */}
          <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px", color: "rgba(26,26,46,0.25)", fontSize: "0.85rem", fontStyle: "italic" }}>
            Coming soon
          </div>
        </div>

        {/* CONVERSATION HISTORY */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <div className="card-title">Conversation History</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* Filter dropdown */}
              <FilterDropdown value={filter} onChange={setFilter} />
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
                <th>Date</th><th>Scenario</th><th>Messages</th><th>Score</th><th>Actions</th>
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
