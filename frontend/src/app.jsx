import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./auth/firebase";
import { onAuthStateChanged } from "firebase/auth";

import "./styles/index.css";

import Navbar from "./components/nav/nav";
import Home from "./pages/home/home";
import Footer from "./components/footer/footer";
// import Registration from "./pages/register/registration";
import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/dashboard";
import Settings from "./pages/settings/settings";
import Conversations from "./pages/conversations/conversations";

// console.log("ENV TEST:", process.env.REACT_APP_FIREBASE_API_KEY);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />
        {/* <Route
          path="/register"
          element={!user ? <Registration /> : <Navigate to="/dashboard" />}
        /> */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/settings"
          element={user ? <Settings user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/conversations"
          element={user ? <Conversations /> : <Navigate to="/login" />}
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
