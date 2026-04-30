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

export async function getHint(message, scenario, level, messages) {
  const res = await fetch("http://localhost:8000/hint", {
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
