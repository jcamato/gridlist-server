const pool = require("../db");
const fetch = require("node-fetch");

// This middleware will check local storage for the existence of a movie and its related tables (videos, images, credits)
// If this movie does not exist in any of the 4 tables, it will fetch the data from TMDB and store this locally for access
// FIX: This middleware isn't needed anymore since browse and movies are always from database. However, this middleware can be updated the refresh movie data? account for scheduled updates and overwrites that will be done elsewhere

module.exports = async function (req, res, next) {
  try {
    // These will be supplied with either req.params or req.body based on movie details request or library addition
    // update node for nullish operator
    // const id = req.params.id ?? req.body.tmdb_movie_id;
    const id = req.params.id ? req.params.id : req.body.tmdb_movie_id;

    // console.log(req.params);
    // console.log(req.params.id);

    // console.log(req.body);
    // console.log(req.body.id);

    const stored_movie_appended = await pool.query(
      "SELECT m.id, m.title FROM tmdb_movie AS m INNER JOIN tmdb_movie_videos AS v ON m.id = v.id INNER JOIN tmdb_movie_images AS i ON m.id = i.id INNER JOIN tmdb_movie_credits AS c ON m.id = c.id INNER JOIN tmdb_movie_keywords AS k ON m.id = k.id WHERE m.id = $1",
      [id]
    );

    // console.log("appended movie length: " + stored_movie_appended.rows.length);

    if (stored_movie_appended.rows.length > 0) {
      console.log("All movie tables are stored.");

      // if i want this middleware to also return the stored movie, i can use the following

      // append objects to movie like TMDb response
      // stored_movie.rows[0].videos = stored_videos.rows[0];
      // stored_movie.rows[0].images = stored_images.rows[0];
      // stored_movie.rows[0].credits = stored_credits.rows[0];

      // res.locals.movieDidExist = true;
      // res.locals.stored_movie_appended = stored_movie_appended;
    } else {
      // res.locals.movieDidExist = false;
      // if it isn't, fetch, send response, and store movie in database as well as videos, images, and credits
      const APP_KEY = process.env.TMDB_KEY;

      const fetchMovieAndStore = async () => {
        console.log("Not all movie tables are stored, fetching...");
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${APP_KEY}&append_to_response=videos,images,credits,keywords`
        );
        const movie = await response.json();
        // res.json(movie);

        // console.log(movie.genres);
        // console.log(JSON.stringify(movie.genres));

        // FIX: add condition to store appended tables. Currently if id exists, associate tables do too. Might not always be that way.
        if (!movie.id) {
          throw new Error("Movie not found");
        }

        console.log("Storing fetched movie...");

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

        if (movie.videos.results) {
          const text_tmdb_movie_videos =
            "INSERT INTO tmdb_movie_videos(id, results) VALUES($1, $2) ON CONFLICT ON CONSTRAINT tmdb_movie_videos_pkey DO NOTHING RETURNING *";

          const values_tmdb_movie_videos = [
            movie.id,
            JSON.stringify(movie.videos.results),
          ];
          await pool.query(text_tmdb_movie_videos, values_tmdb_movie_videos);
        }

        if (movie.images.backdrops || movie.images.posters) {
          const text_tmdb_movie_images =
            "INSERT INTO tmdb_movie_images(id, backdrops, posters) VALUES($1, $2, $3) ON CONFLICT ON CONSTRAINT tmdb_movie_images_pkey DO NOTHING RETURNING *";
          const values_tmdb_movie_images = [
            movie.id,
            JSON.stringify(movie.images.backdrops),
            JSON.stringify(movie.images.posters),
          ];
          await pool.query(text_tmdb_movie_images, values_tmdb_movie_images);
        }

        if (movie.credits.cast || movie.credits.crew) {
          const text_tmdb_movie_credits =
            "INSERT INTO tmdb_movie_credits(id, cast_list, crew) VALUES($1, $2, $3) ON CONFLICT ON CONSTRAINT tmdb_movie_credits_pkey DO NOTHING RETURNING *";
          const values_tmdb_movie_credits = [
            movie.id,
            JSON.stringify(movie.credits.cast),
            JSON.stringify(movie.credits.crew),
          ];
          await pool.query(text_tmdb_movie_credits, values_tmdb_movie_credits);
        }

        if (movie.keywords.keywords) {
          const text_tmdb_movie_keywords =
            "INSERT INTO tmdb_movie_keywords(id, keywords) VALUES($1, $2) ON CONFLICT ON CONSTRAINT tmdb_movie_keywords_pkey DO NOTHING RETURNING *";

          const values_tmdb_movie_keywords = [
            movie.id,
            JSON.stringify(movie.keywords.keywords),
          ];
          await pool.query(
            text_tmdb_movie_keywords,
            values_tmdb_movie_keywords
          );
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
