export const MODES = [
  { id: "word",      label: "Word",      icon: "W", desc: "Single word opposites — conceptual & philosophical" },
  { id: "sentence",  label: "Sentence",  icon: "S", desc: "Flip sentence meaning, tone, and intent" },
  { id: "paragraph", label: "Paragraph", icon: "P", desc: "Reverse the entire message and argument" },
  { id: "emotion",   label: "Emotion",   icon: "E", desc: "Flip emotional register — joy ↔ melancholy" },
  { id: "story",     label: "Story",     icon: "N", desc: "Invert narrative arc — hero ↔ villain, triumph ↔ defeat" },
];

export const STYLES = ["Literal", "Creative", "Poetic", "Humorous", "Dramatic"];

const MODE_INSTRUCTIONS = {
  word: `Return the most interesting, thought-provoking antonym or semantic opposite of the given word.
Go beyond simple dictionary antonyms — consider conceptual, emotional, and philosophical opposites.
Return the opposite word(s) with a 1-sentence explanation of why.`,
  sentence: `Rewrite the sentence so its core meaning, tone, and intent are completely reversed.
Keep similar structure but flip every key idea, sentiment, and implication.`,
  paragraph: `Transform the paragraph so its overall message, argument, and emotional tone are the complete opposite.
Maintain similar flow and structure but invert every key idea.`,
  emotion: `Take the emotional register and feeling of this text and write something expressing the polar opposite
emotional state, using similar themes and imagery but in the opposite emotional direction.`,
  story: `Write the opposite narrative: if the story has a hero, make them a villain; if it ends in triumph,
end in defeat; reverse all major arcs, character motivations, and themes.`,
};

const STYLE_HINTS = {
  Literal:   "Be precise and direct. Stick to factual opposites.",
  Creative:  "Be imaginative and surprising. Subvert expectations.",
  Poetic:    "Use literary devices, metaphor, and beautiful language.",
  Humorous:  "Add wit and playful irony. Make it cleverly funny.",
  Dramatic:  "Heighten contrast for maximum dramatic effect. Go big.",
};

/**
 * Build the prompt string for the API call.
 */
export function buildPrompt(input, modeId, style) {
  const mode = MODES.find((m) => m.id === modeId);
  return `You are an expert opposite-writing AI. Your task is to produce the ${style.toLowerCase()} opposite of the given text.

Mode: ${mode?.label} — ${mode?.desc}
Style: ${style}
Instructions: ${MODE_INSTRUCTIONS[modeId]}
Style hint: ${STYLE_HINTS[style]}

Input text: "${input}"

Respond with exactly this format:
OPPOSITE: [your opposite text here]
INSIGHT: [1-2 sentences explaining the key transformation you made]`;
}
