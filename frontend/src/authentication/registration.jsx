import {useEffect, useState} from "react";
import { auth } from "./firebase";
import {createUserWithEmailAndPassword, onAuthStateChanged, signOut} from 'firebase/auth'


//Function Output to the user for registration
export const Auth = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const registration = async() => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
        } catch (err) {
            console.error(err)
        }
    }


    return (
        <div>
            <input
                placeholder="Email..."
                onChange={(e) => setEmail(e.target.value)}/>
            <input
                placeholder="Password..."
                onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={registration}> Register </button>
        </div>
    )
}

//Function Output to the user after registration. Function called in app.jsx for execution
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