import React, {useEffect, useState } from "react";
import HomePage from "./HomePage";
import TrudleHeader from "./TrudleHeader";

// ton jeu existant (déplace-le sous src/games/country/AppCountry.js ou adapte l'import)
import AppCountry from "./games/AppCountry"; 
import AppAnime from "./games/AppAnime"; 
import AppChronoMix from "./games/AppChronoMix";

export default function App() {
  const [currentGame, setCurrentGame] = useState(null);

  const games = [{ id: "country", label: "Pays" },{ id: "anime", label: "Animé" },{ id: "chronomix", label: "ChronoMix" }];

  const goHome = () => setCurrentGame(null);

  useEffect(() => {
    document.body.classList.remove(
      "bg-country",
      "bg-anime",
      "bg-chronomix"
    );

    if (currentGame === "country") {
      document.body.classList.add("bg-country");
    } else if (currentGame === "anime") {
      document.body.classList.add("bg-anime");
    } else if (currentGame === "chronomix") {
      document.body.classList.add("bg-chronomix");
    }
  }, [currentGame]);



  return (
    <div className="app-root">
      <TrudleHeader onHomeClick={goHome} games={games} onSelectGame={setCurrentGame} />

          {currentGame === "anime" ? (
              <AppAnime />
            ) : currentGame === "country" ? (
              <AppCountry />
            ) : currentGame === "chronomix" ? (
              <AppChronoMix />
            ) : (
              <HomePage onSelectGame={setCurrentGame} />
            )}



    </div>
  );
}
