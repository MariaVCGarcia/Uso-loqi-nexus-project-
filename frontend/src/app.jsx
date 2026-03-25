import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState, useEffect, use } from "react";
import { auth } from "./auth/firebase";
import { onAuthStateChanged } from "firebase/auth";

import "./styles/index.css";

import Navbar from "./components/nav/nav";
import Home from "./pages/home/home";
import Footer from "./components/footer/footer";
import Registration from "./pages/register/registration";
import Login from "./pages/login/login";

console.log("ENV TEST:", process.env.REACT_APP_FIREBASE_API_KEY);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar user={user}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/register"
          element={!user ? <Registration /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
