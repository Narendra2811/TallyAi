import { useState } from "react";
import { ChartView } from "./ChartView";

export function MessageBubble({ message }) {
  const { role, text, insight, chartType, chartData, chartTitle, sourceRows } = message;
  const isUser = role === "user";
  const [showSource, setShowSource] = useState(false);

  return (
    <div className={`msg-row${isUser ? " user" : ""}`}>
      {/* Avatar */}
      <div className={`msg-avatar ${isUser ? "user" : "ai"}`}>
        {isUser ? "You" : "🤖"}
      </div>

      <div className="msg-body">
        {/* Main bubble */}
        <div className={`msg-bubble ${isUser ? "user" : "ai"}`}>
          <SimpleMarkdown text={text} />
        </div>

        {/* Insight callout */}
        {insight && (
          <div className="msg-insight">
            💡 {insight}
          </div>
        )}

        {/* Chart */}
        <ChartView chartType={chartType} chartData={chartData} chartTitle={chartTitle} />

        {/* Source rows — collapsed by default */}
        {sourceRows?.length > 0 && (
          <div>
            <button
              className="msg-sources-toggle"
              onClick={() => setShowSource((s) => !s)}
            >
              {showSource ? "▲" : "▼"} {showSource ? "Hide" : "Show"} source rows ({sourceRows.length})
            </button>

            {showSource && (
              <div className="msg-sources-table">
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: "var(--bg-elevated)" }}>
                      {Object.keys(sourceRows[0]).map((k) => (
                        <th key={k} style={{
                          padding: "7px 12px",
                          textAlign: "left",
                          fontWeight: 600,
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          color: "var(--text-secondary)",
                          borderBottom: "1px solid var(--border)",
                          whiteSpace: "nowrap",
                        }}>{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sourceRows.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                        {Object.values(row).map((v, j) => (
                          <td key={j} style={{ padding: "6px 12px", color: "var(--text-primary)", whiteSpace: "nowrap" }}>
                            {String(v ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SimpleMarkdown({ text }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("*") && part.endsWith("*"))
          return <em key={i}>{part.slice(1, -1)}</em>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
