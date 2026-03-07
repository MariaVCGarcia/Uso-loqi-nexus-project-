import { useState } from "react";
import { auth } from "./firebase";
import {createUserWithEmailAndPassword} from 'firebase/auth'



export const Auth = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const signIn = async() => {
        await createUserWithEmailAndPassword(auth, email, password)
    }
    return (
        <div>
            <input
                name="Email..."
                onChange={(e) => setEmail(e.target.value)}/>
            <input
                name="Password..."
                onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={signIn}> Login </button>
        </div>
    )
}