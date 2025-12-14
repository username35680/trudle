import React, { useEffect, useState } from "react";
import GuessInput from "../component/GuessInput";
import GuessListAnime from "../component/GuessListAnime";
import { getAnimeHints, normalize } from "../utils/gameUtils";


export default function AppAnime() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [showImage, setShowImage] = useState(false);
  const [synopsisUnlocked, setSynopsisUnlocked] = useState(false);
  const [imageUnlocked, setImageUnlocked] = useState(false);
  const [showSynopsis, setShowSynopsis] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const ANIME_CACHE_KEY = "animeList_v1";

  const handleGiveUp = () => {
    if (!target) return;

    setGameOver(true);
    setShowImage(true);
    setShowSynopsis(true);
    setShowPopup(true);
  };


  const handleReplay = () => {
    // reset du jeu
    setGuesses([]);
    setGameWon(false);
    setSynopsisUnlocked(false);
    setImageUnlocked(false);
    setShowImage(false);
    setShowSynopsis(false);
    setShowPopup(false);

    // choisir un nouvel anime aléatoire
    setTarget(animeList[Math.floor(Math.random() * animeList.length)]);
  };

  useEffect(() => {
    document.documentElement.setAttribute(
        "data-theme",
        theme === "dark" ? "dark" : "light"
    );
    localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
      async function load() {
        setLoading(true);

        // 🔥 1️⃣ Vérifie le cache
        const cached = localStorage.getItem(ANIME_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          console.log("Animés chargés depuis le cache :", parsed.length);

          setAnimeList(parsed);
          setTarget(parsed[Math.floor(Math.random() * parsed.length)]);
          setLoading(false);
          return;
        }

        // 🔄 2️⃣ Sinon → fetch API
        let allAnime = [];
        let page = 1;
        const perPage = 50;
        const maxPages = 4;

        while (page <= maxPages) {
          const query = `
            query ($page: Int, $perPage: Int) {
              Page(page: $page, perPage: $perPage) {
                media(type: ANIME, sort: POPULARITY_DESC) {
                  title { romaji english native }
                  description
                  episodes
                  genres
                  startDate { year }
                  coverImage { medium }
                  popularity
                }
              }
            }
          `;

          const response = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query,
              variables: { page, perPage }
            })
          });

          const json = await response.json();

          const pageData = json.data.Page.media.map(a => ({
            name: a.title.english || a.title.romaji || a.title.native,
            year: a.startDate.year || 0,
            episodes: a.episodes ?? null,
            genre: a.genres?.[0] || "Inconnu",
            image: a.coverImage.medium,
            popularity: a.popularity || 0,
            synopsis: cleanSynopsis(a.description)
          }));

          allAnime = [...allAnime, ...pageData];
          page++;
        }

        console.log("Animés chargés depuis l’API :", allAnime.length);

        // 💾 3️⃣ Sauvegarde en cache
        localStorage.setItem(ANIME_CACHE_KEY, JSON.stringify(allAnime));

        setAnimeList(allAnime);
        setTarget(allAnime[Math.floor(Math.random() * allAnime.length)]);
        setLoading(false);
      }

      load();
    }, []);



const handleGuess = (name) => {
  if (gameWon || gameOver || !target) return;

  const normalized = normalize(name);
  const found = animeList.find(a => normalize(a.name) === normalized);
  if (!found) {
    alert("Animé non trouvé !");
    return;
  }

  // 🔹 Popularité
  const maxPopularity = Math.max(...animeList.map(a => a.popularity));
  const scalePopularity = anime => Math.ceil((anime.popularity / maxPopularity) * 10);
  const targetPopularity = scalePopularity(target);
  const foundPopularity = scalePopularity(found);

  const popularityHint = {
    value: foundPopularity,
    equal: foundPopularity === targetPopularity,
    arrow: foundPopularity > targetPopularity ? "↓" : (foundPopularity < targetPopularity ? "↑" : "=")
  };

  // 🔹 Autres hints
  const hint = {
    ...getAnimeHints(target, found),
    popularity: popularityHint
  };

  const entry = { ...found, hint };

  setGuesses(prev => {
    const next = [...prev, entry];
    if (next.length >= 5) setSynopsisUnlocked(true);
    if (next.length >= 3) setImageUnlocked(true);
    return next;
  });

  if (found.name === target.name) {
    setGameWon(true);
    setShowPopup(true);
  }
};

function cleanSynopsis(text = "") {
  const noHtml = text.replace(/<[^>]+>/g, "");
  return noHtml.length > 220
    ? noHtml.slice(0, 220) + "…"
    : noHtml;
}



  if (loading) return <div>Chargement des animés...</div>;

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
            <button
            className="ghost"
            onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
            >
            {theme === "dark" ? "Clair" : "Sombre"}
            </button>
            <button
            className="ghost"
            onClick={handleGiveUp}
            disabled={gameWon || gameOver}
          >
            Abandonner
          </button>
        </div>

        </div>
    
      <GuessInput
        onGuess={handleGuess}
        disabled={gameWon}
        countries={animeList}
        guesses={guesses} // autocomplete OK
      />
      <div className="hintsRow">
        {/* Indice image */}
        <div
          className={`hintBox ${imageUnlocked ? "unlocked" : ""}`}
          onClick={() => imageUnlocked && setShowImage(s => !s)}
        >
          {imageUnlocked
            ? "Indice : image (cliquer)"
            : "Indice image — 3 essais"}
        </div>
        {/* Indice synopsis */}
        <div
          className={`hintBox ${synopsisUnlocked ? "unlocked" : ""}`}
          onClick={() => synopsisUnlocked && setShowSynopsis(s => !s)}
        >
          {synopsisUnlocked
            ? "Indice : synopsis (cliquer)"
            : "Indice synopsis — 5 essais"}
        </div>
      </div>
      {showSynopsis && target?.synopsis && (
        <div className="hintReveal">
          <div className="hintTitle">Synopsis</div>
          <div className="hintText">{target.synopsis}</div>
        </div>
      )}

      {showImage && target?.image && (
        <div className="hintReveal">
          <div className="hintTitle">Affiche de l’animé</div>
          <img
            src={target.image}
            alt="anime cover"
            style={{ borderRadius: 8, maxWidth: 220, filter: (gameWon || gameOver) ? "none" : "blur(4px)",}}
          />
        </div>
      )}

      {showPopup && (
        <div className="modalOverlay">
          <div className="modal">
            <h2 style={{ marginTop: 0 }}>
              {gameWon ? "🎉 Bravo !" : "😢 Partie abandonnée"}
            </h2>
            <p>Le anime était <strong>{target?.name}</strong>.</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
              <button className="primary" onClick={handleReplay}>Rejouer</button>
              <button className="ghost" onClick={() => setShowPopup(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
  
      <GuessListAnime guesses={guesses} />
    </div>
  );
}
