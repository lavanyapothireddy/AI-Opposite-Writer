import { useState } from "react";

export default function App() {
  const [mode, setMode] = useState("Sentence");
  const [style, setStyle] = useState("Literal");
  const [text, setText] = useState("");

  const modes = ["Word", "Sentence", "Paragraph", "Emotion", "Story"];
  const styles = ["Literal", "Creative", "Poetic", "Humorous", "Dramatic"];

  return (
    <div className="app">
      <div className="card">
        <h1>↔ AI Opposite Writer</h1>
        <p className="subtitle">
          Transform any text into its complete semantic opposite
        </p>

        {/* MODE */}
        <div className="section">
          <label>Mode</label>
          <div className="chips">
            {modes.map((m) => (
              <button
                key={m}
                className={mode === m ? "chip active" : "chip"}
                onClick={() => setMode(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* STYLE */}
        <div className="section">
          <label>Writing Style</label>
          <div className="chips">
            {styles.map((s) => (
              <button
                key={s}
                className={style === s ? "chip active" : "chip"}
                onClick={() => setStyle(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* TEXT */}
        <div className="section">
          <label>Your Text</label>
          <textarea
            placeholder="Enter your sentence here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="char-count">{text.length} characters</div>
        </div>

        {/* BUTTON */}
        <button className="generate">
          ↔ Generate Opposite
        </button>
      </div>

      <footer>AI Opposite Writer · Powered by Groq</footer>
    </div>
  );
}
