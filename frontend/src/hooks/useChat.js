import { useState, useCallback } from "react";
import { askQuestion } from "../utils/api";

/**
 * Manages the chat conversation:
 * - Message history (user + assistant turns)
 * - Calling /chat and appending the response
 * - Loading and error state
 */
export function useChat(sessionId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (question) => {
    if (!question.trim() || !sessionId) return;

    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const result = await askQuestion(sessionId, question);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: result.answer,
          insight: result.insight,
          chartType: result.chart_type,
          chartData: result.chart_data,
          chartTitle: result.chart_title,
          sourceRows: result.source_rows,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Couldn't get an answer: ${err.message}`,
          chartType: "none",
          chartData: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const addWelcomeMessage = useCallback((rowCount, fileName) => {
    setMessages([{
      role: "assistant",
      text: `Loaded **${rowCount.toLocaleString("en-IN")} records** from *${fileName}*. What do you want to know?`,
      chartType: "none",
      chartData: [],
    }]);
  }, []);

  return { messages, loading, error, sendMessage, addWelcomeMessage };
}
