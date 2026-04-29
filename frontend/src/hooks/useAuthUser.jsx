import { useState, useEffect } from "react";
import { auth } from "../auth/firebase";

export default function useAuthUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  return user;
}
