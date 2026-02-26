import React, { useEffect, useState } from "react";
import "../index.css";
import GuessInput from "../component/GuessInput";
import GuessList from "../component/GuessList";
import HelpModal from "../component/HelpModal";
import { getRandomCountry, getHints, normalize } from "../utils/gameUtils";
import { supabase } from "../supabaseClient";

function App() {
  const [countries, setCountries] = useState([]);
  const [target, setTarget] = useState(null); // pays cible pour cette partie (random au refresh)
  const [guesses, setGuesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hintUnlocked, setHintUnlocked] = useState(false);
  const [showFlag, setShowFlag] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("pays") // nom de ta table
      .select("*")
      .then(({ data, error }) => {
        if (error) {
          console.error("Supabase fetch error", error);
          setLoading(false);
          return;
        }
        // map pour garder le même format que précédemment
        const mapped = (data || []).map(c => ({
          name: c.Name,            // colonne 'nom' dans ta table
          continent: c.Continent || "Unknown",
          population: c.Population || 0,
          area: c.Area || 0,
          borders: c.Borders,
          flag: c.Flag || null
        }));

        setCountries(mapped);
        setTarget(getRandomCountry(mapped));
        setLoading(false);
      });
  }, []);

  const handleGuess = (guessName) => {
    if (gameWon) return;
    const normalizedInput = normalize(guessName);

    // déjà tenté ?
    const already = guesses.some(g => normalize(g.name) === normalizedInput);
    if (already) {
      alert("Tu as déjà essayé ce pays !");
      return;
    }

    // trouver le pays dans la base
    const found = countries.find(c => normalize(c.name) === normalizedInput);
    if (!found) {
      alert("Pays non trouvé !");
      return;
    }

    // calcul hints
    const hint = getHints(target, found);
    const entry = { ...found, hint };

    setGuesses(prev => {
      const next = [...prev, entry];

      // si on atteint 5 essais, débloque l'indice
      if (next.length >= 5) {
        setHintUnlocked(true);
      }

      return next;
    });

    if (found.name === target.name) {
      setGameWon(true);
      // montre popup après un tout petit délai pour que l'UI se mette à jour
      setTimeout(() => setShowPopup(true), 220);
    }
  };

  const handleRevealFlag = () => {
    if (!hintUnlocked) return;
    setShowFlag(true);
  };

  const handleReplay = () => {
    // reset local state, choisir un nouveau pays aléatoire
    setGuesses([]);
    setHintUnlocked(false);
    setShowFlag(false);
    setGameWon(false);
    setShowPopup(false);
    setTarget(getRandomCountry(countries));
  };

  if (loading) return <div style={{textAlign:"center",marginTop:60}}>Chargement des pays...</div>;

  return (
    <div className="app">
      <div className="header">
        <div className="title">
          <div className="logo">CL</div>
          <div>
            <div style={{fontSize:18,fontWeight:700}}>Countryle</div>
            <div style={{fontSize:12,color:"var(--muted)"}}>Devine le pays</div>
          </div>
        </div>

        <div className="controls">
          <button className="ghost" onClick={() => setShowHelp(true)}>Aide</button>
          <button
            className="ghost"
            onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "Clair" : "Sombre"}
          </button>
        </div>
      </div>

      <GuessInput
        onGuess={handleGuess}
        disabled={gameWon}
        countries={countries}
        guesses={guesses} // nécessaire pour l'autocomplete
      />

      {/* hint box */}
      <div
        className={`hintBox ${hintUnlocked ? "unlocked" : ""}`}
        onClick={() => hintUnlocked && handleRevealFlag()}
        title={hintUnlocked ? "Clique pour révéler l'indice (drapeau)" : "Indice verrouillé — fais 5 essais"}
      >
        {hintUnlocked ? "Clique pour révéler l'indice (drapeau)" : "Indice verrouillé — fais 5 essais"}
      </div>

      {showFlag && target?.flag && (
        <div className="flagWrap">
          <div style={{fontSize:13,color:"var(--muted)",marginBottom:8}}>Indice : drapeau</div>
          <img src={target.flag} alt="flag"style={{
            filter: hintUnlocked ? "blur(10px)" : "none"
          }} />
        </div>
      )}

      <GuessList guesses={guesses} />

      {/* Popup victoire */}
      {showPopup && (
        <div className="modalOverlay">
          <div className="modal">
            <h2 style={{marginTop:0}}>🎉 Bravo !</h2>
            <p>Le pays était <strong>{target?.name}</strong>.</p>
            <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:12}}>
              <button className="primary" onClick={handleReplay}>Rejouer</button>
              <button className="ghost" onClick={() => setShowPopup(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Help modal */}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

    </div>
  );
}

export default App;
