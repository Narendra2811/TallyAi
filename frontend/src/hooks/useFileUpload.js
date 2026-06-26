import { useState, useCallback } from "react";
import { uploadFile } from "../utils/api";

/**
 * Manages everything related to file upload:
 * - Drag & drop handling
 * - File validation
 * - Calling the backend /upload endpoint
 * - Exposing session info once upload completes
 */
export function useFileUpload() {
  const [session, setSession] = useState(null);  // { session_id, row_count, columns, detected_schema }
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = useCallback(async (file) => {
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(ext)) {
      setError("Only CSV and Excel files are supported. Export your data from Tally and try again.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadFile(file);
      setSession({ ...result, fileName: file.name });
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSession(null);
    setError(null);
  }, []);

  return { session, uploading, error, upload, reset };
}
