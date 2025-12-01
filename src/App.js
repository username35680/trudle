import React, { useState } from "react";
import HomePage from "./HomePage";
import TrudleHeader from "./TrudleHeader";

// ton jeu existant (déplace-le sous src/games/country/AppCountry.js ou adapte l'import)
import AppCountry from "./games/AppCountry"; 

export default function App() {
  const [currentGame, setCurrentGame] = useState(null);

  const games = [{ id: "country", label: "Pays" }];

  const goHome = () => setCurrentGame(null);

  return (
    <div className="app-root">
      <TrudleHeader onHomeClick={goHome} games={games} onSelectGame={setCurrentGame} />

      {currentGame === "country" ? (
        // on passe onSelectGame pour que le header du jeu fonctionne si nécessaire
        <AppCountry onSelectGame={setCurrentGame} />
      ) : (
        <HomePage onSelectGame={setCurrentGame} />
      )}
    </div>
  );
}
