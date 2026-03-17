import "./styles/index.css";
import Navbar from "./components/nav/nav";
import Footer from "./components/footer/footer";
import Registration from "./auth/registration";
// import Home from "./pages/home/home";

function App() {
  return (
    <>
      <Navbar />
      {/* <Home /> */}
      <Registration />
      <Footer />
    </>
  );
}

export default App;
