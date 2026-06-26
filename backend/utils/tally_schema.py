"""
Tally exports don't have a fixed schema — every company's setup is a bit different.
This module tries to figure out what each column actually represents so the AI
can reason about the data correctly.

It's not perfect but it covers most standard Tally Prime and ERP9 export formats.
"""

import re


# Common patterns I've seen across real Tally exports
AMOUNT_PATTERNS = re.compile(
    r"amount|total|value|credit|debit|balance|sales|purchase|"
    r"gst|tax|invoice|net|closing|opening|rate|price|cost|profit",
    re.IGNORECASE,
)
DATE_PATTERNS = re.compile(
    r"date|day|month|period|voucher.*date|entry.*date|posting",
    re.IGNORECASE,
)
NAME_PATTERNS = re.compile(
    r"name|party|customer|vendor|ledger|item|product|particulars|"
    r"narration|description|stock|goods",
    re.IGNORECASE,
)
QTY_PATTERNS = re.compile(
    r"qty|quantity|units|nos|pieces|pcs|count",
    re.IGNORECASE,
)
STATUS_PATTERNS = re.compile(
    r"status|paid|pending|due|cleared|outstanding",
    re.IGNORECASE,
)
VOUCHER_PATTERNS = re.compile(
    r"voucher|vch|bill.*no|invoice.*no|ref",
    re.IGNORECASE,
)


def detect_column_type(col_name: str, sample_values: list) -> str:
    """
    Decide what a column likely contains based on its name and a few sample values.
    Name-based detection is fast and usually right for Tally exports.
    """
    col = col_name.strip()

    if DATE_PATTERNS.search(col):
        return "date"
    if AMOUNT_PATTERNS.search(col):
        return "amount"
    if NAME_PATTERNS.search(col):
        return "name"
    if QTY_PATTERNS.search(col):
        return "quantity"
    if STATUS_PATTERNS.search(col):
        return "status"
    if VOUCHER_PATTERNS.search(col):
        return "voucher_id"

    # Fall back to looking at actual values if name didn't help
    if sample_values:
        numeric_count = sum(
            1 for v in sample_values
            if str(v).replace(",", "").replace(".", "").replace("-", "").strip().isdigit()
        )
        if numeric_count / len(sample_values) > 0.7:
            return "amount"

    return "text"


def detect_schema(df) -> dict[str, str]:
    """
    Run detection across all columns in the uploaded dataframe.
    Returns a dict like: {"Party Name": "name", "Amount": "amount", ...}
    """
    schema = {}
    for col in df.columns:
        sample = df[col].dropna().head(10).tolist()
        schema[col] = detect_column_type(col, sample)
    return schema


def get_column_summary(df, schema: dict[str, str]) -> dict:
    """
    Pre-compute totals and unique counts so the LLM prompt stays small
    even when the dataset is large.
    """
    summary = {
        "total_rows": len(df),
        "columns": list(df.columns),
        "schema": schema,
        "amount_totals": {},
        "unique_counts": {},
        "date_range": {},
    }

    for col, col_type in schema.items():
        if col_type == "amount":
            try:
                numeric = df[col].astype(str).str.replace(r"[₹,\s]", "", regex=True)
                numeric = numeric.replace("", "0").astype(float)
                summary["amount_totals"][col] = round(float(numeric.sum()), 2)
            except Exception:
                pass

        elif col_type == "name":
            summary["unique_counts"][col] = int(df[col].nunique())

        elif col_type == "date":
            try:
                parsed = df[col].dropna().astype(str)
                summary["date_range"][col] = {
                    "first": parsed.iloc[0] if len(parsed) > 0 else "",
                    "last": parsed.iloc[-1] if len(parsed) > 0 else "",
                }
            except Exception:
                pass

    return summary
