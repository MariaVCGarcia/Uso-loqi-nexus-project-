import "./conversations.css";
import { useState } from "react";

export default function Conversations() {
  // const messages = activeChat?.messages || [];

  const [conversations, setConversations] = useState([
    {
      id: "1",
      title: "New Chat",
      messages: [
        {
          role: "ai",
          text: "¡Buenas tardes! Bienvenido al restaurante.",
          time: "12:00 PM",
        },
      ],
    },
  ]);

  const [activeChatId, setActiveChatId] = useState("1");
  const [input, setInput] = useState("");

  const activeChat = conversations.find((chat) => chat.id === activeChatId);

  const createNewChat = () => {
    const newId = Date.now().toString();

    const newChat = {
      id: newId,
      title: "New Chat",
      messages: [],
    };

    setConversations((prev) => [newChat, ...prev]);
    setActiveChatId(newId);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const currentInput = input;
    setInput("");

    // add user message
    setConversations((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              title:
                chat.title === "New Chat"
                  ? currentInput.slice(0, 20)
                  : chat.title,
            }
          : chat,
      ),
    );

    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: currentInput,
      }),
    });

    const data = await res.json();

    const aiMessage = {
      role: "ai",
      text: data.reply,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setConversations((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, aiMessage],
            }
          : chat,
      ),
    );
  };

  return (
    <div className="chat-page">
      {/* SIDEBAR */}
      <aside className="chat-sidebar">
        <div className="sidebar-section">
          <button className="btn-new-chat" onClick={createNewChat}>
            + New Conversation
          </button>
        </div>
        <div className="sidebar-label">Scenarios</div>
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
              {chat.title}
            </div>
          ))}

          <div className="scenario-list">
            <div className="scenario-item">
              <span className="scenario-icon">🍽</span> Dining
            </div>
            <div className="scenario-item">
              <span className="scenario-icon">✈️</span> Travel
            </div>
            <div className="scenario-item">
              <span className="scenario-icon">💼</span> Business
            </div>
            <div className="scenario-item">
              <span className="scenario-icon">💬</span> Casual
            </div>
            <div className="scenario-item">
              <span className="scenario-icon">🎓</span> Academic
            </div>
            <div className="scenario-item">
              <span className="scenario-icon">🛒</span> Practical
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
          <span>00:00</span>
          <span>Dining scenario · Intermediate</span>
        </div>

        <div className="messages">
          {activeChat?.messages.map((msg, index) => (
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
          <div className="input-row">
            <textarea
              className="chat-input"
              rows="1"
              placeholder="Escribe en español…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="send-btn" onClick={sendMessage}>
              ➤
            </button>
          </div>
          <div className="input-hint">
            Press Enter to send · Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}
