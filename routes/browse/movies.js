const express = require("express");
const router = express.Router();

// middleware
const checkUser = require("../../middleware/checkUser");

// utils
const moviesCore = require("../../utils/movies");

// PUBLIC ROUTE to get movies
router.get("/", checkUser, async (req, res) => {
  try {
    const query = req.query;
    let authenticatedUser = null;

    if (res.locals.authenticated) {
      authenticatedUser = res.locals.user;
    }

    const options = {
      query: query,
      authenticatedUser: authenticatedUser,
      libraryUser: null,
    };

    // console.log(options);

    const fetchedMovies = await moviesCore.getMovies(options);

    // const finalMovies = fetchedMovies with user data object attached to each movie

    // console.log(fetchedMovies);
    res.json(fetchedMovies);

    // if a user is authenticated, attach library data object to getItems request (depending on filter and sort options)

    // otherwise, just return getItems depending on filter and sort options
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
