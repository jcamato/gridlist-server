const express = require("express");
const pool = require("../db");
const router = express.Router();

// PUBLIC ROUTE to get movies
router.get("/", async (req, res) => {
  try {
    // const { id } = req.params;

    // const stored_movies_appended = await pool.query(
    //   "SELECT m.*, c.cast_list, c.crew, k.keywords FROM tmdb_movie AS m INNER JOIN tmdb_movie_credits AS c ON m.id = c.id INNER JOIN tmdb_movie_keywords AS k ON m.id = k.id LIMIT 10"
    //   // [id]
    // );

    const stored_movies = await pool.query(
      "SELECT m.id, m.title, m.popularity, m.vote_average, m.vote_count FROM tmdb_movie as m WHERE vote_count > 200 ORDER BY vote_average DESC, vote_count DESC LIMIT 100"
      // [id]
    );

    // res.json(stored_movies_appended.rows);
    res.json(stored_movies.rows);
    console.log("Movies sent.");
    console.log(" ");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
