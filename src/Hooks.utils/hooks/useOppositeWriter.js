import { useState } from "react";
import { buildPrompt } from "../utils/buildPrompt";

// ─── GROQ API KEY ────────────────────────────────────────────────────────────
const GROQ_API_KEY = "gsk_your_groq_api_key_here";
// Replace with your real key from https://console.groq.com/keys
// ─────────────────────────────────────────────────────────────────────────────

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL    = "llama-3.3-70b-versatile";

/**
 * Custom hook that encapsulates Groq API logic and all app state.
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
      const response = await fetch(GROQ_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model:      GROQ_MODEL,
          max_tokens: 1000,
          messages: [
            { role: "user", content: buildPrompt(input, mode, style) },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `Groq error ${response.status}`);
      }

      const raw = data.choices?.[0]?.message?.content || "";

      const oppMatch     = raw.match(/OPPOSITE:\s*([\s\S]*?)(?:INSIGHT:|$)/i);
      const insightMatch = raw.match(/INSIGHT:\s*([\s\S]*)/i);

      const opposite = oppMatch     ? oppMatch[1].trim()     : raw.trim();
      const insight  = insightMatch ? insightMatch[1].trim() : "";

      const entry = { input, opposite, insight, mode, style, id: Date.now() };

      setResult(entry);
      setHistory((prev) => [entry, ...prev].slice(0, 10));
    } catch (err) {
      setError(
        err.message.includes("401") || err.message.includes("403")
          ? "Invalid API key. Update GROQ_API_KEY in useOppositeWriter.js."
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
