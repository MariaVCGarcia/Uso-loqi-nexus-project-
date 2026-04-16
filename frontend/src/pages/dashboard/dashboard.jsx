import { Link } from "react-router-dom";
import "./dashboard.css";

export default function Dashboard() {
  return (
    <div className="page">

      {/* HEADER */}
      <div className="dash-header">
        <div>
          <h1>Your Progress</h1>
          <p>Welcome back, Joseph · 5-day streak 🔥 · Last session: Today</p>
        </div>
        <div className="cefr-badge">B1 <span>Intermediate</span></div>
      </div>

      {/* TOP STAT CARDS */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card-label">Total Conversations</div>
          <div className="stat-card-value">24</div>
          <div className="stat-card-sub">Since Feb 20, 2026</div>
          <div className="stat-card-trend trend-up">↑ 3 this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Messages Sent</div>
          <div className="stat-card-value">318</div>
          <div className="stat-card-sub">Across all sessions</div>
          <div className="stat-card-trend trend-up">↑ 12% vs last week</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Time Practiced</div>
          <div className="stat-card-value">6.4h</div>
          <div className="stat-card-sub">Total time in Spanish</div>
          <div className="stat-card-trend trend-up">↑ 40m this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Overall Error Rate</div>
          <div className="stat-card-value">18%</div>
          <div className="stat-card-sub">Down from 27% at start</div>
          <div className="stat-card-trend trend-up">↓ Improving</div>
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
              <text x="100" y="22" textAnchor="middle" fontSize="10" fill="rgba(26,26,46,0.6)" fontFamily="DM Sans">Fluency</text>
              <text x="178" y="62" textAnchor="start"  fontSize="10" fill="rgba(26,26,46,0.6)" fontFamily="DM Sans">Pragmatics</text>
              <text x="178" y="140" textAnchor="start" fontSize="10" fill="rgba(26,26,46,0.6)" fontFamily="DM Sans">Comprehension</text>
              <text x="100" y="184" textAnchor="middle" fontSize="10" fill="rgba(26,26,46,0.6)" fontFamily="DM Sans">Conjugation</text>
              <text x="22"  y="140" textAnchor="end"   fontSize="10" fill="rgba(26,26,46,0.6)" fontFamily="DM Sans">Vocabulary</text>
              <text x="22"  y="62"  textAnchor="end"   fontSize="10" fill="rgba(26,26,46,0.6)" fontFamily="DM Sans">Grammar</text>
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
          <div className="card-title">Conversation History</div>
          <Link to="/conversations" style={{ fontSize: "0.82rem", color: "var(--terracotta)", textDecoration: "none" }}>+ New session</Link>
        </div>
        <div className="card-sub">All saved sessions with performance data</div>
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th><th>Scenario</th><th>Duration</th><th>Messages</th><th>Score</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Apr 15, 2026</td>
              <td><span className="tag dining">🍽 Dining</span></td>
              <td>22 min</td><td>34</td>
              <td><span className="score-dot score-high"></span>88%</td>
              <td><a href="#" style={{ fontSize: "0.8rem", color: "var(--terracotta)", textDecoration: "none" }}>Review</a></td>
            </tr>
            <tr>
              <td>Apr 14, 2026</td>
              <td><span className="tag casual">💬 Casual</span></td>
              <td>18 min</td><td>27</td>
              <td><span className="score-dot score-mid"></span>74%</td>
              <td><a href="#" style={{ fontSize: "0.8rem", color: "var(--terracotta)", textDecoration: "none" }}>Review</a></td>
            </tr>
            <tr>
              <td>Apr 13, 2026</td>
              <td><span className="tag travel">✈️ Travel</span></td>
              <td>30 min</td><td>46</td>
              <td><span className="score-dot score-mid"></span>70%</td>
              <td><a href="#" style={{ fontSize: "0.8rem", color: "var(--terracotta)", textDecoration: "none" }}>Review</a></td>
            </tr>
            <tr>
              <td>Apr 12, 2026</td>
              <td><span className="tag business">💼 Business</span></td>
              <td>25 min</td><td>38</td>
              <td><span className="score-dot score-high"></span>82%</td>
              <td><a href="#" style={{ fontSize: "0.8rem", color: "var(--terracotta)", textDecoration: "none" }}>Review</a></td>
            </tr>
            <tr>
              <td>Apr 11, 2026</td>
              <td><span className="tag dining">🍽 Dining</span></td>
              <td>15 min</td><td>21</td>
              <td><span className="score-dot score-low"></span>61%</td>
              <td><a href="#" style={{ fontSize: "0.8rem", color: "var(--terracotta)", textDecoration: "none" }}>Review</a></td>
            </tr>
            <tr>
              <td>Apr 10, 2026</td>
              <td><span className="tag academic">🎓 Academic</span></td>
              <td>28 min</td><td>40</td>
              <td><span className="score-dot score-mid"></span>76%</td>
              <td><a href="#" style={{ fontSize: "0.8rem", color: "var(--terracotta)", textDecoration: "none" }}>Review</a></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}