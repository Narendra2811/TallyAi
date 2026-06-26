import { useEffect, useState } from "react";
import { FileUpload } from "../components/FileUpload";
import { ChatWindow } from "../components/ChatWindow";
import { DataTable } from "../components/DataTable";
import { useFileUpload } from "../hooks/useFileUpload";
import { useChat } from "../hooks/useChat";
import { SAMPLE_FILENAME, SAMPLE_CSV_TEXT } from "../utils/sampleData";

export default function Home() {
  const { session, uploading, error, upload, reset } = useFileUpload();
  const { messages, loading, sendMessage, addWelcomeMessage } = useChat(session?.session_id);
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    if (session) {
      addWelcomeMessage(session.row_count, session.fileName);
      setActiveTab("chat");
    }
  }, [session, addWelcomeMessage]);

  const handleSampleData = async () => {
    const sampleFile = new File([SAMPLE_CSV_TEXT], SAMPLE_FILENAME, { type: "text/csv" });
    await upload(sampleFile);
  };

  const hasData = !!session;

  return (
    <div className="app-shell">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-logo">📊</div>
        <div>
          <div className="header-title">TallyAI</div>
          <div className="header-sub">Ask your Tally data anything</div>
        </div>
        {hasData && (
          <div className="header-badge">
            📄 {session?.fileName || SAMPLE_FILENAME} · {(session?.row_count || 0).toLocaleString("en-IN")} rows
          </div>
        )}
      </header>

      {/* ── Main content ── */}
      {!hasData ? (
        <FileUpload
          onFile={upload}
          onSampleData={handleSampleData}
          uploading={uploading}
          error={error}
        />
      ) : (
        <>
          {/* Tabs */}
          <div className="tabs">
            {[
              { id: "chat", label: "💬 Ask questions" },
              { id: "data", label: "🗂 View data" },
            ].map((t) => (
              <button
                key={t.id}
                className={`tab-btn${activeTab === t.id ? " active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
            <button
              className="tab-reset"
              onClick={() => reset()}
            >
              ↑ Upload new file
            </button>
          </div>

          {activeTab === "chat" && (
            <ChatWindow
              messages={messages}
              loading={loading}
              onSend={sendMessage}
            />
          )}

          {activeTab === "data" && (
            <DataTable
              columns={session?.columns || []}
              rows={session?.rows || []}
            />
          )}
        </>
      )}
    </div>
  );
}
