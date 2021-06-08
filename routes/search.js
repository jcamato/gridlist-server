const express = require("express");
const pool = require("../db");
const router = express.Router();

// PUBLIC ROUTE to search media
router.get("/:searchtext", async (req, res) => {
  try {
    const { searchtext } = req.params;

    // console.log(searchtext);

    const results = await pool.query(
      [
        "SELECT *",
        "FROM tmdb_movie",
        "WHERE title ILIKE $1",
        "ORDER BY popularity DESC, vote_count DESC",
        "LIMIT 101",
      ].join(" "),
      [`%${searchtext}%`]
    );

    res.json(results.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
