import "./conversations.css";
import "./hints.css";
import { useState, useEffect } from "react";
import useConvos from "../../hooks/useConvos";

export default function Conversations() {
  const {
    conversations,
    activeChatId,
    setActiveChatId,
    input,
    setInput,
    sendMessage,
    createNewChat,
    messages,
    openScenarioChat,
    deleteConversations,
    level,
    setLevel,
    hint,
    showHint,
    setShowHint,
    requestHint,
  } = useConvos();

  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="chat-page">
      {/* SIDEBAR */}
      <aside className="chat-sidebar">
        <div className="sidebar-section">
          <button className="btn-new-chat" onClick={() => createNewChat()}>
            + New Conversation
          </button>
        </div>
        <div className="sidebar-label">Your conversations</div>
        <div className="sidebar-section">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              className={`scenario-item ${
                chat.id === activeChatId ? "active" : ""
              }`}
              onClick={() => setActiveChatId(chat.id)}
            >
              <span className="scenario-icon">💬</span>

              <span style={{ flex: 1 }}>{chat.title}</span>

              <button
                className="delete-btn"
                onClick={(e) => {
                  deleteConversations(chat.id);
                }}
              >
                🗑
              </button>
            </div>
          ))}
          <div className="sidebar-label">Scenarios</div>
          <div className="scenario-list">
            <div
              className="scenario-item"
              onClick={() => openScenarioChat("Dining")}
            >
              <span className="scenario-icon">🍽</span>
              Dining
            </div>
            <div
              className="scenario-item"
              onClick={() => openScenarioChat("Travel")}
            >
              <span className="scenario-icon">✈️</span>
              Travel
            </div>
            <div
              className="scenario-item"
              onClick={() => openScenarioChat("Business")}
            >
              <span className="scenario-icon">💼</span>
              Business
            </div>
            <div
              className="scenario-item"
              onClick={() => openScenarioChat("Casual")}
            >
              <span className="scenario-icon">💬</span>
              Casual
            </div>
            <div
              className="scenario-item"
              onClick={() => openScenarioChat("Academic")}
            >
              <span className="scenario-icon">🎓</span>
              Academic
            </div>
            <div
              className="scenario-item"
              onClick={() => openScenarioChat("Practical")}
            >
              <span className="scenario-icon">🛒</span>
              Practical
            </div>
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
          <span>
            <span className="live-dot"></span> Session active
          </span>
          <span>{formatTime(elapsed)}</span>
          <span>Dining scenario · Intermediate</span>
        </div>

        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`msg-row ${msg.role === "user" ? "user" : ""}`}
            >
              <div className={`msg-avatar ${msg.role}`}>
                {msg.role === "user" ? "J" : "U"}
              </div>

              <div>
                <div className={`bubble ${msg.role}`}>{msg.text}</div>
                <div className="msg-time">{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="input-area">
          <div className="translate-hint">
            💡 Tip: Click any underlined word to see its translation.
          </div>
          <select
            className="set-level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <div className="input-row">
            <textarea
              className="chat-input"
              rows="1"
              placeholder="Escribe en español…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="hint-btn" onClick={requestHint} title="Get hint">
              💡
            </button>

            <button className="send-btn" onClick={sendMessage}>
              ➤
            </button>
          </div>
          <div className="input-hint">
            Press Enter to send · Shift+Enter for new line
          </div>
        </div>
        {showHint && (
          <div className="hint-box">
            <div className="hint-header">
              💡 Hint
              <button onClick={() => setShowHint(false)}>✖</button>
            </div>

            <pre className="hint-text">{hint}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
