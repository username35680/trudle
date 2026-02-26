import React, { useEffect, useState } from "react";
import GuessInput from "../component/GuessInput";
import GuessListAnime from "../component/GuessListAnime";
import { normalize } from "../utils/gameUtils";
import { supabase } from "../supabaseClient";

export default function AppAnime() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  
  const [showImage, setShowImage] = useState(false);
  const [showSynopsis, setShowSynopsis] = useState(false);
  const [imageUnlocked, setImageUnlocked] = useState(false);
  const [synopsisUnlocked, setSynopsisUnlocked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Initialisation du thème
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Chargement des données depuis Supabase
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data, error } = await supabase
        .from("anime") // Remplace par le nom exact de ta table
        .select("*");

      if (error) {
        console.error("Erreur Supabase:", error);
      } else {
        console.log(data)
        const mapped = data.map(a => ({
          id: a.anime_id,
          name: a["name"], // Correspond à ton script de nettoyage
          genres: a.genres ? a.genres.split(",").map(g => g.trim()) : [],
          episodes: parseInt(a.episodes) || 0,
          aired: parseInt(a.aired) || 0,
          studios: a.studios ? a.studios.split(",").map(s => s.trim()) : [],
          image: a["image"],
          synopsis: a.synopsis
        }));
        setAnimeList(mapped);
        setTarget(mapped[Math.floor(Math.random() * mapped.length)]);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleGuess = (name) => {
    if (gameWon || gameOver || !target) return;

    const normalizedInput = normalize(name);
    const found = animeList.find(a => normalize(a.name) === normalizedInput);

    if (!found) {
      alert("Animé non trouvé !");
      return;
    }

    // --- LOGIQUE DES HINTS ---
    const checkArray = (targetArr, foundArr) => {
      const isExact = JSON.stringify(targetArr.sort()) === JSON.stringify(foundArr.sort());
      const hasPartial = foundArr.some(item => targetArr.includes(item));
      if (isExact) return "correct"; // Vert
      if (hasPartial) return "partial"; // Orange
      return "incorrect"; // Rouge
    };

    const hint = {
      name: found.name === target.name,
      year: {
        value: found.aired,
        status: found.aired === target.aired ? "correct" : "incorrect",
        arrow: found.aired > target.aired ? "↓" : (found.aired < target.aired ? "↑" : "")
      },
      episodes: {
        value: found.episodes === 0 ? "En cours" : found.episodes,
        status: found.episodes === target.episodes ? "correct" : "incorrect",
        // On n'affiche la flèche que si les deux ont un nombre d'épisodes défini
        arrow: (found.episodes === 0 || target.episodes === 0) 
          ? "" 
          : (found.episodes > target.episodes ? "↓" : "↑")
      },
      genres: {
        value: found.genres.join(", "),
        status: checkArray(target.genres, found.genres)
      },
      studios: {
        value: found.studios.join(", "),
        status: checkArray(target.studios, found.studios)
      }
    };

    const entry = { ...found, hint };
    const newGuesses = [...guesses, entry];
    setGuesses(newGuesses);

    // Déblocage indices
    if (newGuesses.length >= 3) setImageUnlocked(true);
    if (newGuesses.length >= 5) setSynopsisUnlocked(true);

    if (found.name === target.name) {
      setGameWon(true);
      setShowImage(true);
      setShowSynopsis(true);
      setTimeout(() => setShowPopup(true), 500);
    }
  };

  const handleReplay = () => {
    setGuesses([]);
    setGameWon(false);
    setGameOver(false);
    setImageUnlocked(false);
    setSynopsisUnlocked(false);
    setShowImage(false);
    setShowSynopsis(false);
    setShowPopup(false);
    setTarget(animeList[Math.floor(Math.random() * animeList.length)]);
  };

  const handleGiveUp = () => {
    setGameOver(true);
    setShowImage(true);
    setShowSynopsis(true);
    setShowPopup(true);
  };

  if (loading) return <div className="loading">Chargement de la base de données...</div>;

  return (
    <div className="app">
      <div className="header">
        <div className="title">
          <div className="logo">AN</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Animely</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Devine l'animé</div>
          </div>
        </div>
        <div className="controls">
          <button className="ghost" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "Clair" : "Sombre"}
          </button>
          <button className="ghost" onClick={handleGiveUp} disabled={gameWon || gameOver}>Abandonner</button>
        </div>
      </div>

      <GuessInput onGuess={handleGuess} disabled={gameWon || gameOver} countries={animeList} guesses={guesses} />

      <div className="hintsRow">
        <div className={`hintBox ${imageUnlocked ? "unlocked" : ""}`} onClick={() => imageUnlocked && setShowImage(!showImage)}>
          {imageUnlocked ? "Affiche (Cliquer)" : "Image : 3 essais"}
        </div>
        <div className={`hintBox ${synopsisUnlocked ? "unlocked" : ""}`} onClick={() => synopsisUnlocked && setShowSynopsis(!showSynopsis)}>
          {synopsisUnlocked ? "Synopsis (Cliquer)" : "Synopsis : 5 essais"}
        </div>
      </div>

      {showSynopsis && (
        <div className="hintReveal">
          <div className="hintTitle">Synopsis</div>
          <div className="hintText">{target?.synopsis}</div>
        </div>
      )}

      {showImage && (
        <div className="hintReveal" style={{ textAlign: "center" }}>
          <img src={target?.image} alt="cover" style={{ borderRadius: 8, maxWidth: 200, filter: (gameWon || gameOver) ? "none" : "blur(5px)" }} />
        </div>
      )}

      {showPopup && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>{gameWon ? "🎉 Bravo !" : "😢 Perdu"}</h2>
            <p>C'était <strong>{target?.name}</strong></p>
            <button className="primary" onClick={handleReplay}>Rejouer</button>
            <button className="ghost" onClick={() => setShowPopup(false)}>Fermer</button>
          </div>
        </div>
      )}

      <GuessListAnime guesses={guesses} />
    </div>
  );
}