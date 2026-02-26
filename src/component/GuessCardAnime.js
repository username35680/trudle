import React from "react";

export default function GuessCardAnime({ guess }) {
  if (!guess) return null;

  const { name, aired, episodes, hint } = guess;

  // Helper pour les classes CSS
  const getStatusClass = (status) => {
    if (status === "correct") return "box green";
    if (status === "partial") return "box orange"; // Pense à ajouter .orange dans ton CSS
    return "box red";
  };

  return (
    <div className="guessRow" style={{ alignItems: "stretch" }}>
      {/* Nom */}
      <div className={hint.name ? "box green" : "box red"} style={{ flex: "0 0 22%" }}>
        <div className="label">Nom</div>
        <div className="value">{name}</div>
      </div>

      {/* Année (Aired) */}
      <div className={getStatusClass(hint.year.status)} style={{ flex: "0 0 15%" }}>
        <div className="label">Année</div>
        <div className="value">{aired}</div>
        <div className="arrow">{hint.year.arrow}</div>
      </div>

      {/* Episodes */}
      <div className={getStatusClass(hint.episodes.status)} style={{ flex: "0 0 13%" }}>
        <div className="label">Épisodes</div>
        <div className="value">
          {/* Si la valeur est 0, on affiche En cours */}
          {episodes === 0 ? "En cours" : episodes}
        </div>
        <div className="arrow">{hint.episodes.arrow}</div>
      </div>

      {/* Genres */}
      <div className={getStatusClass(hint.genres.status)} style={{ flex: "0 0 22%" }}>
        <div className="label">Genres</div>
        <div className="value" style={{ fontSize: "0.85em" }}>{hint.genres.value}</div>
      </div>

      {/* Studios */}
      <div className={getStatusClass(hint.studios.status)} style={{ flex: "0 0 22%" }}>
        <div className="label">Studios</div>
        <div className="value" style={{ fontSize: "0.85em" }}>{hint.studios.value}</div>
      </div>
    </div>
  );
}