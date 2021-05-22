const express = require("express");
const pool = require("../db");
const router = express.Router();

// PUBLIC ROUTE to get movies
router.get("/", async (req, res) => {
  try {
    // const {
    //   tmdb_movie_id,
    //   library_category_id,
    //   score,
    //   watch_date,
    //   watch_count,
    //   secret,
    // } = req.query;

    console.log(req.query);

    // parse and sanitize query before batching it up into query select statement

    // const stored_movies_appended = await pool.query(
    //   "SELECT m.*, c.cast_list, c.crew, k.keywords FROM tmdb_movie AS m INNER JOIN tmdb_movie_credits AS c ON m.id = c.id INNER JOIN tmdb_movie_keywords AS k ON m.id = k.id LIMIT 10"
    //   // [id]
    // );

    // const movies = await pool.query(
    //   "SELECT id, title, popularity, vote_average, vote_count FROM tmdb_movie WHERE vote_count > 200 ORDER BY vote_average DESC, vote_count DESC LIMIT 100"
    //   // [id]
    // );

    const movies = await pool.query(
      [
        "SELECT id, title, popularity, vote_average, vote_count, release_date, genres, runtime",
        "FROM tmdb_movie",
        "WHERE vote_count > 200",
        "AND release_date BETWEEN '2000-01-01' AND '2009-12-31'",
        "ORDER BY vote_average DESC, vote_count DESC",
        "LIMIT 100",
      ].join(" ")
      // , [id]
    );

    // res.json(stored_movies_appended.rows);
    res.json(movies.rows);
    console.log("Movies sent.");
    console.log(" ");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
