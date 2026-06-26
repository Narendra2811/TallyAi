"""
POST /upload
Accepts a CSV or Excel Tally export, parses it, runs it through the RAG ingestion pipeline,
and returns a session_id for subsequent chat requests.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from models.schemas import UploadResponse
from services.file_parser import parse_upload
from services.rag_service import ingest_dataframe
from utils.tally_schema import detect_schema
from openai import RateLimitError, AuthenticationError

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    # Basic size check — 20MB should be enough for any Tally export
    content = await file.read()
    if len(content) > 20 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="File is too large. Maximum size is 20MB. Try exporting a smaller date range from Tally.",
        )

    # Parse into DataFrame
    df = parse_upload(file.filename or "upload", content)

    # Detect what each column means
    schema = detect_schema(df)

    try:
        # Ingest into the RAG vector store, get back a session ID
        session_id = ingest_dataframe(df, file.filename or "upload")
    except RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="OpenAI API quota exceeded. Please check your billing details or use a different API key.",
        )
    except AuthenticationError:
        raise HTTPException(
            status_code=401,
            detail="Invalid OpenAI API key. Please check your .env file.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the file: {str(e)}",
        )

    return UploadResponse(
        session_id=session_id,
        row_count=len(df),
        columns=list(df.columns),
        detected_schema=schema,
        rows=df.head(100).to_dict(orient="records"),
        message=f"Loaded {len(df):,} records. Ready to answer questions.",
    )
