from pydantic import BaseModel
from typing import Optional


class UploadResponse(BaseModel):
    session_id: str
    row_count: int
    columns: list[str]
    detected_schema: dict[str, str]
    rows: list[dict] = []
    message: str


class ChatRequest(BaseModel):
    session_id: str
    question: str


class ChartPoint(BaseModel):
    label: str
    value: float


class ChatResponse(BaseModel):
    answer: str
    insight: Optional[str] = None
    chart_type: str = "none"  # "bar" | "line" | "none"
    chart_data: list[ChartPoint] = []
    chart_title: str = ""
    source_rows: list[dict] = []
