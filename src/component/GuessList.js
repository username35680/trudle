import React from "react";
import GuessCard from "./GuessCard";

export default function GuessList({ guesses }) {
  if (!guesses || guesses.length === 0) {
    return <div className="meta">Aucune tentative pour l'instant.</div>;
  }

  return (
    <div className="guessArea">
      {guesses.map((g, i) => (
        <GuessCard key={i} guess={g} />
      ))}
    </div>
  );
}
