import React from "react";

export default function GuessCard({ guess }) {
  if (!guess) return null;

  const { name, continent, population, area, borders, hint } = guess;

  const roundedPop = Math.round((population || 0) / 1_000_000);

  const boxClass = (isCorrect) => isCorrect ? "box green" : "box red";

  return (
    <div className="guessRow" style={{alignItems:"stretch"}}>
      {/* Nom */}
      <div className={hint?.name?.correct ? "box green" : "box red"} style={{flex:"0 0 22%"}}>
        <div style={{fontSize:12,color:"var(--muted)"}}>Nom</div>
        <div style={{marginTop:6,fontWeight:600}}>{name}</div>
      </div>

      {/* Continent */}
      <div className={hint?.continent?.correct ? "box green" : "box red"} style={{flex:"0 0 22%"}}>
        <div style={{fontSize:12,color:"var(--muted)"}}>Continent</div>
        <div style={{marginTop:6,fontWeight:600}}>{continent}</div>
      </div>

      {/* Population */}
      <div className={hint?.population?.equal || hint?.population?.sameMillion ? "box green" : "box neutral"} style={{flex:"0 0 18%"}}>
        <div style={{fontSize:12,color:"var(--muted)"}}>Population</div>
        <div style={{marginTop:6,fontWeight:600}}>{roundedPop} M</div>
        <div style={{marginTop:6,color:"var(--muted)"}}>{hint?.population?.arrow}</div>
      </div>

      {/* Superficie */}
      <div className={hint?.area?.equal ? "box green" : "box neutral"} style={{flex:"0 0 18%"}}>
        <div style={{fontSize:12,color:"var(--muted)"}}>Superficie</div>
        <div style={{marginTop:6,fontWeight:600}}>{(area || 0).toLocaleString()} km²</div>
        <div style={{marginTop:6,color:"var(--muted)"}}>{hint?.area?.arrow}</div>
      </div>

      {/* Frontières */}
      <div className={hint?.borders?.equal ? "box green" : "box neutral"} style={{flex:"0 0 18%"}}>
        <div style={{fontSize:12,color:"var(--muted)"}}>Frontières</div>
        <div style={{marginTop:6,fontWeight:600}}>{borders ?? 0}</div>
        <div style={{marginTop:6,color:"var(--muted)"}}>{hint?.borders?.arrow}</div>
      </div>
    </div>
  );
}
