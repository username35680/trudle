import React from "react";

export default function GuessCard({ guess }) {
  if (!guess) return null;

  const { name, continent, population, area, borders, hint } = guess;

  // Population arrondie au million
  const roundedPop = Math.round(population / 1_000_000);

  const boxStyle = (isCorrect) => ({
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: 10,
    width: "18%",
    textAlign: "center",
    background: isCorrect ? "#c8f7c5" : "#f7c5c5"
  });

  const neutralBox = (isSameMillion = false) => ({
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: 10,
    width: "18%",
    textAlign: "center",
    background: isSameMillion ? "#c8f7c5" : "#f7c5c5"
  });

  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15,
  };

  return (
    <div style={containerStyle}>
      
      {/* Nom */}
      <div style={boxStyle(hint.name.correct)}>
        <strong>Nom</strong>
        <br />
        {name}
      </div>

      {/* Continent */}
      <div style={boxStyle(hint.continent.correct)}>
        <strong>Continent</strong>
        <br />
        {continent}
      </div>

      {/* Population arrondie */}
      <div style={neutralBox(hint.population.equal || hint.population.sameMillion)}>
        <strong>Population</strong>
        <br />
        {roundedPop} M
        <div>{hint.population.arrow}</div>
      </div>

      {/* Superficie */}
      <div style={neutralBox(hint.area.equal)}>
        <strong>Superficie</strong>
        <br />
        {area.toLocaleString()} km²
        <div>{hint.area.arrow}</div>
      </div>


      {/* Frontières */}
      <div style={neutralBox(hint.borders.equal)}>
        <strong>Frontières</strong>
        <br />
        {borders}
        <div>{hint.borders.arrow}</div>
      </div>

    </div>
  );
}
