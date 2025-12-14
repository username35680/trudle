export function getRandomCountry(countries) {
  if (!countries || countries.length === 0) return null;
  return countries[Math.floor(Math.random() * countries.length)];
}

export function getHints(target, guess) {
  if (!target || !guess) return {};

  const guessM = Math.round((guess.population || 0) / 1_000_000);
  const targetM = Math.round((target.population || 0) / 1_000_000);

  const populationArrow =
    guess.population > target.population ? "↓" :
    guess.population < target.population ? "↑" : "=";

  const areaArrow =
    guess.area > target.area ? "↓" :
    guess.area < target.area ? "↑" : "=";

  const bordersArrow =
    (guess.borders || 0) > (target.borders || 0) ? "↓" :
    (guess.borders || 0) < (target.borders || 0) ? "↑" : "=";

  return {
    name: { correct: guess.name === target.name },
    continent: { correct: guess.continent === target.continent },
    population: {
      sameMillion: guessM === targetM,
      equal: guess.population === target.population,
      arrow: populationArrow
    },
    area: {
      equal: guess.area === target.area,
      arrow: areaArrow
    },
    borders: {
      equal: (guess.borders || 0) === (target.borders || 0),
      arrow: bordersArrow
    }
  };
}


export function normalize(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // enlève accents
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ""); // seulement alphanumérique
}

export function getAnimeHints(target, guess) {
  const targetOngoing = target.episodes == null;
  const guessOngoing = guess.episodes == null;

  let episodesHint;

  // 🟢 les deux animés sont en cours
  if (targetOngoing && guessOngoing) {
    episodesHint = {
      equal: true,
      arrow: "=",
      ongoing: true
    };
  }
  // ❓ un seul des deux est en cours
  else if (targetOngoing || guessOngoing) {
    episodesHint = {
      equal: false,
      arrow: "?",
      ongoing: true
    };
  }
  // 🔢 comparaison normale
  else {
    episodesHint = {
      equal: guess.episodes === target.episodes,
      arrow:
        guess.episodes < target.episodes
          ? "↑"
          : guess.episodes > target.episodes
          ? "↓"
          : "=",
      ongoing: false
    };
  }

  return {
    name: { correct: guess.name === target.name },

    year: {
      equal: guess.year === target.year,
      arrow:
        guess.year < target.year
          ? "↑"
          : guess.year > target.year
          ? "↓"
          : "="
    },

    episodes: episodesHint,

    genre: { correct: guess.genre === target.genre },

    popularity: {
      equal: guess.popularity === target.popularity,
      arrow:
        guess.popularity < target.popularity
          ? "↑"
          : guess.popularity > target.popularity
          ? "↓"
          : "="
    }
  };
}


