import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // Assure-toi que le chemin est correct
import ChronoBoard from "../component/ChronoBoard";

export default function AppChronoMix() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  // Charger le thème
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Lancer le jeu au démarrage
  useEffect(() => {
    fetchRandomEvents();
  }, []);

  const fetchRandomEvents = async () => {
    setLoading(true);
    try {
      // On appelle la fonction SQL créée à l'étape 1
      const { data, error } = await supabase.rpc('get_random_events', { sample_size: 5 });

      if (error) throw error;
  
    const months = ["", "Janv.", "Févr.", "Mars", "Avril", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];

    // Dans fetchRandomEvents, modifie le mapping :
    const mapped = data.map(e => ({
      id: e.id,
      title: e.event, 
      // On crée une chaîne lisible pour l'affichage sous les slots
      dateLabel: `${e.day} ${months[parseInt(e.month)]} ${e.year}`,
      // On garde les valeurs brutes pour un tri précis (Année > Mois > Jour)
      val: parseInt(e.year) * 10000 + parseInt(e.month) * 100 + parseInt(e.day),
      position: null,
      status: null
    }));

      setEvents(mapped);
      setGameWon(false);
      setShowPopup(false);
    } catch (err) {
      console.error("Erreur Supabase:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkOrder = () => {
    const placed = events.filter(e => e.position !== null);

    if (placed.length !== 5) {
      alert("Place toutes les cartes avant de valider !");
      return;
    }

    // 1. On crée l'ordre de référence (trié par la valeur chronologique 'val')
    const correctOrder = [...events].sort((a, b) => a.val - b.val);

    // 2. On met à jour chaque carte
    const newEvents = events.map(e => {
      // On trouve à quel index (0 à 4) cette carte DEVRAIT être
      const correctIdx = correctOrder.findIndex(c => c.id === e.id);
      
      // Une carte est "correct" si sa position actuelle est égale à son index trié
      const isCorrect = e.position === correctIdx;

      return {
        ...e,
        status: isCorrect ? "correct" : "wrong",
        // On force le déplacement à la bonne place pour montrer la solution
        position: correctIdx 
      };
    });

    setEvents(newEvents);
    
    // Le jeu est gagné si TOUTES les cartes étaient bien placées avant le repositionnement
    const totalCorrect = events.filter(e => {
      const correctIdx = correctOrder.findIndex(c => c.id === e.id);
      return e.position === correctIdx;
    }).length;

    setGameWon(totalCorrect === 5);
    setShowPopup(true);
  };

  if (loading) return <div className="loader">Chargement des événements historiques...</div>;

  return (
    <div className="app">
      <div className="header">
        <div className="title">
          <div className="logo">CH</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Chronoly</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              Remets les événements dans l’ordre chronologique
            </div>
          </div>
        </div>
        <div className="controls">
          <button
            className="ghost"
            onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Clair" : "Sombre"}
          </button>
        </div>
      </div>

      <ChronoBoard items={events} setItems={setEvents} />
      
      <button className="primary" onClick={checkOrder} style={{ marginTop: 20 }}>
        Valider
      </button>

      {showPopup && (
        <div className="modalOverlay">
          <div className="modal">
            <h2 style={{ marginTop: 0 }}>{gameWon ? "🎉 Bravo !" : "❌ Perdu"}</h2>
            <p>{gameWon ? "Parfait ! Ton sens de l'histoire est aiguisé." : "Certains événements sont mal placés."}</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
              <button className="primary" onClick={fetchRandomEvents}>Rejouer</button>
              <button className="ghost" onClick={() => setShowPopup(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}