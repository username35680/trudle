export function getRandomCountry(countries) {
  return countries[Math.floor(Math.random() * countries.length)];
}


export function getHints(target, guess) {
  const guessM = Math.round(guess.population / 1_000_000);
  const targetM = Math.round(target.population / 1_000_000);

  return {
    name: { correct: guess.name === target.name },

    continent: { correct: guess.continent === target.continent },

    population: {
      sameMillion: guessM === targetM,
      equal: guess.population === target.population,
      arrow:
        guess.population > target.population ? "↓" :
        guess.population < target.population ? "↑" : "="
    },

    area: {
      equal: guess.area === target.area,
      arrow:
        guess.area > target.area ? "↓" :
        guess.area < target.area ? "↑" : "="
    },

    borders: {
      equal: guess.borders === target.borders,
      arrow:
        guess.borders > target.borders ? "↓" :
        guess.borders < target.borders ? "↑" : "="
    }
  };
}


export function normalize(str) {
  return str
    .normalize("NFD")                   // enlève les accents
    .replace(/[\u0300-\u036f]/g, "")   // retire diacritiques
    .toLowerCase()
    .replace(/[^a-z]/g, "");           // supprime tout sauf lettres
}
