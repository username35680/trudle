// games/AppWhoAmI.jsx
import { useEffect, useState } from "react";
import GuessInput from "../component/GuessInput";
import { whoamiPeople } from "../data/whoamiPeople";
const deduplicated = [];
const seenItems = new Set();

for (const person of whoamiPeople) {
  if (!seenItems.has(person.item)) {
    deduplicated.push(person); // garde la première occurrence
    seenItems.add(person.item);
  }
}

export { deduplicated as whoamiPeopleClean };

export default function AppWhoAmI() {
  const [person, setPerson] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [step, setStep] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme === "dark" ? "dark" : "light"
    );
    localStorage.setItem("theme", theme);
  }, [theme]);

  const startNewGame = () => {
    const random = deduplicated[Math.floor(Math.random() * deduplicated.length)];
    setPerson(random);
    setStep(0);
    setGuesses([]);
    setGameWon(false);
    setGameOver(false);
    setShowPopup(false);
  };

  if (!person) return null;

  // 🔹 Préparer les indices à débloquer
  const clues = [
    person.birthDate ? `Je suis né le ${new Date(person.birthDate).toLocaleDateString("fr-FR")}` : null,
    person.deathDate ? `Je suis mort le ${new Date(person.deathDate).toLocaleDateString("fr-FR")}` : null,
    person.countryLabel ? `Je viens de ${person.countryLabel}` : null,
    person.description ? person.description : null
    ].filter(Boolean);


  const handleGuess = (name) => {
    if (gameWon || gameOver) return;

    const normalizedGuess = name.trim().toLowerCase();
    const normalizedAnswer = person.itemLabel.toLowerCase();

    const isCorrect = normalizedGuess === normalizedAnswer;

    setGuesses(prev => [...prev, { name }]);

    // Débloquer les indices progressivement
    if (guesses.length + 1 >= 2) setStep(Math.max(step, 1));
    if (guesses.length + 1 >= 4) setStep(Math.max(step, 2));
    if (guesses.length + 1 >= 6) setStep(Math.max(step, 3));

    if (isCorrect) {
      setGameWon(true);
      setShowPopup(true);
    } else if (guesses.length + 1 >= 10) {
      setGameOver(true);
      setShowPopup(true);
    }
  };

  const handleGiveUp = () => {
    setGameOver(true);
    setShowPopup(true);
  };

  return (
    <div className="app">
      <div className="header">
        <div className="title">
          <div className="logo">WHO</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Qui suis-je ?</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              Devine la personnalité avec le moins d’indices possible
            </div>
          </div>
        </div>

        <div className="controls">
          <button
            className="ghost"
            onClick={() => setTheme(prev => (prev === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? "Clair" : "Sombre"}
          </button>
          <button className="ghost" onClick={handleGiveUp} disabled={gameWon || gameOver}>
            Abandonner
          </button>
        </div>
      </div>

      <div className="hintsRow">
        {clues.slice(0, step + 1).map((clue, i) => (
          <div key={i} className="hintBox unlocked">
            {clue}
          </div>
        ))}
        {step < clues.length - 1 && !gameWon && !gameOver && (
          <div className="hintBox">Indice verrouillé — continue d'essayer</div>
        )}
      </div>

      {/* 🔹 Utilisation de GuessInput pour les suggestions */}
      <GuessInput
        onGuess={handleGuess}
        disabled={gameWon || gameOver}
        countries={deduplicated.map(p => ({ name: p.itemLabel }))} // suggestions
        guesses={guesses}
      />

      {showPopup && (
        <div className="modalOverlay">
          <div className="modal">
            <h2 style={{ marginTop: 0 }}>
              {gameWon ? "🎉 Bravo !" : "❌ Partie terminée"}
            </h2>
            <p>
              {gameWon
                ? "Bonne réponse !"
                : `La bonne réponse était : ${person.itemLabel}`}
            </p>

            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
              <button className="primary" onClick={startNewGame}>
                Rejouer
              </button>
              <button className="ghost" onClick={() => setShowPopup(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <h3>Essais :</h3>
        <ul>
          {guesses.map((g, i) => (
            <li key={i}>{g.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
