const express = require("express");
const router = express.Router();
const pool = require("../db");

// middleware
const checkUser = require("../middleware/checkUser");

// utils
const moviesCore = require("../utils/movies");
const userCore = require("../utils/user");

// PRIVATE ROUTE GET authenticated user's id and username
router.get("/getAuthenticatedUser", checkUser, async (req, res) => {
  try {
    let user = null;

    // checkUser middleware sets user if valid token
    if (res.locals.authenticated) {
      user = await userCore.getUserFromUserId(res.locals.user.id);
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// PUBLIC ROUTE GET a user's library
router.get("/:username/library/movies", checkUser, async (req, res) => {
  try {
    let libraryUserId = null;
    const { username } = req.params;

    const user = await userCore.getUserFromUsername(username);

    if (user.id) {
      libraryUserId = user.id;
    }

    // Check if user exists
    if (!libraryUserId) {
      return res.status(404).json({ msg: "user not found" });
    }

    const query = req.query;
    let authenticatedUser = null;
    let libraryUser = { id: libraryUserId };

    if (res.locals.authenticated) {
      authenticatedUser = res.locals.user;
    }

    const options = {
      query: query,
      authenticatedUser: authenticatedUser,
      libraryUser: libraryUser,
    };

    const fetchedMovies = await moviesCore.getMovies(options);

    res.json(fetchedMovies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// PRIVATE: get one library movie item from authenticated user
router.get("/library/movie/:id", checkUser, async (req, res) => {
  try {
    const { id } = req.params;
    const authenticatedUserId = res.locals.user.id;

    const entry = await pool.query(
      "SELECT tmdb_movie_id, library_category_id, score, watch_date FROM library_movie WHERE tmdb_movie_id = $1 AND user_id = $2",
      [id, authenticatedUserId]
    );

    res.json(entry.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// PRIVATE ROUTE, delete authenticated user's library movie item
router.delete("/library/movie/:id", checkUser, async (req, res) => {
  try {
    const { id } = req.params;
    const authenticatedUserId = res.locals.user.id;

    const deleteMovie = await pool.query(
      "DELETE FROM library_movie WHERE tmdb_movie_id = $1 AND user_id = $2 RETURNING *",
      [id, authenticatedUserId]
    );

    if (deleteMovie.rows.length === 0) {
      res.status(404).json({
        message:
          "This movie item and user combination does not exist in the library",
      });
    }

    res.status(200).json({
      message: "Movie was deleted",
    });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
