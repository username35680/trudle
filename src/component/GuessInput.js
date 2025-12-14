import React, { useState } from "react";

export default function GuessInput({ onGuess, disabled, countries, guesses = [] }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1); // 🔥 nouvel état

  const submit = (e) => {
    e?.preventDefault();
    if (disabled) return;

    // Si une suggestion est sélectionnée → on la prend
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      onGuess(suggestions[selectedIndex].name);
      resetInput();
      return;
    }

    // Sinon si on a des suggestions → on prend la première
    if (suggestions.length > 0) {
      onGuess(suggestions[0].name);
      resetInput();
      return;
    }

    // Sinon on prend l'entrée normale
    const val = input.trim();
    if (!val) return;

    onGuess(val);
    resetInput();
  };

  const resetInput = () => {
    setInput("");
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    setSelectedIndex(-1);

    if (!val) {
      setSuggestions([]);
      return;
    }

    const normalizedVal = val
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const filtered = (countries || [])
    .filter((c) =>
      c.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(normalizedVal)
    )
    .filter(c => !guesses.some(g => g.name === c.name));


    setSuggestions(filtered);
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }

    if (e.key === "Enter") {
      submit(e);
    }
  };

  return (
    <form onSubmit={submit} style={{ width: "100%" }}>
      <div className="searchRow" style={{ position: "relative", width: "100%" }}>
        
        <input
          type="text"
          placeholder="Devinez un pays..."
          value={input}
          onChange={handleChange}
          disabled={disabled}
          autoComplete="off"
          onKeyDown={handleKeyDown} // 🔥 indispensable !
        />

        {suggestions.length > 0 && (
          <div className="suggestionsBox">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className={`suggestionItem ${i === selectedIndex ? "active" : ""}`}
                onMouseDown={() => {
                  onGuess(s.name);
                  resetInput();
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                {s.name}
              </div>
            ))}
          </div>
        )}


        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button type="submit" className="primary" disabled={disabled}>
            Deviner
          </button>
          <button
            type="button"
            className="ghost"
            onClick={() => resetInput()}
            disabled={disabled}
          >
            Effacer
          </button>
        </div>
      </div>
    </form>
  );
}
