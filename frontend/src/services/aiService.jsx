export async function sendToAI(message, scenario, level) {
  const res = await fetch("http://localhost:8000/chat", {
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
