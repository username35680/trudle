import React from "react";
import "./HomePage.css";
import { Helmet } from "react-helmet-async";

export default function HomePage({ onSelectGame }) {
  return (
    <div className="trudle-root">
      
      {/* SEO */}
      <Helmet>
        <title>Trudle — Jeux éducatifs et ludiques en ligne</title>
        <meta
          name="description"
          content="Trudle est une plateforme de jeux à thème pour apprendre en s’amusant : ChronoMix, Qui suis-je, Mini RPG, quiz pays et animés."
        />
      </Helmet>

      {/* background image */}
      <div
        className="trudle-map"
        aria-hidden
      />

      {/* header is outside in App (see App.js), this is just the content area */}
      <main className="trudle-main">
        <h1 className="trudle-title">TRUDLE</h1>

        <h2 className="trudle-sub">
          Jeux à thème — devine, apprends et challenge-toi
        </h2>

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
          {/* ⏳ Nouveau jeu : ChronoMix */}
          <button
            className="game-card"
            onClick={() => onSelectGame("chronomix")}
            title="Jouer à ChronoMix"
          >
            <div className="game-visual">⏳</div>
            <div className="game-label">ChronoMix</div>
          </button>
          {/* 👤 Nouveau jeu : Qui suis-je */}
          <button
            className="game-card"
            onClick={() => onSelectGame("whoami")}
            title="Jouer à Qui suis-je ?"
          >
            <div className="game-visual">👤</div>
            <div className="game-label">Qui suis-je ?</div>
          </button>
          <button
            className="game-card"
            onClick={() => onSelectGame("rpg")}
            title="Jouer au Mini RPG"
          >
            <div className="game-visual">🗺️</div>
            <div className="game-label">Mini RPG</div>
          </button>

        </section>

        <section className="seo-content">
          <h2>Jeux éducatifs et ludiques en ligne</h2>
          <p>
            Trudle est une plateforme de jeux à thème conçue pour apprendre en
            s’amusant. Explore des jeux comme ChronoMix, Qui suis-je,
            Mini RPG ou encore des quiz sur les pays et les animés.
          </p>

          <p>
            Chaque jeu stimule la mémoire, la logique et la culture générale,
            seul ou entre amis.
          </p>
        </section>
        {/* <footer className="site-footer">
          <p>© {new Date().getFullYear()} Trudle</p>
          <nav>
            <a href="/mentions-legales">Mentions légales</a>
            <a href="/confidentialite">Confidentialité</a>
            <a href="/contact">Contact</a>
          </nav>
        </footer> */}
      </main>
    </div>
  );
}
