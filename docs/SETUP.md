# Setup Instructions

Two parts: backend (FastAPI + LangChain) and frontend (React). Both run locally in about 5 minutes.

---

## Prerequisites

- Python 3.11+
- Node.js 18+
- An API OPENAI key — get one at https://platform.openai.com

---

## Backend Setup

```bash
cd backend

# Create a virtual environment (keeps dependencies clean)
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
```

Open `.env` and add your OPENAI API key:

```
OPENAI_API_KEY=sk-ant-...
CHROMA_PERSIST_DIR=./chroma_db
MAX_UPLOAD_MB=20
```

Start the backend:

```bash
uvicorn main:app --reload --port 8000
```

You should see:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Verify it's running: open http://localhost:8000/health in your browser. Should return `{"status": "ok"}`.

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

The app opens at http://localhost:3000 automatically.

---

## Quick Test

1. Open http://localhost:3000
2. Click **"Use sample data"** — this loads 20 rows of electrical goods sales data
3. Try asking:
   - "What are my total sales?"
   - "Which customers have unpaid invoices?"
   - "Show me sales by month"
   - "Who are my top 3 customers?"

Or upload your own Tally export:

- In Tally Prime: Reports → go to any register → Export → Excel/CSV
- In Tally ERP9: Display → any report → Export → Excel

---

## Deploying to Production (Railway)

Railway is the fastest way to deploy both services publicly.

**Backend on Railway:**

1. Push the repo to GitHub
2. Go to railway.app → New Project → Deploy from GitHub
3. Select the repo, set root directory to `backend/`
4. Add environment variables in Railway dashboard:
   - `OPENAI_API_KEY` = your key
   - `CHROMA_PERSIST_DIR` = `/data/chroma_db`
5. Railway auto-detects FastAPI and runs it

**Frontend on Railway (or Vercel):**

1. Set root directory to `frontend/`
2. Add environment variable:
   - `REACT_APP_API_URL` = your Railway backend URL (e.g. `https://tallyai-backend.railway.app`)
3. Build command: `npm run build`
4. Start command: `npx serve -s build`

---

## Project Structure Reference

```
tallyai/
├── backend/
│   ├── main.py                    # FastAPI app, CORS, router registration
│   ├── requirements.txt
│   ├── .env.example
│   ├── routers/
│   │   ├── upload.py              # POST /upload — parse file, ingest to RAG
│   │   ├── chat.py                # POST /chat — answer questions
│   │   └── health.py              # GET /health
│   ├── services/
│   │   ├── rag_service.py         # LangChain RAG pipeline (ingest + query)
│   │   └── file_parser.py         # CSV/Excel parsing with Tally quirk handling
│   ├── models/
│   │   └── schemas.py             # Pydantic request/response models
│   └── utils/
│       ├── tally_schema.py        # Column type detection
│       └── chunker.py             # DataFrame → LangChain Documents
│
└── frontend/
    └── src/
        ├── App.jsx
        ├── pages/
        │   └── Home.jsx           # Main page, orchestrates state
        ├── components/
        │   ├── FileUpload.jsx      # Upload screen with drag-drop
        │   ├── ChatWindow.jsx      # Message list + input
        │   ├── MessageBubble.jsx   # Single message with chart + source rows
        │   ├── ChartView.jsx       # Bar/line chart renderer
        │   └── DataTable.jsx       # Raw data table view
        ├── hooks/
        │   ├── useChat.js          # Chat state + API call
        │   └── useFileUpload.js    # Upload state + API call
        └── utils/
            ├── api.js              # All fetch calls in one place
            ├── formatters.js       # INR formatting (lakhs/crores)
            └── sampleData.js       # Demo data for "Use sample data"
```
