from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import httpx
import json
from pathlib import Path
from config import settings

app = FastAPI(title="OpenHouse ICC Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load system prompt
SYSTEM_PROMPT_PATH = Path(__file__).parent / "prompts" / "system_prompt.txt"
SYSTEM_PROMPT = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8") if SYSTEM_PROMPT_PATH.exists() else ""


async def stream_ollama_response(messages: list):
    """Stream response from Ollama API."""
    async with httpx.AsyncClient(timeout=120.0) as client:
        async with client.stream(
            "POST",
            f"{settings.OLLAMA_URL}/api/chat",
            json={
                "model": settings.OLLAMA_MODEL,
                "messages": messages,
                "stream": True,
            },
        ) as response:
            async for line in response.aiter_lines():
                if line:
                    try:
                        data = json.loads(line)
                        if "message" in data and "content" in data["message"]:
                            content = data["message"]["content"]
                            yield f"data: {json.dumps({'content': content})}\n\n"
                        if data.get("done", False):
                            yield "data: [DONE]\n\n"
                    except json.JSONDecodeError:
                        continue


@app.post("/chat")
async def chat(request: Request):
    """Handle chat requests with SSE streaming."""
    data = await request.json()
    history = data.get("history", [])

    # Prepend system message if not present
    if not history or history[0].get("role") != "system":
        history.insert(0, {"role": "system", "content": SYSTEM_PROMPT})

    return StreamingResponse(
        stream_ollama_response(history),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok"}


# Mount static files (frontend)
# In Docker: /app/frontend (mounted via volume)
# Locally: ../frontend relative to this file
FRONTEND_PATH = Path("/app/frontend")
if not FRONTEND_PATH.exists():
    FRONTEND_PATH = Path(__file__).parent.parent / "frontend"

if FRONTEND_PATH.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_PATH / "assets"), name="assets")
    app.mount("/css", StaticFiles(directory=FRONTEND_PATH / "css"), name="css")
    app.mount("/js", StaticFiles(directory=FRONTEND_PATH / "js"), name="js")

    @app.get("/")
    async def root():
        return FileResponse(FRONTEND_PATH / "index.html")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
