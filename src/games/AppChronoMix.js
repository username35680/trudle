// games/AppChronoMix.jsx
import { useEffect, useState } from "react";
import { chronomixEvents } from "../data/chronomixEvents";
import ChronoBoard from "../component/ChronoBoard";

export default function AppChronoMix() {
  const [events, setEvents] = useState([]);
  const [validated, setValidated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [gameWon, setGameWon] = useState(false);

    useEffect(() => {
    startNewGame();
    }, []);


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

    const isCorrect = placed.every((event, index) => {
      if (index === 0) return true;
      const prevDate = new Date(placed[index - 1].date);
      const currDate = new Date(event.date);
      return prevDate <= currDate;
    });
    
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
      <h2>ChronoMix</h2>
      <p>Remets les événements dans l’ordre chronologique</p>

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
