import React from "react";
import GuessCard from "./GuessCard";

export default function GuessList({ guesses }) {
  return (
    <div>
      {guesses.map((g, i) => (
        <GuessCard key={i} guess={g} />
      ))}
    </div>
  );
}
