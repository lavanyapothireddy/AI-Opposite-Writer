import { useState, useEffect, useRef } from "react";

/**
 * Renders text character-by-character with a blinking cursor.
 * @param {string} text  - The text to animate
 * @param {number} speed - Milliseconds per character (default 16)
 */
export default function TypewriterText({ text, speed = 16 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);
  const idxRef                    = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    idxRef.current = 0;

    if (!text) return;

    const interval = setInterval(() => {
      if (idxRef.current >= text.length) {
        clearInterval(interval);
        setDone(true);
        return;
      }
      setDisplayed(text.slice(0, ++idxRef.current));
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && (
        <span
          style={{
            borderRight: "2px solid currentColor",
            animation: "blink 0.7s step-end infinite",
            marginLeft: 1,
          }}
        />
      )}
    </span>
  );
}