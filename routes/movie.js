const express = require("express");
const pool = require("../db");
const router = express.Router();
const checkMovieStorage = require("../middleware/checkMovieStorage");

// individual movie returns details, videos, images, credits, keywords. If these aren't already stored, it stores this in the 5 respective tables
// FIX: make the URL the movie title with special chars removed, hyphens instead of spaces, and year appended. this might be done in the client?

// PUBLIC ROUTE to get a movie
router.get("/:id", checkMovieStorage, async (req, res) => {
  try {
    const { id } = req.params;

    const stored_movie_appended = await pool.query(
      "SELECT m.*, v.results, i.backdrops, i.posters, c.cast_list, c.crew, k.keywords FROM tmdb_movie AS m INNER JOIN tmdb_movie_videos AS v ON m.id = v.id INNER JOIN tmdb_movie_images AS i ON m.id = i.id INNER JOIN tmdb_movie_credits AS c ON m.id = c.id INNER JOIN tmdb_movie_keywords AS k ON m.id = k.id WHERE m.id = $1",
      [id]
    );

    res.json(stored_movie_appended.rows[0]);
    console.log("Movie sent.");
    console.log(" ");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// New PUBLIC ROUTE to get a movie
// router.get("/:idstring", async (req, res) => {
//   try {
//     const { idstring } = req.params;

//     const idstringSplit = idstring.split("-");
//     const lastSplit = idstringsplit.slice(-1)[0];

//     const stored_movie_appended = await pool.query(
//       "SELECT m.*, v.results, i.backdrops, i.posters, c.cast_list, c.crew, k.keywords FROM tmdb_movie AS m INNER JOIN tmdb_movie_videos AS v ON m.id = v.id INNER JOIN tmdb_movie_images AS i ON m.id = i.id INNER JOIN tmdb_movie_credits AS c ON m.id = c.id INNER JOIN tmdb_movie_keywords AS k ON m.id = k.id WHERE m.id = $1",
//       [id]
//     );

//     res.json(stored_movie_appended.rows[0]);
//     console.log("Movie sent.");
//     console.log(" ");
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

module.exports = router;
