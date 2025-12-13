import React from "react";
import GuessCardAnime from "./GuessCardAnime";

export default function GuessListAnime({ guesses }) {
  if (!guesses || guesses.length === 0) {
    return <div className="meta">Aucune tentative.</div>;
  }

  return (
    <div className="guessArea">
      {guesses.map((g, i) => <GuessCardAnime key={i} guess={g} />)}
    </div>
  );
}
