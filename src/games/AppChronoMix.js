// games/AppChronoMix.jsx
import { useEffect, useState } from "react";
import { chronomixEvents } from "../data/chronomixEvents";
import ChronoBoard from "../component/ChronoBoard";

export default function AppChronoMix() {
  const [events, setEvents] = useState([]);
  const [validated, setValidated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [gameWon, setGameWon] = useState(false);
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

  const checkOrder = () => {
    // 1️⃣ cartes placées dans les slots
    const placed = events
      .filter(e => e.position !== null)
      .sort((a, b) => a.position - b.position);

    // 2️⃣ sécurité : toutes les cases doivent être remplies
    if (placed.length !== 5) {
      setGameWon(false);
      setValidated(true);
      setShowPopup(true);
      return;
    }

    // 3️⃣ vérifier chronologique
    const isCorrect = placed.every((event, index) => {
      if (index === 0) return true;
      const prevDate = new Date(placed[index - 1].date);
      const currDate = new Date(event.date);
      return prevDate <= currDate;
    });

    // 4️⃣ définir status pour chaque carte
    const corrected = [...placed].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const newEvents = events.map(e => {
      const placedIndex = placed.findIndex(p => p.id === e.id);
      if (placedIndex === -1) return { ...e, status: null };

      const correctIndex = corrected.findIndex(c => c.id === e.id);

      if (placedIndex === correctIndex) {
        return { ...e, status: "correct", position: correctIndex };
      } else {
        return { ...e, status: "wrong", position: correctIndex }; // on déplace pour correction
      }
    });

    setEvents(newEvents);
    setGameWon(isCorrect);
    setValidated(true);
    setShowPopup(true);
  };



  const startNewGame = () => {
    const shuffled = [...chronomixEvents]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(e => ({ ...e, position: null }));

    setEvents(shuffled);
    setValidated(false);
    setGameWon(false);
    setShowPopup(false);
  };



  return (
    <div className="app">
      <div className="header">
        <div className="title">
            <div className="logo">CH</div>
            <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Chronoly</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Remets les événements dans l’ordre chronologique</div>
            </div>
        </div>

        <div className="controls">
            <button
            className="ghost"
            onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
            >
            {theme === "dark" ? "Clair" : "Sombre"}
            </button>
        </div>

      </div>

      <ChronoBoard items={events} setItems={setEvents} />

      <button className="primary" onClick={checkOrder}>Valider</button>

      {showPopup && (
        <div className="modalOverlay">
            <div className="modal">
            <h2 style={{ marginTop: 0 }}>
                {gameWon ? "🎉 Bravo !" : "❌ Perdu"}
            </h2>

            <p>
                {gameWon
                ? "Tu as remis les événements dans le bon ordre."
                : "L’ordre chronologique n’est pas correct."}
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

    </div>
  );
}
