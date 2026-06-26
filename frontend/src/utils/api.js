// All API calls in one place.
// If the backend URL changes (e.g. deployed to Railway), I only change it here.

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * Upload a Tally export file.
 * Returns { session_id, row_count, columns, detected_schema, message }
 */
export async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Upload failed");
  }

  return res.json();
}

/**
 * Send a question for a given session.
 * Returns { answer, insight, chart_type, chart_data, chart_title, source_rows }
 */
export async function askQuestion(sessionId, question) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, question }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Something went wrong");
  }

  return res.json();
}
