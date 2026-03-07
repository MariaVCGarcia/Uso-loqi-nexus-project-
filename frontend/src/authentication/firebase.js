
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyADc4uV2eWcVfA5-_xM9yIwFvUDi5RBZ1U",
    authDomain: "uso-loqi.firebaseapp.com",
    projectId: "uso-loqi",
    storageBucket: "uso-loqi.firebasestorage.app",
    messagingSenderId: "113175929628",
    appId: "1:113175929628:web:c514d998be266ece80d0d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);