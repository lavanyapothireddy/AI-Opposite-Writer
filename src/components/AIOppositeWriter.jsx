import { useState, useRef, useEffect } from "react";

// ─── GROQ API KEY ────────────────────────────────────────────────────────────
const GROQ_API_KEY  = "gsk_your_groq_api_key_here"; // ← paste your key here
const GROQ_MODEL    = "llama-3.3-70b-versatile";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
// ─────────────────────────────────────────────────────────────────────────────

const MODES = [
  { id: "word", label: "Word", icon: "W", desc: "Single word opposites" },
  { id: "sentence", label: "Sentence", icon: "S", desc: "Flip sentence meaning" },
  { id: "paragraph", label: "Paragraph", icon: "P", desc: "Reverse entire tone" },
  { id: "emotion", label: "Emotion", icon: "E", desc: "Flip emotional register" },
  { id: "story", label: "Story", icon: "N", desc: "Invert narrative arc" },
];

const STYLES = ["Literal", "Creative", "Poetic", "Humorous", "Dramatic"];

function TypewriterText({ text, speed = 18 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    idx.current = 0;
    if (!text) return;
    const iv = setInterval(() => {
      if (idx.current >= text.length) { clearInterval(iv); setDone(true); return; }
      setDisplayed(text.slice(0, ++idx.current));
    }, speed);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && <span style={{ borderRight: "2px solid var(--color-text-primary)", animation: "blink 0.7s step-end infinite", marginLeft: 1 }} />}
    </span>
  );
}

export default function AIOppositeWriter() {
  const [mode, setMode] = useState("sentence");
  const [style, setStyle] = useState("Creative");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const selectedMode = MODES.find(m => m.id === mode);

  const buildPrompt = () => {
    const modeInstructions = {
      word: `Return the most interesting, thought-provoking antonym or semantic opposite of the given word. Go beyond simple dictionary antonyms — consider conceptual, emotional, and philosophical opposites. Return only the opposite word(s) with a 1-sentence explanation of why.`,
      sentence: `Rewrite the sentence so its core meaning, tone, and intent are completely reversed. Keep similar structure but flip every key idea, sentiment, and implication.`,
      paragraph: `Transform the paragraph so its overall message, argument, and emotional tone are the complete opposite. Maintain similar flow and structure but invert every key idea.`,
      emotion: `Take the emotional register and feeling of this text and write something expressing the polar opposite emotional state, using similar themes and imagery but in the opposite emotional direction.`,
      story: `Write the opposite narrative: if the story has a hero, make them a villain; if it ends in triumph, end in defeat; reverse all major arcs, character motivations, and themes.`,
    };

    return `You are an expert opposite-writing AI. Your task is to produce the ${style.toLowerCase()} opposite of the given text.

Mode: ${selectedMode?.label} — ${selectedMode?.desc}
Style: ${style}
Instructions: ${modeInstructions[mode]}

${style === "Literal" ? "Be precise and direct." : ""}
${style === "Creative" ? "Be imaginative and surprising." : ""}
${style === "Poetic" ? "Use literary devices and beautiful language." : ""}
${style === "Humorous" ? "Add wit and playful irony." : ""}
${style === "Dramatic" ? "Heighten contrast for maximum dramatic effect." : ""}

Input text: "${input}"

Respond with:
OPPOSITE: [your opposite text here]
INSIGHT: [1-2 sentences explaining the key transformation you made]`;
  };

  const handleFlip = async () => {
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
          model: GROQ_MODEL,
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content || "";

      const oppMatch = raw.match(/OPPOSITE:\s*([\s\S]*?)(?:INSIGHT:|$)/i);
      const insightMatch = raw.match(/INSIGHT:\s*([\s\S]*)/i);

      const opposite = oppMatch ? oppMatch[1].trim() : raw.trim();
      const insight = insightMatch ? insightMatch[1].trim() : "";

      const entry = { input, opposite, insight, mode, style, id: Date.now() };
      setResult(entry);
      setHistory(h => [entry, ...h.slice(0, 9)]);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.opposite) {
      navigator.clipboard.writeText(result.opposite);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleHistoryLoad = (entry) => {
    setInput(entry.input);
    setMode(entry.mode);
    setStyle(entry.style);
    setResult(entry);
    setShowHistory(false);
  };

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .flip-btn:hover { background: var(--color-text-primary) !important; color: var(--color-background-primary) !important; }
        .mode-pill:hover { border-color: var(--color-text-primary) !important; }
        .hist-item:hover { background: var(--color-background-secondary) !important; }
        .copy-btn:hover { background: var(--color-background-secondary) !important; }
        textarea:focus { outline: none; border-color: var(--color-text-primary) !important; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid var(--color-text-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontStyle: "italic" }}>↔</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>AI Opposite Writer</h1>
        </div>
        <p style={{ fontSize: 15, color: "var(--color-text-secondary)", margin: 0, fontStyle: "italic" }}>
          Transform any text into its complete semantic opposite
        </p>
      </div>

      {/* Mode Selector */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 10 }}>Mode</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {MODES.map(m => (
            <button key={m.id} className="mode-pill" onClick={() => setMode(m.id)}
              style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${mode === m.id ? "var(--color-text-primary)" : "var(--color-border-tertiary)"}`, background: mode === m.id ? "var(--color-text-primary)" : "transparent", color: mode === m.id ? "var(--color-background-primary)" : "var(--color-text-primary)", fontSize: 13, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}>
              {m.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 6, fontStyle: "italic" }}>{selectedMode?.desc}</p>
      </div>

      {/* Style Selector */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 10 }}>Writing style</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {STYLES.map(s => (
            <button key={s} onClick={() => setStyle(s)}
              style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${style === s ? "var(--color-text-primary)" : "var(--color-border-tertiary)"}`, background: style === s ? "var(--color-background-secondary)" : "transparent", color: style === s ? "var(--color-text-primary)" : "var(--color-text-secondary)", fontSize: 12, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 10 }}>Your text</p>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder={`Enter your ${selectedMode?.label.toLowerCase()} here...`}
          rows={mode === "paragraph" || mode === "story" ? 6 : 3}
          style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontSize: 15, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6, transition: "border 0.15s" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{input.length} characters</span>
          {history.length > 0 && (
            <button onClick={() => setShowHistory(!showHistory)} style={{ fontSize: 12, color: "var(--color-text-secondary)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>
              {showHistory ? "hide history" : `history (${history.length})`}
            </button>
          )}
        </div>
      </div>

      {/* History Dropdown */}
      {showHistory && history.length > 0 && (
        <div style={{ marginBottom: "1rem", border: "1px solid var(--color-border-tertiary)", borderRadius: 8, overflow: "hidden" }}>
          {history.map((h, i) => (
            <div key={h.id} className="hist-item" onClick={() => handleHistoryLoad(h)}
              style={{ padding: "10px 14px", cursor: "pointer", borderBottom: i < history.length - 1 ? "1px solid var(--color-border-tertiary)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontStyle: "italic" }}>"{h.input.slice(0, 50)}{h.input.length > 50 ? "…" : ""}"</span>
              </div>
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: 12, whiteSpace: "nowrap" }}>{h.mode} · {h.style}</span>
            </div>
          ))}
        </div>
      )}

      {/* Flip Button */}
      <button className="flip-btn" onClick={handleFlip} disabled={!input.trim() || loading}
        style={{ width: "100%", padding: "13px", borderRadius: 8, border: "1.5px solid var(--color-text-primary)", background: "transparent", color: "var(--color-text-primary)", fontSize: 15, fontWeight: 500, cursor: input.trim() && !loading ? "pointer" : "default", transition: "all 0.2s", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: !input.trim() ? 0.4 : 1 }}>
        {loading ? (
          <>
            <div style={{ width: 16, height: 16, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            Flipping reality…
          </>
        ) : (
          <>↔ Generate Opposite</>
        )}
      </button>

      {/* Error */}
      {error && (
        <div style={{ marginTop: "1rem", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--color-border-danger)", background: "var(--color-background-danger)", color: "var(--color-text-danger)", fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ marginTop: "2rem", animation: "fadeUp 0.4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 2, height: 20, background: "var(--color-text-primary)", borderRadius: 1 }} />
              <p style={{ fontSize: 12, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", color: "var(--color-text-secondary)", margin: 0 }}>Opposite</p>
            </div>
            <button className="copy-btn" onClick={handleCopy}
              style={{ fontSize: 12, color: "var(--color-text-secondary)", background: "none", border: "1px solid var(--color-border-tertiary)", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s" }}>
              {copied ? "✓ copied" : "copy"}
            </button>
          </div>

          <div style={{ padding: "20px 22px", borderRadius: 8, border: "1px solid var(--color-border-secondary)", background: "var(--color-background-secondary)", fontSize: 16, lineHeight: 1.75, color: "var(--color-text-primary)", minHeight: 80 }}>
            <TypewriterText text={result.opposite} />
          </div>

          {result.insight && (
            <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 8, borderLeft: "3px solid var(--color-border-secondary)", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, fontStyle: "italic" }}>
              <span style={{ fontStyle: "normal", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--color-text-tertiary)" }}>Insight — </span>
              {result.insight}
            </div>
          )}

          {/* Before/After comparison */}
          <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid var(--color-border-tertiary)", background: "var(--color-background-primary)" }}>
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.8, textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: 6 }}>Original</p>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>"{result.input}"</p>
            </div>
            <div style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid var(--color-border-tertiary)", background: "var(--color-background-primary)" }}>
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.8, textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: 6 }}>Transformation</p>
              <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: 0, lineHeight: 1.6 }}>Mode: {result.mode} · Style: {result.style}</p>
            </div>
          </div>

          {/* Try another */}
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <button onClick={() => { setInput(""); setResult(null); }}
              style={{ fontSize: 13, color: "var(--color-text-secondary)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>
              Start over with new text →
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid var(--color-border-tertiary)", textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: 0, letterSpacing: 0.5 }}>
          AI OPPOSITE WRITER · Powered by Groq
        </p>
      </div>
    </div>
  );
}
