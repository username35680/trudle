import React from "react";
import "./HomePage.css";
import mapImg from "./datasets/map-monde.jpg"; // <-- vérifie le chemin (src/dataset/map-monde.png)

export default function HomePage({ onSelectGame }) {
  return (
    <div className="trudle-root">
      {/* background image */}
      <div
        className="trudle-map"
        style={{ backgroundImage: `url(${mapImg})` }}
        aria-hidden
      />

      {/* header is outside in App (see App.js), this is just the content area */}
      <main className="trudle-main">
        <h1 className="trudle-title">TRUDLE</h1>

        <p className="trudle-sub">
          Jeux à thème — devine, apprends et challenge-toi
        </p>

        <section className="games-grid" aria-label="Jeux disponibles">
          <button
            className="game-card"
            onClick={() => onSelectGame("country")}
            title="Jouer au jeu des Pays"
          >
            <div className="game-visual">🌍</div>
            <div className="game-label">Pays</div>
          </button>

          {/* Placeholder - tu pourras dupliquer pour d'autres jeux */}
          <div className="game-card disabled" title="Bientôt">
            <div className="game-visual">🏳️</div>
            <div className="game-label">Drapeaux (bientôt)</div>
          </div>
        </section>

        <div className="footer-note">Fais 5 essais pour débloquer l'indice</div>
      </main>
    </div>
  );
}
