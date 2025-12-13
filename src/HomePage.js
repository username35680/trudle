import React from "react";
import "./HomePage.css";

export default function HomePage({ onSelectGame }) {
  return (
    <div className="trudle-root">
      {/* background image */}
      <div
        className="trudle-map"
        aria-hidden
      />

      {/* header is outside in App (see App.js), this is just the content area */}
      <main className="trudle-main">
        <h1 className="trudle-title">TRUDLE</h1>

        <p className="trudle-sub">
          Jeux à thème — devine, apprends et challenge-toi
        </p>

        <section className="games-grid" aria-label="Jeux disponibles">
          {/* Jeu Pays */}
          <button
            className="game-card"
            onClick={() => onSelectGame("country")}
            title="Jouer au jeu des Pays"
          >
            <div className="game-visual">🌍</div>
            <div className="game-label">Pays</div>
          </button>

          {/* 👉 Nouveau jeu : Animé */}
          <button
            className="game-card"
            onClick={() => onSelectGame("anime")}
            title="Jouer au jeu des Animés"
          >
            <div className="game-visual">🎌</div>
            <div className="game-label">Animé</div>
          </button>
          
        </section>
      </main>
    </div>
  );
}
