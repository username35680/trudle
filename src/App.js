import React, {useEffect, useState } from "react";
import HomePage from "./HomePage";
import TrudleHeader from "./TrudleHeader";

// ton jeu existant (déplace-le sous src/games/country/AppCountry.js ou adapte l'import)
import AppCountry from "./games/AppCountry"; 
import AppAnime from "./games/AppAnime"; 
import AppChronoMix from "./games/AppChronoMix";
import AppWhoAmI from "./games/AppWhoAmI";
import AppMiniRPG from "./games/miniRPG/AppMiniRPG";

export default function App() {
  const [currentGame, setCurrentGame] = useState(null);

  const games = [
    { id: "country", label: "Pays" },
    { id: "anime", label: "Animé" },
    { id: "chronomix", label: "ChronoMix" },
    { id: "whoami", label: "Qui suis-je ?" },
    { id: "rpg", label: "Mini RPG" },
  ];

  const goHome = () => setCurrentGame(null);

  useEffect(() => {
    document.body.classList.remove(
      "bg-country",
      "bg-anime",
      "bg-chronomix",
      "bg-whoami"
    );

    if (currentGame === "country") {
      document.body.classList.add("bg-country");
    } else if (currentGame === "anime") {
      document.body.classList.add("bg-anime");
    } else if (currentGame === "chronomix") {
      document.body.classList.add("bg-chronomix");
    } else if (currentGame === "whoami") {
      document.body.classList.add("bg-whoami");
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
          ) : currentGame === "whoami" ? (
            <AppWhoAmI />
          ) : currentGame === "rpg" ? (
            <AppMiniRPG />
          ) : (
            <HomePage onSelectGame={setCurrentGame} />
          )}





    </div>
  );
}
