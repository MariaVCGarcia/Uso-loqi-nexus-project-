import { db } from "../auth/firebase";
import { doc, setDoc, deleteDoc, addDoc, collection } from "firebase/firestore";

export function saveConvo(user, convo) {
  if (!user) return;
  return setDoc(doc(db, "users", user.uid, "conversations", convo.id), convo);
}

export function deleteConvo(user, chatId) {
  if (!user) return;
  return deleteDoc(doc(db, "users", user.uid, "conversations", chatId));
}

export async function saveSession(user, sessionData) {
  if (!user) return;

  try {
    await addDoc(collection(db, "conversations"), sessionData);
  } catch (err) {
    console.error("Failed to save session:", err);
  }
}
