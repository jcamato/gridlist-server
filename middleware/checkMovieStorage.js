// This middleware will check local storage for the existence of a movie and its related tables (videos, images, credits)
// If this movie does not exist in all 4 tables, it will fetch the data from TMDB and store this locally for access
const pool = require("../db");
const fetch = require("node-fetch");

// FIX: Clean this middleware up to handle the checking, storing, and proceeding with respect to the routes that will call it.
// It's sloppy at the moment
// At the moment, this middleware should only add a resource to the database because it will be used with add library item also
// Need to figure out how the discover/filter area should function with adding movies. At the moment, the library filters will need
// different routes because those will all be from database always
// In order for the discovery page to be as inclusive as possible, I don't know if it should ever not be fetched

module.exports = async function (req, res, next) {
  try {
    // const { id } = req.params ?? req.body;
    const id = req.params.id ?? req.body.tmdb_id;

    console.log(req.params);
    console.log(req.params.id);

    console.log(req.body);
    console.log(req.body.id);

    const stored_movie = await pool.query(
      "SELECT * FROM tmdb_movie WHERE id = $1",
      [id]
    );

    const stored_videos = await pool.query(
      "SELECT * FROM tmdb_movie_videos WHERE id = $1",
      [id]
    );

    const stored_images = await pool.query(
      "SELECT * FROM tmdb_movie_images WHERE id = $1",
      [id]
    );

    const stored_credits = await pool.query(
      "SELECT * FROM tmdb_movie_credits WHERE id = $1",
      [id]
    );

    if (
      stored_movie.rows.length > 0 &&
      stored_videos.rows.length > 0 &&
      stored_images.rows.length > 0 &&
      stored_credits.rows.length > 0
    ) {
      console.log("All Movie tables are stored.");
      // if i want this middleware to also return the stored movie, i can use the following

      // append objects to movie like TMDb response
      // stored_movie.rows[0].videos = stored_videos.rows[0];
      // stored_movie.rows[0].images = stored_images.rows[0];
      // stored_movie.rows[0].credits = stored_credits.rows[0];

      // res.locals.movieDidExist = true;
      // res.locals.stored_movie = stored_movie;
    } else {
      // res.locals.movieDidExist = false;
      // if it isn't, fetch, send response, and store movie in database as well as videos, images, and credits
      const APP_KEY = process.env.TMDB_KEY;

      const fetchMovieAndStore = async () => {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${APP_KEY}&append_to_response=videos,images,credits`
        );
        const movie = await response.json();
        // res.json(movie);
        console.log("All Movie tables are not stored, fetching ...");

        // console.log(movie.genres);
        // console.log(JSON.stringify(movie.genres));

        if (!movie.id) {
          throw new Error("Movie not found");
        }

        console.log("Storing fetched movie...");

        const text_tmdb_movie =
          "INSERT INTO tmdb_movie(adult, backdrop_path, belongs_to_collection, budget, genres, homepage, id, imdb_id, original_language, original_title, overview, popularity, poster_path, production_companies, production_countries, release_date, revenue, runtime, spoken_languages, status, tagline, title, video, vote_average, vote_count) " +
          "VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) ON CONFLICT ON CONSTRAINT tmdb_movie_pkey DO NOTHING RETURNING *";
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

        if (movie.videos.results) {
          const text_tmdb_movie_videos =
            "INSERT INTO tmdb_movie_videos(id, results) " +
            "VALUES($1, $2) ON CONFLICT ON CONSTRAINT tmdb_movie_videos_pkey DO NOTHING RETURNING *";

          const values_tmdb_movie_videos = [
            movie.id,
            JSON.stringify(movie.videos.results),
          ];
          await pool.query(text_tmdb_movie_videos, values_tmdb_movie_videos);
        }

        if (movie.images.backdrops || movie.images.posters) {
          const text_tmdb_movie_images =
            "INSERT INTO tmdb_movie_images(id, backdrops, posters) " +
            "VALUES($1, $2, $3) ON CONFLICT ON CONSTRAINT tmdb_movie_images_pkey DO NOTHING RETURNING *";
          const values_tmdb_movie_images = [
            movie.id,
            JSON.stringify(movie.images.backdrops),
            JSON.stringify(movie.images.posters),
          ];
          await pool.query(text_tmdb_movie_images, values_tmdb_movie_images);
        }

        if (movie.credits.cast || movie.credits.crew) {
          const text_tmdb_movie_credits =
            "INSERT INTO tmdb_movie_credits(id, cast_list, crew) " +
            "VALUES($1, $2, $3) ON CONFLICT ON CONSTRAINT tmdb_movie_credits_pkey DO NOTHING RETURNING *";
          const values_tmdb_movie_credits = [
            movie.id,
            JSON.stringify(movie.credits.cast),
            JSON.stringify(movie.credits.crew),
          ];
          await pool.query(text_tmdb_movie_credits, values_tmdb_movie_credits);
        }

        console.log("Stored.");
      };
      await fetchMovieAndStore();
      // If i have the middleware setup to store movie before returning, then i can restructure how the data is returned if i want to.
      // Right now it's mimicking TMDb's append to response format
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
