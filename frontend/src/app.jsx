import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./authentication/firebase";
import { Auth } from "./authentication/auth";

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return <p>Loading...</p>;

    if (!user) return <Auth />;

    return (
        <div>
            <p>Welcome, {user.email}</p>
            <button onClick={() => signOut(auth)}>Sign Out</button>
        </div>
    );
}
