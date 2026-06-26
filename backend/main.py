"""
TallyAI Backend — FastAPI entry point

Run with:
  uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import upload, chat, health

load_dotenv()

app = FastAPI(
    title="TallyAI",
    description="Ask your Tally data anything. No exports, no dashboards, just answers.",
    version="0.1.0",
)

# Allow the React dev server to talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(upload.router)
app.include_router(chat.router)
