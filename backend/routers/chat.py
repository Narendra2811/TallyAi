"""
POST /chat
Takes a session_id (from /upload) and a natural language question.
Returns a structured answer, optional chart data, and the source rows
that the AI used to build its answer.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, ChatResponse, ChartPoint
from services.rag_service import answer_question, get_session

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question can't be empty.")

    # Validate session exists
    try:
        get_session(request.session_id)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))

    try:
        result = answer_question(request.session_id, request.question)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Something went wrong while processing your question: {str(e)}"
        )

    # Normalize chart_data into ChartPoint objects
    raw_chart = result.get("chart_data", [])
    chart_points = []
    for point in raw_chart:
        try:
            chart_points.append(ChartPoint(
                label=str(point.get("label", "")),
                value=float(point.get("value", 0)),
            ))
        except (ValueError, TypeError):
            continue

    return ChatResponse(
        answer=result.get("answer", ""),
        insight=result.get("insight"),
        chart_type=result.get("chart_type", "none"),
        chart_data=chart_points,
        chart_title=result.get("chart_title", ""),
        source_rows=result.get("source_rows", []),
    )
