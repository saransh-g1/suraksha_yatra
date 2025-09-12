from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
import json

app = FastAPI(title="Trip Chat Service", version="1.0.0")

# CORS middleware to allow frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    messages: List[Message]
    data: Optional[Dict[str, Any]] = None

# System prompt
SYSTEM_PROMPT = """You are a friendly and enthusiastic travel advisor who loves helping people plan amazing trips in NorthEast India! 🌍✈️

Your personality:
- Warm, excited, and genuinely interested in people's travel dreams
- You're patient and understanding when people need time to think
- You celebrate with them when they share their plans

Your mission:
- Help collect trip details with genuine enthusiasm
- Ask ONE question at a time in a conversational, caring way
- Show excitement about their destination choices
- Share a bit of wanderlust and travel passion

What you need to collect (but ask naturally):
- Destination (where their heart wants to go!)
- Start date
- End date
- Budget in INR (so I can suggest the perfect experiences)
- Interests (what makes their soul happy - food, culture, adventure, etc.)

Boundaries (say this kindly):
- Never ask for personal details like SSN, credit cards, or passport numbers
- If someone seems upset or inappropriate, gently redirect: "Let's focus on something positive - planning your next adventure!"

When you have ALL the details, get excited and say: "This sounds AMAZING! Let me organize everything for you:" followed by a JSON summary only.

Remember: You're not just collecting data,"""

# Simple state for the graph
class State:
    def __init__(self):
        self.messages: List[Dict[str, str]] = []
        self.data: Optional[Dict[str, Any]] = None

# Initialize LLM globally
api_key = os.getenv("GOOGLE_API_KEY", "")
if not api_key:
    raise ValueError("GOOGLE_API_KEY environment variable is required")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=api_key,
    temperature=0.2,
)

def process_conversation(messages: List[Dict[str, str]]) -> Dict[str, Any]:
    """Process conversation and return response with potential trip data"""
    
    # Prepare conversation for LLM - ensure we have at least one user message
    llm_messages = [SystemMessage(content=SYSTEM_PROMPT)]
    
    # Add conversation history
    for msg in messages:
        if msg["role"] == "user" and msg["content"].strip():
            llm_messages.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant" and msg["content"].strip():
            llm_messages.append(AIMessage(content=msg["content"]))
    
    # Ensure we have at least one user message
    if len(llm_messages) == 1:  # Only system message
        llm_messages.append(HumanMessage(content="Start trip entry collection."))
    
    print(f"Sending {len(llm_messages)} messages to LLM")  # Debug
    
    # Get response from LLM
    try:
        response = llm.invoke(llm_messages)
    except Exception as e:
        print(f"LLM Error: {e}")
        # Fallback to simple text generation
        user_input = next((msg["content"] for msg in reversed(messages) if msg["role"] == "user"), "Hello")
        simple_prompt = f"{SYSTEM_PROMPT}\n\nUser: {user_input}\nAssistant:"
        response = llm.invoke([HumanMessage(content=simple_prompt)])
    
    # Add assistant response to messages
    new_messages = messages + [{"role": "assistant", "content": str(response.content)}]
    
    # Try to extract trip data from the response
    trip_data = None
    last_message = str(response.content)
    
    try:
        # Look for JSON in the response
        start_idx = last_message.find("{")
        end_idx = last_message.rfind("}")
        
        if start_idx != -1 and end_idx != -1:
            json_str = last_message[start_idx:end_idx+1]
            potential_data = json.loads(json_str)
            
            # Basic validation
            required_fields = ["destination", "startDate", "endDate", "budgetUSD", "interests"]
            if all(field in potential_data for field in required_fields):
                trip_data = potential_data
    except (json.JSONDecodeError, KeyError):
        pass
    
    return {
        "messages": new_messages,
        "data": trip_data
    }

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Chat endpoint for trip collection"""
    try:
        # Convert Pydantic models to dict
        messages = [msg.model_dump() for msg in request.messages]
        
        # Process conversation
        result = process_conversation(messages)
        
        # Return response
        return ChatResponse(
            messages=result["messages"],
            data=result["data"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
