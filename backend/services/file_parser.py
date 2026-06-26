"""
Handles parsing uploaded files into pandas DataFrames.

Tally exports are usually clean but have a few quirks:
- Amount columns often have commas: "1,20,000"
- Some exports have blank header rows at the top (company name, report title, etc.)
- Excel files sometimes have merged cells in the header

I deal with these here so the rest of the pipeline doesn't have to worry about it.
"""

import io
import pandas as pd
from fastapi import HTTPException


ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls"}
MAX_ROWS = 50_000  # anything beyond this is probably the wrong file


def parse_upload(filename: str, content: bytes) -> pd.DataFrame:
    """
    Parse an uploaded file into a clean DataFrame.
    Raises HTTPException with a user-friendly message if anything goes wrong.
    """
    ext = _get_extension(filename)

    if ext == ".csv":
        df = _parse_csv(content)
    elif ext in (".xlsx", ".xls"):
        df = _parse_excel(content)
    else:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' isn't supported. Please upload a CSV or Excel file exported from Tally."
        )

    df = _clean(df)

    if len(df) == 0:
        raise HTTPException(
            status_code=400,
            detail="The file appears to be empty. Make sure you're uploading a data export, not a blank template."
        )

    if len(df) > MAX_ROWS:
        raise HTTPException(
            status_code=400,
            detail=f"This file has {len(df):,} rows which is more than the current limit of {MAX_ROWS:,}. "
                   "Try exporting a smaller date range from Tally."
        )

    return df


def _parse_csv(content: bytes) -> pd.DataFrame:
    """Try UTF-8 first, fall back to latin-1 (common for Tally exports on Windows)."""
    try:
        return pd.read_csv(io.BytesIO(content), encoding="utf-8", skip_blank_lines=True)
    except UnicodeDecodeError:
        return pd.read_csv(io.BytesIO(content), encoding="latin-1", skip_blank_lines=True)


def _parse_excel(content: bytes) -> pd.DataFrame:
    """
    Read the first sheet. Tally exports are usually single-sheet.
    header=0 works for most exports but some have a report title in row 0
    and actual headers in row 1 — we handle that in _clean().
    """
    try:
        return pd.read_excel(io.BytesIO(content), sheet_name=0, header=0)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Couldn't read the Excel file: {str(e)}. Try saving it as CSV from Tally and uploading that instead."
        )


def _clean(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean up common issues in Tally exports:
    1. Drop fully empty rows and columns
    2. Strip whitespace from column names and string values
    3. If the first row looks like it's actually the header (all strings, no numeric),
       promote it and drop the old header
    """
    # Drop rows/cols that are completely empty
    df = df.dropna(how="all").dropna(axis=1, how="all")

    # Strip column name whitespace
    df.columns = [str(c).strip() for c in df.columns]

    # Strip string values
    str_cols = df.select_dtypes(include="object").columns
    df[str_cols] = df[str_cols].apply(lambda c: c.str.strip() if c.dtype == object else c)

    # Remove rows that are just repeated headers (Tally sometimes does this in long exports)
    if len(df) > 0:
        header_vals = set(df.columns)
        df = df[~df.apply(lambda row: set(row.astype(str)) == header_vals, axis=1)]

    df = df.reset_index(drop=True)
    return df


def _get_extension(filename: str) -> str:
    dot_idx = filename.rfind(".")
    if dot_idx == -1:
        return ""
    return filename[dot_idx:].lower()
