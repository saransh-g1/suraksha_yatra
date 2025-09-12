# Trip Chat Service

FastAPI service for conversational trip planning with LangGraph + Gemini.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variable:
```bash
# Windows PowerShell
$env:GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY_HERE"

# macOS/Linux
export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY_HERE"
```

3. Run the service:
```bash
python main.py
```

The service will run on `http://localhost:8000`

## API Endpoints

### POST /chat
Conversational trip collection endpoint.

Request:
```json
{
  "messages": [
    {"role": "user", "content": "I want to plan a trip"}
  ]
}
```

Response:
```json
{
  "messages": [
    {"role": "user", "content": "I want to plan a trip"},
    {"role": "assistant", "content": "Great! Where would you like to go?"}
  ],
  "data": null
}
```

When all trip details are collected, `data` will contain the trip information.

### GET /health
Health check endpoint.

## CORS

The service allows requests from:
- http://localhost:3000
- http://127.0.0.1:3000

Modify the CORS settings in `main.py` if you need different origins.

## Docker (Railway)

Build and run locally:
```bash
cd trip_chat_service
docker build -t trip_chat_service .
docker run -p 8000:8000 --env PORT=8000 --env GOOGLE_API_KEY=YOUR_KEY trip_chat_service
```

On Railway, set environment variables:
- GOOGLE_API_KEY: your Google Generative AI key
- PORT: 8000 (Railway sets this automatically; the image respects it)
