"""
To do RAG over tabular data, I need to convert rows into text chunks
that make sense when embedded. A raw CSV row like:

  "01-Apr-2024,SI-001,Mehta Traders,LED Bulbs,50,1200,60000,Paid"

...doesn't embed well because there's no context. I wrap each row (or group of rows)
with column names so the embedding understands what each value means:

  "Date: 01-Apr-2024 | Voucher: SI-001 | Party: Mehta Traders | Item: LED Bulbs |
   Qty: 50 | Rate: 1200 | Amount: 60000 | Status: Paid"

This way, when someone asks "show me paid invoices for Mehta Traders",
the retriever can find the right chunks even across a 5000-row dataset.
"""

from langchain_core.documents import Document


CHUNK_SIZE = 20  # rows per document chunk


def rows_to_documents(df, schema: dict[str, str], source_name: str) -> list[Document]:
    """
    Convert a pandas DataFrame into a list of LangChain Documents,
    each representing CHUNK_SIZE rows.

    The text format is human-readable so embeddings capture semantics,
    not just token frequencies.
    """
    documents = []
    rows = df.to_dict(orient="records")
    cols = list(df.columns)

    for i in range(0, len(rows), CHUNK_SIZE):
        chunk_rows = rows[i : i + CHUNK_SIZE]
        chunk_text = _rows_to_text(chunk_rows, cols, schema)

        doc = Document(
            page_content=chunk_text,
            metadata={
                "source": source_name,
                "row_start": i,
                "row_end": i + len(chunk_rows) - 1,
                "row_count": len(chunk_rows),
            },
        )
        documents.append(doc)

    return documents


def _rows_to_text(rows: list[dict], cols: list[str], schema: dict[str, str]) -> str:
    """
    Turn a list of row dicts into a readable string.

    Example output for one row:
      "Date: 01-Apr-2024 | Voucher No: SI-001 | Party Name: Mehta Traders | Amount: 60000 | Status: Paid"
    """
    lines = []
    for row in rows:
        parts = []
        for col in cols:
            val = row.get(col, "")
            if val == "" or val is None:
                continue
            col_type = schema.get(col, "text")
            # Add INR symbol for amount columns so the LLM understands currency
            if col_type == "amount":
                parts.append(f"{col}: ₹{val}")
            else:
                parts.append(f"{col}: {val}")
        lines.append(" | ".join(parts))

    return "\n".join(lines)
