import { useState, useEffect, useRef } from "react";

/**
 * Renders text character-by-character with a blinking cursor.
 */
export default function TypewriterText({ text, speed = 14 }) {
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
        <span className="typewriter-cursor" />
      )}
    </span>
  );
}
