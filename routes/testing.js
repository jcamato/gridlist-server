const express = require("express");
const pool = require("../db");
const router = express.Router();

const checkUser = require("../middleware/checkUser");
const moviesCore = require("../utils/movies");

router.get("/", checkUser, async (req, res) => {
  try {
    const text = [
      "SELECT tm.title, tm.popularity, lm.library_category_id, lm.score, lm.private",
      "FROM tmdb_movie AS tm",
      "INNER JOIN library_movie AS lm ON lm.user_id = $1 AND private = false AND lm.tmdb_movie_id = tm.id",
      "ORDER BY tm.popularity DESC, tm.vote_count DESC",
      "LIMIT 20",
    ].join(" ");

    const userid = "803a5e9e-5a4e-4b10-87d2-d6c85ce6cabd";
    const values = [userid];

    // const username = "123";

    // const text = [
    //   "SELECT id, username",
    //   "FROM app_user AS u",
    //   "WHERE username = $1",
    // ].join(" ");

    const userList = await pool.query(text, values);
    res.json(userList.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
