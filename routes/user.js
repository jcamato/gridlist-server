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

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    } else {
      libraryUserId = user.id;
    }

    const libraryUser = { id: libraryUserId };

    const query = req.query;
    let authenticatedUser = null;

    if (res.locals.authenticated) {
      authenticatedUser = res.locals.user;
    }

    const options = {
      query: query,
      authenticatedUser: authenticatedUser,
      libraryUser: libraryUser,
      limit: "none",
    };

    const fetchedMovies = await moviesCore.getMovies(options);

    res.json(fetchedMovies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// PUBLIC ROUTE GET a user's library Count
router.get("/:username/library/movies/count", async (req, res) => {
  try {
    let libraryUserId = null;
    const { username } = req.params;

    const user = await userCore.getUserFromUsername(username);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    } else {
      libraryUserId = user.id;
    }

    const libraryUser = { id: libraryUserId };

    const options = {
      libraryUser: libraryUser,
    };

    const libraryCounts = await moviesCore.getLibraryMovieCounts(options);

    res.json(libraryCounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// PRIVATE: get authenticated user's library movie item
router.get("/library/movie", checkUser, async (req, res) => {
  try {
    const authenticatedUserId = res.locals.user.id;
    const { tmdb_movie_id } = req.body;

    const entry = await pool.query(
      "SELECT tmdb_movie_id, library_category_id, score, watch_date FROM library_movie WHERE user_id = $1 AND tmdb_movie_id = $2",
      [authenticatedUserId, tmdb_movie_id]
    );

    res.json(entry.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// PRIVATE: create or update an authenticated user's library movie item
// should this have :username and then this is the check for route === authUser?
// router.get("/:username/library/movies", checkUser, async (req, res) => {

// FIX: "Cannot set headers after they are sent to the client"
router.post("/library/movie", checkUser, async (req, res) => {
  try {
    const authenticatedUserId = res.locals.user.id;
    const {
      tmdb_movie_id,
      library_category_id,
      score,
      watch_date,
      watch_count,
      secret,
    } = req.body;

    // 1. check body has required fields. return 400 invalid if any are missing. This doesn't work when they are null
    // if (
    //   !(
    //     tmdb_movie_id &&
    //     library_category_id &&
    //     score &&
    //     watch_date &&
    //     watch_count &&
    //     secret
    //   )
    // ) {
    //   return res.status(400).json({
    //     message: "Missing at least one of the required fields",
    //   });
    // }

    // 2. check if entry already exists with a quick select query. if it doesn't create a default entry, if it does continue
    const currentEntry = await pool.query(
      "SELECT tmdb_movie_id FROM library_movie WHERE user_id = $1 AND tmdb_movie_id = $2",
      [authenticatedUserId, tmdb_movie_id]
    );

    if (currentEntry.rows.length === 0) {
      await pool.query(
        "INSERT INTO library_movie (user_id, tmdb_movie_id, library_category_id) VALUES ($1, $2, $3) RETURNING *",
        [authenticatedUserId, tmdb_movie_id, library_category_id]
      );
    }

    // 3. create object from body, add things like updated_at
    const item = {
      tmdb_movie_id: tmdb_movie_id,
      library_category_id: library_category_id,
      score: score || null,
      watch_date: watch_date || null,
      watch_count: watch_count || 0,
      secret: secret || false,
      updated_at: new Date(Date.now()).toISOString(),
    };

    // manipulate data depending on what is chosen, sometimes this doesn't execute??
    // if (library_category_id === 3 || watch_date || watch_count > 0) {
    //   if (library_category_id === 1) {
    //     item.library_category_id = 3;
    //   }
    //   if (!watch_date) {
    //     item.watch_date = new Date(Date.now()).toISOString();
    //   }
    //   if (!watch_count || watch_count === 0) {
    //     item.watch_count = 1;
    //   }
    // }

    // 4. execute resource update
    const updateMovie = await pool.query(
      "UPDATE library_movie SET library_category_id = $3, score = $4, watch_date = $5, watch_count = $6, private = $7, updated_at = $8 WHERE user_id = $1 AND tmdb_movie_id = $2 RETURNING *",
      [
        authenticatedUserId,
        item.tmdb_movie_id,
        item.library_category_id,
        item.score,
        item.watch_date,
        item.watch_count,
        item.secret,
        item.updated_at,
      ]
    );
    // 5. return current movie entry
    res.json(updateMovie.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// PRIVATE ROUTE, delete authenticated user's library movie item
router.delete("/library/movie", checkUser, async (req, res) => {
  try {
    const authenticatedUserId = res.locals.user.id;
    const { tmdb_movie_id } = req.body;

    const deleteMovie = await pool.query(
      "DELETE FROM library_movie WHERE user_id = $1 AND tmdb_movie_id = $2 RETURNING *",
      [authenticatedUserId, tmdb_movie_id]
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
