import "./nav.css";
export default function Navbar() {
  return (
    <nav>
      <a href="#" className="nav-logo">
        Usu <span>Loqui</span>
      </a>

      <ul className="nav-links">
        <li>
          <a href="#features">Features</a>
        </li>
        <li>
          <a href="#how">How it works</a>
        </li>
        <li>
          <a href="#levels">Levels</a>
        </li>
        <li>
          <a href="#" className="btn-nav">
            Get Started
          </a>
        </li>
      </ul>
    </nav>
  );
}
