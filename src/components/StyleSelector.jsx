import { STYLES } from "../utils/buildPrompt";

/**
 * Compact button row for selecting the writing style.
 */
export default function StyleSelector({ style, setStyle }) {
  return (
    <div style={{ marginBottom: "1.4rem" }}>
      <p style={labelStyle}>Writing style</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {STYLES.map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            style={{
              padding: "5px 12px",
              borderRadius: 6,
              border: `1px solid ${style === s ? "var(--border2)" : "var(--border)"}`,
              background: style === s ? "var(--bg2)" : "transparent",
              color: style === s ? "var(--text)" : "var(--text2)",
              fontSize: 12,
              fontWeight: style === s ? 500 : 400,
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "inherit",
            }}
          >
            {s}
          </button>
        ))}
      </div>
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
