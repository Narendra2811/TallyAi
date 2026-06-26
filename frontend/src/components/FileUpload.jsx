import { useRef, useState } from "react";

const QUICK_FEATURES = [
  { icon: "💬", title: "Ask in plain language", sub: "No Tally menus, no navigation" },
  { icon: "📈", title: "Auto charts", sub: "Trends and breakdowns, visualized" },
  { icon: "🧾", title: "GST summaries",  sub: "Payable and receivable, instant" },
  { icon: "🔍", title: "Source data", sub: "Every answer links to its rows" },
];

export function FileUpload({ onFile, onSampleData, uploading, error }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <div className="upload-wrapper">
      {/* Drop Zone */}
      <div
        className={`drop-zone${dragging ? " dragging" : ""}${uploading ? " uploading" : ""}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <span className="drop-icon">
          {uploading ? <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} /> : "📊"}
        </span>
        <div className="drop-title">
          {uploading ? "Processing your data…" : "Drop your Tally export here"}
        </div>
        <div className="drop-sub">
          Supports CSV and Excel (.xlsx, .xls) — Tally Prime or ERP9 export
        </div>

        <div className="upload-actions">
          <button
            className="btn-primary"
            disabled={uploading}
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          >
            📁 Choose file
          </button>
          <button
            className="btn-secondary"
            disabled={uploading}
            onClick={(e) => { e.stopPropagation(); onSampleData(); }}
          >
            ✨ Use sample data
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          style={{ display: "none" }}
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
      </div>

      {/* Error */}
      {error && <div className="error-banner">⚠️ {error}</div>}

      {/* Feature preview */}
      <div className="features-grid">
        {QUICK_FEATURES.map((f) => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <div className="feature-sub">{f.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
