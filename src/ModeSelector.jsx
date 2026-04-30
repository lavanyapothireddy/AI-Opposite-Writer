import { MODES } from "../utils/buildPrompt";

/**
 * Pill-button row for selecting the transformation mode.
 */
export default function ModeSelector({ mode, setMode }) {
  const selected = MODES.find((m) => m.id === mode);

  return (
    <div style={{ marginBottom: "1.4rem" }}>
      <p style={labelStyle}>Mode</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: `1.5px solid ${mode === m.id ? "var(--text)" : "var(--border)"}`,
              background: mode === m.id ? "var(--text)" : "transparent",
              color: mode === m.id ? "var(--bg)" : "var(--text)",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "inherit",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 6, fontStyle: "italic" }}>
        {selected?.desc}
      </p>
    </div>
  );
}

const labelStyle = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: "var(--text3)",
  marginBottom: 8,
};