import React from "react";

export default function GuessCardAnime({ guess }) {
  if (!guess) return null;

  const { name, year, episodes, genre, hint } = guess;

  return (
    <div className="guessRow" style={{alignItems:"stretch"}}>

      {/* Nom */}
      <div className={hint?.name?.correct ? "box green" : "box red"} style={{flex:"0 0 22%"}}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Nom</div>
        <div style={{marginTop:6,fontWeight:600}}>{name}</div>
      </div>

      {/* Année */}
      <div className={hint?.year?.equal ? "box green" : "box neutral"} style={{flex:"0 0 17%"}}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Année</div>
        <div style={{marginTop:6,fontWeight:600}}>{year}</div>
        <div>{hint?.year?.arrow}</div>
      </div>

      {/* Episodes */}
      <div className={hint?.episodes?.equal ? "box green" : hint?.episodes?.arrow === "?" ? "box neutral" : "box red"} style={{flex:"0 0 17%"}}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Épisodes</div>
        <strong>{episodes === null ? "En cours" : episodes}</strong>
        <div>{hint?.episodes?.arrow}</div>
      </div>

      {/* Genre */}
      <div className={hint?.genre?.correct ? "box green" : "box red"} style={{flex:"0 0 20%"}}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>Genre</div>
        <strong>{genre}</strong>
      </div>

      {/* Popularité */}
    <div className={hint.popularity.equal ? "box green" : "box neutral"} style={{flex:"0 0 17%"}}>
    <div style={{ fontSize: 12, color: "var(--muted)" }}>Nombre de vues/popularité</div>
    <div style={{ marginTop: 6, fontWeight: 600 }}>
        {hint.popularity.value} / 10
    </div>
    <div style={{ marginTop: 6, color: "var(--muted)" }}>{hint.popularity.arrow}</div>
    </div>


    </div>
  );
}
