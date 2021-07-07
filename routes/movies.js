const express = require("express");
// const { query } = require("../db");
const pool = require("../db");
const router = express.Router();

const toTitleCase = require("../utils/toTitleCase");

const _ = require("lodash");

// PUBLIC? route to get movies genre. However, when formatting I can just add a SERVER QUERY to obtain this instead of having a route?
router.get("/genre", async (req, res) => {
  try {
    const genre = await pool.query("SELECT * FROM tmdb_movie_genre");

    res.json(genre.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
