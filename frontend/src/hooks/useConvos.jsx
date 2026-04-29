import { useState, useEffect } from "react";

export default function useConvos() {
  // const messages = activeChat?.messages || [];

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("conversations");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            title: "New Chat",
            messages: [
              {
                role: "ai",
                text: "Hola! Type something in Spanish to start working!",
                time: "12:00 PM",
              },
            ],
          },
        ];
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    return localStorage.getItem("activeChatId") || "1";
  });

  const [input, setInput] = useState("");
  const [level, setLevel] = useState("beginner");

  useEffect(() => {
    const savedChats = localStorage.getItem("conversations");
    const savedActive = localStorage.getItem("activeChatId");

    if (savedChats) {
      setConversations(JSON.parse(savedChats));
    }

    if (savedActive) {
      setActiveChatId(savedActive);
    }
  }, []);

  // SAVE WHEN DATA CHANGES
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));

    localStorage.setItem("activeChatId", activeChatId);
  }, [conversations, activeChatId]);

  const activeChat = conversations.find((chat) => chat.id === activeChatId);
  const messages = activeChat?.messages || [];

  const createNewChat = (scenario = "New convo") => {
    const newId = Date.now().toString();

    const newChat = {
      id: newId,
      title: scenario,
      scenario: scenario,
      messages: [],
    };

    setConversations((prev) => [newChat, ...prev]);
    setActiveChatId(newId);
  };

  const openScenarioChat = (scenario) => {
    const existing = conversations.find((chat) => chat.scenario === scenario);
    if (existing) {
      setActiveChatId(existing.id);
    } else {
      createNewChat(scenario);
    }
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
        scenario: activeChat?.scenario,
        level: level,
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

  // Delete conversations
  const deleteConversations = (chatId) => {
    setConversations((prev) => {
      const updated = prev.filter((chat) => chat.id !== chatId);

      // if you delete the active chat, switch to another one
      if (chatId === activeChatId && updated.length > 0) {
        setActiveChatId(updated[0].id);
      }

      return updated;
    });
  };

  // SAVE STATES
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem("activeChatId", activeChatId);
  }, [activeChatId]);

  return {
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
  };
}
