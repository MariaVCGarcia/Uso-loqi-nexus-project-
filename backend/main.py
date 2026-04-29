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
    level: str | None = "beginner"

def build_system_prompt(message, scenario, level):
    
    base = "You are a helpful Spanish tutor. Always respond in Spanish."

    level_rules = {
        "beginner": "Use simple vocabulary. Short replies. Correct gently.",
        "intermediate": "Use natural Spanish. Medium difficulty.",
        "advanced": "Use fluent Spanish. Use idioms. Correct mistakes clearly."
    }


    scenarios = {
        "Dining": "You are a waiter in a restaurant. Focus on food ordering conversations.",
        "Travel": "You are helping a traveler in airports, hotels, and transportation.",
        "Business": "You are a professional Spanish business communication coach.",
        "Casual": "You are having friendly everyday Spanish conversations.",
        "Academic": "You are a Spanish language teacher correcting grammar.",
        "Practical": "You help with real-life tasks like shopping and directions."
    }
    return f"""
    {base}

    Scenario: {scenarios.get(scenario, "General Conversation")}

    Student Level: {level_rules.get(level, level_rules["beginner"])}

    Rules:
    - Always respond in Spanish

    User:
    {message}
    """

@app.post("/chat")
def chat(req: ChatRequest):

    prompt = build_system_prompt(req.message, req.scenario, req.level)

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
    