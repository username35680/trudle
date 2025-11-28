import React, { useState } from "react";

export default function GuessInput({ onGuess }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    onGuess(input.trim());
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Devinez un pays..."
        style={{ padding: 8, width: "70%" }}
      />
      <button type="submit" style={{ padding: 8 }}>Deviner</button>
    </form>
  );
}
