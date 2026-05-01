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
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (!timerActive) return;
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [timerActive]);

  const activeChat = conversations.find((c) => c.id === activeChatId) || conversations[0];

  const todayStr = new Date().toDateString();
  const todayConvos = conversations.filter((c) => {
    const ts = parseInt(c.id);
    return !isNaN(ts) && new Date(ts).toDateString() === todayStr;
  });
  const todayMessages = todayConvos.reduce((sum, c) => sum + (c.messages?.filter((m) => m.role === "user").length || 0), 0);
  const todaySeconds = todayConvos.reduce((sum, c) => sum + (c.duration || 0), 0) + elapsed;
  const todayTime = Math.floor(todaySeconds / 60);

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
        <div className="sidebar-section">
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
              <span className="stat-mini-num">{todayMessages}</span>
              <div className="stat-mini-label">Messages</div>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-num">{todayTime}m</span>
              <div className="stat-mini-label">Time</div>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-num">{todayConvos.length}</span>
              <div className="stat-mini-label">Conversations</div>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-num">{{ beginner: "Beg", intermediate: "Int", advanced: "Adv" }[level] || level}</span>
              <div className="stat-mini-label">Level</div>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Your conversations</div>
          {conversations.map((chat) => (
            <div
              key={chat.id}
              className={`scenario-item ${chat.id === activeChatId ? "active" : ""}`}
              onClick={() => setActiveChatId(chat.id)}
            >
              <span className="scenario-icon">💬</span>
              <span style={{ flex: 1 }}>{chat.title}</span>
              <button className="delete-btn" onClick={() => deleteConversations(chat.id)}>🗑</button>
            </div>
          ))}
        </div>
      </aside>

      {/* CHAT AREA */}
      <div className="chat-area">
        <div className="session-bar">
          <span>
            <span className="live-dot"></span> Session active
          </span>
          <span>{formatTime(elapsed)}</span>
          <span>{activeChat?.title || "New conversation"} · {level.charAt(0).toUpperCase() + level.slice(1)}</span>
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
            💡 Tip: Click the lightbulb to help you respond!
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

            <button className="send-btn" onClick={() => { if (!timerActive) setTimerActive(true); sendMessage(); }}>
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
