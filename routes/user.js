const express = require("express");
const router = express.Router();
const pool = require("../db");

// middleware
const checkUser = require("../middleware/checkUser");

// utils
const moviesCore = require("../utils/movies");

// PUBLIC ROUTE to get a user's library
// FIX: if checkUser === :username then return all items. if not, only return private = false items
router.get("/:username/library/movies", checkUser, async (req, res) => {
  try {
    let libraryUserId = null;
    const { username } = req.params;

    const user_response = await pool.query(
      "SELECT user_id FROM app_user AS u WHERE user_name = $1",
      [username]
    );

    if (user_response.rows[0]) {
      libraryUserId = user_response.rows[0].user_id;
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

    // console.log(options);

    const fetchedMovies = await moviesCore.getMovies(options);

    res.json(fetchedMovies);

    // console.log(username);

    // let user_id = "";

    // if (res.locals.authenticated) {
    //   user_id = res.locals.user.id;
    // }

    // if (user_id) {
    //   // if a user is authenticated, attach library data object to getItems request (depending on filters and sort options)
    // } else {
    //   // otherwise, just return getItems depending on filters and sort options
    // }
    // console.log("res.locals.user", res.locals.user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
