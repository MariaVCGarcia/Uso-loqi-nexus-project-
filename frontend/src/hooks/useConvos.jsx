import { useState, useEffect, useRef } from "react";
import { db, auth} from "../auth/firebase";
import { collection, addDoc, doc, onSnapshot, setDoc, deleteDoc } from "firebase/firestore";

export default function useConvos() {

  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  const initializedRef = useRef(false);

  // const messages = activeChat?.messages || [];

  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);


  const saveConvo = (convo) => {
    if (!user) return;
    setDoc(doc(db, "users", user.uid, "conversations", convo.id), convo);
  };

  const [input, setInput] = useState("");
  const [level, setLevel] = useState("beginner");

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

    saveConvo(newChat);
    setActiveChatId(newId);
  };

  const saveSession = async () => {
    if (!user || messages.length === 0) return;
    try {
      await addDoc(collection(db, "conversations"), {
        userId: user.uid,
        scenario: activeChat?.id,
        scenarioLabel: activeChat?.title,
        messages: messages.map(({role, text}) => ({role, text})),
        messageCount: messages.length,
      });
    } catch (err) {
      console.error("Failed to save session:", err);
    }
  }

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


    const updatedChat = {
      ...activeChat,
      messages: [...messages, userMessage],
      title: activeChat.title === "New Chat" ? currentInput.slice(0, 20) : activeChat.title,
    };

    // add user message
    setConversations((prev) =>
      prev.map((chat) =>
          (chat.id === activeChatId ? updatedChat : chat))
    );
    saveConvo(updatedChat);

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

    const finalChat = { ...updatedChat, messages: [...updatedChat.messages, aiMessage] };
    setConversations((prev) =>
      prev.map((chat) =>
          (chat.id === activeChatId ? finalChat : chat))
    );
    saveConvo(finalChat);
  };

  // Delete conversations
  const deleteConversations = (chatId) => {
    if (user) {
      deleteDoc(doc(db, "users", user.uid, "conversations", chatId));
    }
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
  };
}
