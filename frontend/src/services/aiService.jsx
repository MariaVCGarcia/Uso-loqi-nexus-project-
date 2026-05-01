const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function sendToAI(message, scenario, level) {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      scenario,
      level,
    }),
  });

  return await res.json();
}

export async function gradeConvo(messages, scenario, level)
{
  const res = await fetch(`${API_URL}/grade`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages,
      scenario,
      level
    }),
  });
  return await res.json();
}

export async function getHint(message, scenario, level, messages) {
  const res = await fetch(`${API_URL}/hint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      scenario,
      level,
      messages,
    }),
  });
  console.log("STATUS:", res.status);

  const data = await res.json();

  console.log("DATA:", data);

  return data;
}
