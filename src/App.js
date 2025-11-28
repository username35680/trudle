import React, { useEffect, useState } from "react";
import GuessInput from "./component/GuessInput";
import GuessList from "./component/GuessList";
import { getRandomCountry, getHints, normalize} from "./utils/gameUtils";

function App() {
  const [countries, setCountries] = useState([]);
  const [dailyCountry, setDailyCountry] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hintUnlocked, setHintUnlocked] = useState(false);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,translations,region,population,area,flags,borders")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((c) => ({
          name: c.translations?.fra?.common || c.name.common,
          englishName: c.name.common,
          continent: c.region,
          population: c.population,
          area: c.area,
          flag: c.flags?.png,
          borders: c.borders ? c.borders.length : 0   // 👉 nombre de frontières
        }));


        setCountries(mapped);
        setDailyCountry(getRandomCountry(mapped));
        setLoading(false);
      });
  }, []);

  const handleGuess = (guessName) => {
    const normalizedInput = normalize(guessName);

    // Vérifier si déjà tenté
    const alreadyTried = guesses.some(
      (g) => normalize(g.name) === normalizedInput
    );

    if (alreadyTried) {
      alert("Tu as déjà essayé ce pays !");
      return;
    }

    // Recherche du pays
    const guess = countries.find(
      (c) => normalize(c.name) === normalizedInput
    );

    if (!guess) {
      alert("Pays non trouvé !");
      return;
    }

    const hint = getHints(dailyCountry, guess);
    setGuesses((prev) => [...prev, { ...guess, hint }]);

    if (guesses.length + 1 >= 5) {
      setHintUnlocked(true);
    }
  };



  if (loading) return <div>Chargement des pays...</div>;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1>Countryle 🌍</h1>

      <GuessInput onGuess={handleGuess} />

      {/* ---- Case indice ---- */}
      <div
        onClick={() => hintUnlocked && alert("Indice : voir drapeau en dessous")}
        style={{
          background: "#ddd",
          padding: 15,
          borderRadius: 8,
          textAlign: "center",
          marginBottom: 20,
          cursor: hintUnlocked ? "pointer" : "not-allowed",
          opacity: hintUnlocked ? 1 : 0.6
        }}
      >
        {hintUnlocked
          ? "Clique pour révéler l'indice !"
          : "Indice verrouillé – fais 5 essais"}
      </div>

      {/* ---- Drapeau après clic ---- */}
      {hintUnlocked && (
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h3>Indice : Drapeau du pays recherché</h3>
          <img
            src={dailyCountry.flag}
            alt="flag"
            style={{ width: 150, borderRadius: 8 }}
          />
        </div>
      )}

      <GuessList guesses={guesses} />

      {guesses.some(g => g.name === dailyCountry.name) && (
        <h2>🎉 Bravo ! Le pays était {dailyCountry.name}</h2>
      )}
    </div>
  );
}

export default App;
