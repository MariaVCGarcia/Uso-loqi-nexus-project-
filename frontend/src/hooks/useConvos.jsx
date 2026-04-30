import { useState, useEffect, useRef } from "react";
import { db, auth } from "../auth/firebase";
import { sendToAI, getHint } from "../services/aiService";
import { saveConvo, deleteConvo, saveSessionDoc } from "../services/convoDb";

import { collection, onSnapshot } from "firebase/firestore";

export default function useConvos() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  const initializedRef = useRef(false);

  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const [input, setInput] = useState("");

  // Set level
  const [level, setLevel] = useState("beginner");

  // Hints
  const [hint, setHint] = useState("");
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!user) return;
    const ref = collection(db, "users", user.uid, "conversations");
    const unsub = onSnapshot(ref, (snapshot) => {
      const convos = snapshot.docs.map((d) => d.data());
      setConversations(convos);
      if (!initializedRef.current && convos.length > 0) {
        setActiveChatId(convos[0].id);
        initializedRef.current = true;
      }
    });
    return () => unsub();
  }, [user?.uid]);

  // SAVE WHEN DATA CHANGES

  const activeChat =
    conversations.find((chat) => chat.id === activeChatId) || conversations[0];
  const messages = activeChat?.messages || [];

  const createNewChat = (scenario = "New convo") => {
    const lowerCaseScenario = scenario.toLowerCase();
    const newId = Date.now().toString();

    const newChat = {
      id: newId,
      title: scenario,
      scenario: lowerCaseScenario,
      messages: [],
    };

    saveConvo(user, newChat);
    setActiveChatId(newId);
  };

  const saveSession = async () => {
    if (!user || messages.length === 0) return;
    try {
      await saveSession(user, {
        userId: user.uid,
        scenario: activeChat?.id,
        scenarioLabel: activeChat?.title,
        messages: messages.map(({ role, text }) => ({
          role,
          text,
        })),
        messageCount: messages.length,
      });
    } catch (err) {
      console.error("Failed to save session:", err);
    }
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

    const currentInput = input;
    setInput("");

    const userMessage = {
      role: "user",
      text: currentInput,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const aiResponse = await sendToAI(
      currentInput,
      activeChat?.scenario,
      level,
    );

    const aiMessage = {
      role: "ai",
      text: aiResponse.reply,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const finalChat = {
      ...activeChat,
      messages: [...messages, userMessage, aiMessage],
      title:
        (activeChat?.title || "New Chat") === "New Chat"
          ? currentInput.slice(0, 20)
          : activeChat?.title,
    };

    setConversations((prev) =>
      prev.map((chat) => (chat.id === activeChatId ? finalChat : chat)),
    );

    saveConvo(user, finalChat);
  };
  // Delete conversations
  const deleteConversations = async (chatId) => {
    if (user) {
      await deleteConvo(user, chatId);
    }
    setConversations((prev) => {
      const updated = prev.filter((chat) => chat.id !== chatId);

      // if you delete the active chat, switch to another one
      if (chatId === activeChatId && updated.length > 0) {
        setActiveChatId(updated[0].id);
      }

      if (updated.length === 0) {
        const newId = Date.now().toString();

        const newChat = {
          id: newId,
          title: "New Chat",
          scenario: "New convo",
          messages: [],
        };

        setConversations([newChat]);
        setActiveChatId(newId);
        return [newChat];
      }

      return updated;
    });
  };

  const requestHint = async () => {
    let targetText = input.trim();

    if (!targetText) {
      const lastMessage = [...messages].slice(-1)[0];
      targetText = lastMessage?.text || "";
    }

    try {
      const hintResponse = await getHint(
        targetText,
        activeChat?.scenario,
        level,
        messages,
      );

      setHint(hintResponse.hint);
      setShowHint(true);
    } catch (err) {
      console.error(err);
    }
  };

  // SAVE STATES

  return {
    conversations,
    activeChatId,
    setActiveChatId,
    input,
    setInput,
    sendMessage,
    saveSession,
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
  };
}
