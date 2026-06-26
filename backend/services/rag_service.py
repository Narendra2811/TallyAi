"""
This is the core of the product — the RAG pipeline.

Why RAG instead of just sending all CSV rows to the LLM?

1. Scale: A real Tally export has 2,000-10,000 rows. That's way beyond any
   context window limit, and even if it fit, the LLM would get confused.

2. Accuracy: When the LLM reasons over retrieved evidence (chunks that are
   actually relevant to the question), it's much more accurate than when it
   tries to scan thousands of rows mentally.

3. Cost: Retrieving 5-10 relevant chunks is much cheaper than sending 500 rows.

Flow:
  Upload → parse → chunk → embed → store in ChromaDB
  Question → embed → similarity search → retrieve top-k chunks → LLM answer

I'm using ChromaDB as the vector store because it's lightweight, runs in-process
for the prototype, and can be swapped for Pinecone or Weaviate in production
without changing the interface.
"""

import os
import json
from uuid import uuid4

import pandas as pd
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.messages import SystemMessage, HumanMessage

from utils.tally_schema import detect_schema, get_column_summary
from utils.chunker import rows_to_documents



CHROMA_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
TOP_K = 8  # number of chunks to retrieve per question

# In-memory store keyed by session_id
# In production this would be Redis or a database
_session_store: dict[str, dict] = {}


def ingest_dataframe(df: pd.DataFrame, filename: str) -> str:
    """
    Takes a parsed DataFrame, chunks it, embeds it, stores in ChromaDB.
    Returns a session_id that the frontend uses for subsequent questions.
    """
    session_id = str(uuid4())
    schema = detect_schema(df)
    summary = get_column_summary(df, schema)
    documents = rows_to_documents(df, schema, filename)

    embeddings = OpenAIEmbeddings(api_key=os.getenv("OPENAI_API_KEY"))
    vector_store = Chroma(
        collection_name=f"session_{session_id}",
        embedding_function=embeddings,
        persist_directory=CHROMA_DIR,
    )
    vector_store.add_documents(documents)

    _session_store[session_id] = {
        "vector_store": vector_store,
        "schema": schema,
        "summary": summary,
        "filename": filename,
        "df": df,  # keep the raw df for source-row lookup
    }

    return session_id


def get_session(session_id: str) -> dict:
    """Retrieve session data. Raises KeyError if session doesn't exist."""
    if session_id not in _session_store:
        raise KeyError(
            f"Session '{session_id}' not found. The data may have expired — please re-upload your file."
        )
    return _session_store[session_id]


def answer_question(session_id: str, question: str) -> dict:
    """
    Main RAG query function.

    1. Retrieve top-k chunks relevant to the question
    2. Build a structured prompt with the chunks + column summary
    3. Call OpenAI, parse the JSON response
    4. Return structured answer
    """
    session = get_session(session_id)
    vector_store: Chroma = session["vector_store"]
    summary: dict = session["summary"]
    df: pd.DataFrame = session["df"]

    # Step 1: Retrieve relevant chunks
    retriever = vector_store.as_retriever(search_kwargs={"k": TOP_K})
    relevant_docs = retriever.invoke(question)
    retrieved_context = "\n\n".join([doc.page_content for doc in relevant_docs])

    # Step 2: Build prompt — use direct messages to avoid LangChain template
    # parsing JSON curly-braces as template variables
    llm = ChatOpenAI(
        model="gpt-4.1-mini",
        api_key=os.getenv("OPENAI_API_KEY"),
    )

    messages = [
        SystemMessage(content=_build_system_prompt()),
        HumanMessage(content=_build_user_prompt(question, summary, retrieved_context)),
    ]


    raw_response = llm.invoke(messages).content

    # Step 3: Parse JSON
    result = _parse_llm_response(raw_response)

    # Step 4: Attach source rows for transparency
    result["source_rows"] = _find_source_rows(df, relevant_docs)

    return result


def _build_system_prompt() -> str:
    return """You are TallyAI — a no-nonsense accounting assistant built specifically for Indian businesses using Tally.

Your job is to answer financial questions clearly, the way a sharp CA would explain things to a business owner over the phone. No jargon, no corporate speak. Just the answer.

Rules:
- Use Indian number formatting: lakhs and crores, not millions. Write "₹2.5L" not "₹250,000"
- If you can compute something from the retrieved data, compute it — don't hedge
- If the data doesn't cover what's being asked, say so plainly
- Keep answers to 2-3 sentences max unless a list is genuinely needed
- For the insight, give one specific, actionable observation — not a generic tip

Return ONLY a JSON object. No markdown, no explanation outside the JSON:
{{
  "answer": "your answer here",
  "insight": "one specific business observation",
  "chart_type": "bar" | "line" | "none",
  "chart_data": [{{"label": "...", "value": 0}}],
  "chart_title": "short title for the chart"
}}

chart_data should have at most 8 entries. Use "none" for chart_type if a chart wouldn't genuinely help."""


def _build_user_prompt(question: str, summary: dict, context: str) -> str:
    return f"""Question: {question}

Dataset overview:
- Total records: {summary['total_rows']}
- Columns: {', '.join(summary['columns'])}
- Column types: {json.dumps(summary['schema'])}
- Pre-computed totals: {json.dumps(summary['amount_totals'])}
- Unique value counts: {json.dumps(summary['unique_counts'])}
- Date range: {json.dumps(summary['date_range'])}

Retrieved data (most relevant records for this question):
{context}

Answer the question using the retrieved data and the pre-computed totals above."""


def _parse_llm_response(raw: str) -> dict:
    """Parse the LLM's JSON response, with graceful fallback."""
    try:
        clean = raw.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(clean)
    except json.JSONDecodeError:
        return {
            "answer": raw.strip(),
            "insight": None,
            "chart_type": "none",
            "chart_data": [],
            "chart_title": "",
        }


def _find_source_rows(df: pd.DataFrame, docs: list) -> list[dict]:
    """
    Return the actual DataFrame rows that correspond to the retrieved chunks.
    This is important for trust — users can verify the AI's answer against raw data.
    """
    source_rows = []
    for doc in docs:
        start = doc.metadata.get("row_start", 0)
        end = doc.metadata.get("row_end", start)
        chunk_rows = df.iloc[start : end + 1].to_dict(orient="records")
        source_rows.extend(chunk_rows)

    # Deduplicate while preserving order
    seen = set()
    unique_rows = []
    for row in source_rows:
        key = str(row)
        if key not in seen:
            seen.add(key)
            unique_rows.append(row)

    return unique_rows[:20]  # cap at 20 rows for the UI
