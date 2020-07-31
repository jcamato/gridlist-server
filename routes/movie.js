const express = require("express");
const pool = require("../db");
const router = express.Router();
const checkMovieStorage = require("../middleware/checkMovieStorage");

// individual movie returns details, videos, images, credits. If these aren't already stored, it stores this in the 4 respective tables
router.get("/:id", checkMovieStorage, async (req, res) => {
  try {
    const { id } = req.params;

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

    // check if movie and videos and images and credits is already stored
    // If they are, return that data
    if (
      stored_movie.rows.length > 0 &&
      stored_videos.rows.length > 0 &&
      stored_images.rows.length > 0 &&
      stored_credits.rows.length > 0
    ) {
      // console.log("Preparing stored movie...");

      // append objects to movie like TMDb response
      stored_movie.rows[0].videos = stored_videos.rows[0];
      stored_movie.rows[0].images = stored_images.rows[0];
      stored_movie.rows[0].credits = stored_credits.rows[0];

      res.json(stored_movie.rows[0]);
      // console.log("Sent stored movie.");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
