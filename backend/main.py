from click import prompt
from fastapi import FastAPI
from pydantic import BaseModel
from ai import client
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    scenario: str

def build_system_prompt(message,scenario):
    base = "You are a helpful Spanish tutor. Always respond in Spanish."

    scenarios = {
        "dining": "You are a waiter in a restaurant. Focus on food ordering conversations.",
        "travel": "You are helping a traveler in airports, hotels, and transportation.",
        "business": "You are a professional Spanish business communication coach.",
        "casual": "You are having friendly everyday Spanish conversations.",
        "academic": "You are a Spanish language teacher correcting grammar.",
        "practical": "You help with real-life tasks like shopping and directions."
    }
    return f"""
    {base}

    Scenario: {scenarios.get(scenario, scenarios["dining"])}

    Rules:
    - Always respond in Spanish
    - Adapt to scenario
    - Keep it natural

    User:
    {message}
    """

@app.post("/chat")
def chat(req: ChatRequest):

    prompt = build_system_prompt(req.message, req.scenario)

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": req.message}
            ]
        )

        return {
            "reply": response.choices[0].message.content
        }

    except Exception as e:
        print("ERROR:", e)
        return {"reply": str(e)}
    