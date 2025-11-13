import React from "react";

// Semplice e sempre funzionante!
export default function Furigana({ word, furigana }) {
  return (
    <ruby>
      {word}
      <rt>{furigana}</rt>
    </ruby>
  );
}