import "./conversations.css";

export default function Conversations() {
  return (
    <div className="chat-page">

      {/* SIDEBAR */}
      <aside className="chat-sidebar">
        <div className="sidebar-section">
          <button className="btn-new-chat">+ New Conversation</button>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Scenarios</div>
          <div className="scenario-list">
            <div className="scenario-item active"><span className="scenario-icon">🍽</span> Dining</div>
            <div className="scenario-item"><span className="scenario-icon">✈️</span> Travel</div>
            <div className="scenario-item"><span className="scenario-icon">💼</span> Business</div>
            <div className="scenario-item"><span className="scenario-icon">💬</span> Casual</div>
            <div className="scenario-item"><span className="scenario-icon">🎓</span> Academic</div>
            <div className="scenario-item"><span className="scenario-icon">🛒</span> Practical</div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Today's Stats</div>
          <div className="sidebar-stats">
            <div className="stat-mini">
              <span className="stat-mini-num">0</span>
              <div className="stat-mini-label">Messages</div>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-num">0m</span>
              <div className="stat-mini-label">Time</div>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-num">14</span>
              <div className="stat-mini-label">Words used</div>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-num">B1</span>
              <div className="stat-mini-label">Level</div>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Login Streak</div>
          <div className="streak-box">
            <div className="streak-number">🔥 5</div>
            <div className="streak-label">days in a row</div>
          </div>
        </div>
      </aside>

      {/* CHAT AREA */}
      <div className="chat-area">
        <div className="session-bar">
          <span><span className="live-dot"></span> Session active</span>
          <span>00:00</span>
          <span>Dining scenario · Intermediate</span>
        </div>

        <div className="messages">
          <div className="date-divider">Today</div>

          <div className="msg-row">
            <div className="msg-avatar ai">U</div>
            <div>
              <div className="bubble ai">¡Buenas tardes! Bienvenido al restaurante. ¿Tiene una <span className="translated-word ai-bubble" title="reservation">reservación</span>?</div>
              <div className="msg-time">2:14 PM</div>
            </div>
          </div>

          <div className="msg-row user">
            <div className="msg-avatar user">J</div>
            <div>
              <div className="bubble user">Sí, tengo una reservación para dos personas.</div>
              <div className="msg-time">2:15 PM</div>
            </div>
          </div>

          <div className="msg-row">
            <div className="msg-avatar ai">U</div>
            <div>
              <div className="bubble ai">¡Perfecto! ¿A nombre de quién está la <span className="translated-word ai-bubble" title="reservation">reservación</span>?</div>
              <div className="msg-time">2:15 PM</div>
            </div>
          </div>
        </div>

        {/* INPUT */}
        <div className="input-area">
          <div className="translate-hint">💡 Tip: Click any underlined word to see its translation.</div>
          <div className="input-row">
            <textarea
              className="chat-input"
              rows="1"
              placeholder="Escribe en español…"
            />
            <button className="send-btn">➤</button>
          </div>
          <div className="input-hint">Press Enter to send · Shift+Enter for new line</div>
        </div>
      </div>

    </div>
  );
}