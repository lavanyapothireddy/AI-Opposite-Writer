import { useState } from "react";
import { useOppositeWriter } from "./hooks/useOppositeWriter";
import { MODES, STYLES } from "./utils/buildPrompt";
import TypewriterText from "./components/TypewriterText";

export default function App() {
  const {
    mode, setMode,
    style, setStyle,
    input, setInput,
    result, loading, error,
    history, generate, reset, loadFromHistory,
  } = useOppositeWriter();

  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedMode = MODES.find((m) => m.id === mode);

  const handleCopy = () => {
    if (result?.opposite) {
      navigator.clipboard.writeText(result.opposite).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="app">
      {/* ── Background grid ── */}
      <div className="bg-grid" aria-hidden="true" />

      <div className="container">

        {/* ── Header ── */}
        <header className="header">
          <div className="header-badge">↔</div>
          <div className="header-text">
            <h1 className="title">Opposite<br /><span className="title-accent">Writer</span></h1>
            <p className="subtitle">Transform any text into its complete semantic opposite</p>
          </div>
        </header>

        <div className="card">

          {/* ── Mode selector ── */}
          <section className="section">
            <label className="section-label">Mode</label>
            <div className="mode-grid">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`mode-btn ${mode === m.id ? "mode-btn--active" : ""}`}
                >
                  <span className="mode-icon">{m.icon}</span>
                  <span className="mode-label">{m.label}</span>
                </button>
              ))}
            </div>
            <p className="mode-desc">{selectedMode?.desc}</p>
          </section>

          {/* ── Style selector ── */}
          <section className="section">
            <label className="section-label">Writing Style</label>
            <div className="style-row">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`style-btn ${style === s ? "style-btn--active" : ""}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* ── Input ── */}
          <section className="section">
            <div className="input-header">
              <label className="section-label">Your Text</label>
              {history.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="hist-toggle"
                >
                  {showHistory ? "Hide history" : `History (${history.length})`}
                </button>
              )}
            </div>

            {showHistory && history.length > 0 && (
              <div className="history-list">
                {history.map((h, i) => (
                  <div
                    key={h.id}
                    className="history-item"
                    onClick={() => { loadFromHistory(h); setShowHistory(false); }}
                  >
                    <span className="history-text">
                      "{h.input.slice(0, 55)}{h.input.length > 55 ? "…" : ""}"
                    </span>
                    <span className="history-meta">{h.mode} · {h.style}</span>
                  </div>
                ))}
              </div>
            )}

            <textarea
              className="textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter your ${selectedMode?.label.toLowerCase()} here…`}
              rows={mode === "paragraph" || mode === "story" ? 6 : 3}
            />
            <span className="char-count">{input.length} chars</span>
          </section>

          {/* ── Generate button ── */}
          <button
            className={`generate-btn ${loading ? "generate-btn--loading" : ""}`}
            onClick={generate}
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Flipping reality…
              </>
            ) : (
              <>
                <span className="btn-arrow">↔</span>
                Generate Opposite
              </>
            )}
          </button>

          {/* ── Error ── */}
          {error && (
            <div className="error-box">
              ⚠ {error}
            </div>
          )}
        </div>

        {/* ── Result ── */}
        {result && (
          <div className="result-card">
            <div className="result-header">
              <div className="result-label-row">
                <div className="result-bar" />
                <span className="result-label">Opposite</span>
              </div>
              <button onClick={handleCopy} className="copy-btn">
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>

            <div className="result-output">
              <TypewriterText text={result.opposite} />
            </div>

            {result.insight && (
              <div className="insight-box">
                <span className="insight-label">Insight — </span>
                {result.insight}
              </div>
            )}

            <div className="compare-grid">
              <div className="compare-card">
                <p className="compare-label">Original</p>
                <p className="compare-text">
                  "{result.input.slice(0, 120)}{result.input.length > 120 ? "…" : ""}"
                </p>
              </div>
              <div className="compare-card">
                <p className="compare-label">Transformation</p>
                <p className="compare-meta">
                  Mode: <strong>{result.mode}</strong><br />
                  Style: <strong>{result.style}</strong>
                </p>
              </div>
            </div>

            <div className="reset-row">
              <button onClick={reset} className="reset-btn">
                ← Start over with new text
              </button>
            </div>
          </div>
        )}

        <footer className="footer">
          AI Opposite Writer · Powered by Groq + Llama 3.3
        </footer>
      </div>
    </div>
  );
}
