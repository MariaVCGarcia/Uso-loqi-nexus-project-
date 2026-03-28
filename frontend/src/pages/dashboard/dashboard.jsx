import "./dashboard.css";
import { useNavigate } from "react-router-dom";

const scenarios = [
  { label: "Dining Out", description: "Order food, make reservations, ask about the menu." },
  { label: "Travel", description: "Navigate airports, hotels, and transportation." },
  { label: "Business", description: "Meetings, emails, and professional small talk." },
  { label: "Casual Chat", description: "Everyday conversation with no set topic." },
  { label: "Academic", description: "Discuss ideas, ask questions, give presentations." },
  { label: "Practical Errands", description: "Shopping, appointments, and daily tasks." },
];

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Welcome back</p>
          <h1 className="dashboard-title">
            Ready to <em>practice</em>?
          </h1>
          <p className="dashboard-sub">
            Pick a scenario below to start a conversation, or jump straight into a free chat.
          </p>
        </div>
        {user && (
          <div className="dashboard-user">
            <div className="dashboard-avatar">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <span>{user.email}</span>
          </div>
        )}
      </div>

      <section className="scenario-section">
        <h2 className="scenario-heading">Choose a scenario</h2>
        <div className="scenario-grid">
          {scenarios.map((s) => (
            <div className="scenario-card" key={s.label}>
              <h3>{s.label}</h3>
              <p>{s.description}</p>
              <button className="btn-start">Start</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}