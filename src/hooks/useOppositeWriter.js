import { useState } from "react";
import { buildPrompt } from "../utils/buildPrompt";

/**
 * Custom hook that encapsulates API logic and all app state.
 * Calls /api/generate (our Express proxy) so the Groq key stays server-side.
 */
export function useOppositeWriter() {
  const [mode,    setMode]    = useState("sentence");
  const [style,   setStyle]   = useState("Creative");
  const [input,   setInput]   = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [history, setHistory] = useState([]);

  const generate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt(input, mode, style) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error ${response.status}`);
      }

      const raw = data.content || "";
      const oppMatch     = raw.match(/OPPOSITE:\s*([\s\S]*?)(?:INSIGHT:|$)/i);
      const insightMatch = raw.match(/INSIGHT:\s*([\s\S]*)/i);

      const opposite = oppMatch     ? oppMatch[1].trim()     : raw.trim();
      const insight  = insightMatch ? insightMatch[1].trim() : "";

      const entry = { input, opposite, insight, mode, style, id: Date.now() };
      setResult(entry);
      setHistory((prev) => [entry, ...prev].slice(0, 10));
    } catch (err) {
      setError(
        err.message.includes("GROQ_API_KEY")
          ? "API key not configured. Add GROQ_API_KEY in Render environment variables."
          : `Error: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setInput("");
    setResult(null);
    setError(null);
  };

  const loadFromHistory = (entry) => {
    setInput(entry.input);
    setMode(entry.mode);
    setStyle(entry.style);
    setResult(entry);
    setError(null);
  };

  return {
    mode, setMode,
    style, setStyle,
    input, setInput,
    result,
    loading,
    error,
    history,
    generate,
    reset,
    loadFromHistory,
  };
}
