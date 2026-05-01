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

class HintRequest(BaseModel):
    message: str
    scenario: str
    level: str | None = "beginner"
    messages: list | None = []

class GradeRequest(BaseModel):
    messages: list
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

def format_messages(messages):
    if not messages:
        return ""
    
    last_messages = messages[-5:] 

    formatted = []
    for m in last_messages: 
        role = m.get("role", "user")
        content = m.get("text", m.get("content", ""))
        formatted.append(f"{role.upper()}: {content}")

    return "\n".join(formatted)


def build_hint_prompt(message, scenario, level, messages):

    conversation = format_messages(messages)

    return f"""
    you are a helpful Spanish tutor. 

    You MUST base your answer on the conversation below.

    Conversation:
    {conversation}

    USER MESSAGE: {message}

    scenario: {scenario}
    level: {level}


    DON'T:
    -Ask questions
    - Start a conversation
    - Say things like "what do you want to say"
    - Be conversational

    Student input maybe incomplete or empty

    

    OUTPUT ONLY: 
    
    English: what they want to say
    Spanish: Spanish version
    Starter: Sentence starter

    Keep it useful


    """

# CHAT ENDPOINT

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
    
    
# HINT ENDPOINT 

@app.post("/hint")
def hint(req: HintRequest):

    prompt = build_hint_prompt(
        req.message,
        req.scenario,
        req.level,
        req.messages,
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": prompt
                },
                {
                    "role": "user",
                    "content": req.message
                }
            ]
        )

        return {
            "hint": response.choices[0].message.content
        }

    except Exception as e:
        print("ERROR:", e)
        return {
            "hint": str(e)
        }


# GRADE ENDPOINT

@app.post("/grade")
def grade(req: GradeRequest):
    formatted = []
    for m in req.messages:
        role = m.get("role", "user")
        content = m.get("text", m.get("content", ""))
        formatted.append(f"{role.upper()}: {content}")
    conversation = "\n".join(formatted)

    prompt = f"""
    You are evaluating a Spanish language learner's responses during conversation.
    Scenario: {req.scenario}
    Level: {req.level}

    Conversation:
    {conversation}

    Return ONLY valid JSON with these fields:
    {{
      "score": <overall 0-100>,
    }}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": prompt}],
            response_format={"type": "json_object"}
        )
        import json
        return json.loads(response.choices[0].message.content)

    except Exception as e:
        print("ERROR:", e)
        return {"score": 0, }