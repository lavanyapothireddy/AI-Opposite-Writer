import { useState } from "react";

/**
 * Collapsible drawer showing the last 10 transformations.
 * Clicking an entry reloads that session.
 */
export default function HistoryDrawer({ history, onLoad }) {
  const [open, setOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <div style={{ marginBottom: "0.5rem" }}>
      {/* Toggle link */}
      <div style={{ textAlign: "right", marginBottom: open ? 8 : 0 }}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            fontSize: 12, color: "var(--text2)", background: "none",
            border: "none", cursor: "pointer", fontFamily: "inherit",
            textDecoration: "underline",
          }}
        >
          {open ? "hide history" : `history (${history.length})`}
        </button>
      </div>

      {/* List */}
      {open && (
        <div
          style={{
            border: "1px solid var(--border)", borderRadius: 8,
            overflow: "hidden", marginBottom: 12,
          }}
        >
          {history.map((entry, i) => (
            <div
              key={entry.id}
              onClick={() => { onLoad(entry); setOpen(false); }}
              style={{
                padding: "9px 14px", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                borderBottom: i < history.length - 1 ? "1px solid var(--border)" : "none",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: 12, color: "var(--text2)", fontStyle: "italic" }}>
                "{entry.input.slice(0, 52)}{entry.input.length > 52 ? "…" : ""}"
              </span>
              <span style={{ fontSize: 11, color: "var(--text3)", marginLeft: 12, whiteSpace: "nowrap" }}>
                {entry.mode} · {entry.style}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}