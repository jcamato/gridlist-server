// paralell config
// where to check or store default values, here?
let filterConfig = {
  score: {
    tmdb_name: "vote_average",
    defaultValue: [0, 100],
    value: null,
  },
  release: {
    tmdb_name: "release_date",
    defaultValue: [1896, new Date().getFullYear() + 1],
    value: null,
  },
  genre: {
    tmdb_name: "genres",
    defaultValue: null,
    value: null,
  },
  runtime: {
    tmdb_name: "runtime",
    defaultValue: [0, 300],
    value: null,
  },
};

let sortNameConfig = {
  score: "vote_average",
  release: "release_date",
  popularity: "popularity",
  title: "original_title",
  revenue: "revenue",
};

let sortConfig = {
  sort: {
    defaultValue: "popularity",
    value: null,
    prepareValueForQuery: (value) => {
      if (!value) return null;
      else if (["popularity", "revenue"].indexOf(value) >= 0) return value;
      else return sortNameConfig[`${value}`.toLowerCase()];
    },
  },
  order: {
    defaultValue: "DESC",
    value: null,
  },
};

// URL
// http://localhost:5000/movies?sort=score&score=60..90&release=1980..2021&genre=action,adventure

// receive
let request = {
  sort: "score",
  score: "60..90",
  release: "1980..2021",
  genre: "action,adventure",
};

// format
let next = {
  sort: "score",
  score: [60, 90],
  release: ["1980-01-01", "2021-12-31"],
  genre: [28, 12],
};

// generate
const movies = await pool.query(
  [
    "SELECT *",
    "FROM tmdb_movie",
    "WHERE vote_average BETWEEN 60 AND 90",
    "AND release_date BETWEEN '2000-01-01' AND '2009-12-31'",
    "AND genre contains etc.",
    "ORDER BY vote_average DESC, vote_count DESC",
    "LIMIT 20",
  ].join(" ")
  // , [id]
);
