const pool = require("../db");
const fetch = require("node-fetch");

const storeCredits = require("./storeCredits");

module.exports = async function (id) {
  try {
    const stored_movie_appended = await pool.query(
      [
        "SELECT distinct m.id, m.title",
        "FROM tmdb_movie AS m",
        "INNER JOIN tmdb_movie_genres AS g ON m.id = g.tmdb_movie_id",
        "INNER JOIN tmdb_movie_crew AS cw ON m.id = cw.tmdb_movie_id",
        // "INNER JOIN tmdb_movie_videos AS v ON m.id = v.id",
        // "INNER JOIN tmdb_movie_images AS i ON m.id = i.id",
        // "INNER JOIN tmdb_movie_keywords AS k ON m.id = k.id",
        "WHERE m.id = $1",
      ].join(" "),
      [id]
    );

    // console.log("appended movie length: " + stored_movie_appended.rows.length);

    if (stored_movie_appended.rows.length > 0) {
      console.log("Movie and all related tables are already stored... ", id);
    } else {
      const APP_KEY = process.env.TMDB_KEY;

      const fetchMovieAndStore = async () => {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${APP_KEY}`
        );
        const movie = await response.json();

        if (!movie.id) {
          throw new Error("Movie not found");
        }

        console.log(
          "Movie and all related tables are not already stored, fetching and storing...",
          movie.id,
          movie.title
        );

        // movie detail
        const text_tmdb_movie =
          "INSERT INTO tmdb_movie(adult, backdrop_path, belongs_to_collection, budget, genres, homepage, id, imdb_id, original_language, original_title, overview, popularity, poster_path, production_companies, production_countries, release_date, revenue, runtime, spoken_languages, status, tagline, title, video, vote_average, vote_count) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) ON CONFLICT ON CONSTRAINT tmdb_movie_pkey DO NOTHING RETURNING *";

        const values_tmdb_movie = [
          movie.adult,
          movie.backdrop_path,
          JSON.stringify(movie.belongs_to_collection),
          movie.budget,
          JSON.stringify(movie.genres),
          movie.homepage,
          movie.id,
          movie.imdb_id,
          movie.original_language,
          movie.original_title,
          movie.overview,
          movie.popularity,
          movie.poster_path,
          JSON.stringify(movie.production_companies),
          JSON.stringify(movie.production_countries),
          movie.release_date,
          movie.revenue,
          movie.runtime,
          JSON.stringify(movie.spoken_languages),
          movie.status,
          movie.tagline,
          movie.title,
          movie.video,
          movie.vote_average,
          movie.vote_count,
        ];
        await pool.query(text_tmdb_movie, values_tmdb_movie);

        // console.log(movie.genres);

        // genres
        if (movie.genres.length > 0) {
          for (let i = 0; i < movie.genres.length; i++) {
            const text_tmdb_movie_genres =
              "INSERT INTO tmdb_movie_genres(id, tmdb_movie_id, tmdb_movie_genre_id) VALUES($1, $2, $3) ON CONFLICT ON CONSTRAINT tmdb_movie_genres_pkey DO NOTHING RETURNING *";
            const values_tmdb_movie_genres = [
              [movie.id, movie.genres[i].id].join("-"),
              movie.id,
              movie.genres[i].id,
            ];

            await pool.query(text_tmdb_movie_genres, values_tmdb_movie_genres);
          }
        }

        // credits
        await storeCredits(id);

        // console.log("Stored.");
      };
      await fetchMovieAndStore();
      // If i have the middleware setup to store movie before returning, then i can restructure how the data is returned if i want to.
      // Right now it's mimicking TMDb's append to response format
    }
    return;
  } catch (err) {
    console.error(err.message);
    // res.status(500).send("Server error");
  }
};
