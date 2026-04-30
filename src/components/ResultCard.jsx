import { useState } from "react";
import TypewriterText from "./TypewriterText";

/**
 * Displays the generated opposite text, insight, before/after comparison,
 * and a copy button.
 */
export default function ResultCard({ result, onReset }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.opposite).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ marginTop: "2rem", animation: "fadeUp 0.4s ease" }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 2, height: 20, background: "var(--text)", borderRadius: 1 }} />
          <p style={labelStyle}>Opposite</p>
        </div>
        <button onClick={handleCopy} style={copyBtnStyle}>
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>

      {/* Output box */}
      <div style={outputBoxStyle}>
        <TypewriterText text={result.opposite} />
      </div>

      {/* Insight */}
      {result.insight && (
        <div style={insightStyle}>
          <span style={insightLabelStyle}>Insight — </span>
          {result.insight}
        </div>
      )}

      {/* Before / After comparison */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: "1.2rem" }}>
        <div style={compareCardStyle}>
          <p style={compareLabelStyle}>Original</p>
          <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, fontStyle: "italic" }}>
            "{result.input.slice(0, 120)}{result.input.length > 120 ? "…" : ""}"
          </p>
        </div>
        <div style={compareCardStyle}>
          <p style={compareLabelStyle}>Transformation</p>
          <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>
            Mode: {result.mode}<br />Style: {result.style}
          </p>
        </div>
      </div>

      {/* Reset */}
      <div style={{ textAlign: "center", marginTop: "1.4rem" }}>
        <button onClick={onReset} style={resetBtnStyle}>
          Start over with new text →
        </button>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: 11, fontWeight: 600, letterSpacing: 1,
  textTransform: "uppercase", color: "var(--text3)", margin: 0,
};
const copyBtnStyle = {
  fontSize: 12, color: "var(--text2)", background: "none",
  border: "1px solid var(--border)", borderRadius: 6,
  padding: "4px 10px", cursor: "pointer", fontFamily: "inherit",
};
const outputBoxStyle = {
  padding: "18px 20px", borderRadius: 8,
  border: "1px solid var(--border2)", background: "var(--bg2)",
  fontSize: 16, lineHeight: 1.75, minHeight: 80,
};
const insightStyle = {
  marginTop: 10, padding: "11px 15px", borderRadius: 8,
  borderLeft: "3px solid var(--border2)",
  fontSize: 13, color: "var(--text2)", lineHeight: 1.6, fontStyle: "italic",
};
const insightLabelStyle = {
  fontStyle: "normal", fontWeight: 600, fontSize: 11,
  textTransform: "uppercase", letterSpacing: 0.8, color: "var(--text3)",
};
const compareCardStyle = {
  padding: "12px 14px", borderRadius: 8,
  border: "1px solid var(--border)", background: "var(--bg)",
};
const compareLabelStyle = {
  fontSize: 11, fontWeight: 600, letterSpacing: 0.8,
  textTransform: "uppercase", color: "var(--text3)", marginBottom: 5,
};
const resetBtnStyle = {
  fontSize: 13, color: "var(--text2)", background: "none",
  border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline",
};
