const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

router.get("/", (req, res) => {
  console.log("Trying to fetch TMDB...");

  // res.send("respond with a resource");

  const APP_KEY = process.env.TMDB_KEY;

  const baseUrl = "https://api.themoviedb.org/3/discover/movie?";
  const apiKey = `api_key=${APP_KEY}`;
  const filters =
    "&include_adult=false&vote_count.gte=200&sort_by=popularity.desc";
  const filters2 = req.originalUrl.substring(
    req.originalUrl.lastIndexOf("?") + 1
  );

  console.log("filters: " + filters);
  console.log("filters2: " + filters2);

  const createURL = (url1, url2, url3) => {
    let newUrl = url1 + url2 + url3;
    return newUrl;
  };

  const apiUrl = createURL(baseUrl, apiKey, filters);

  const getMovies = async () => {
    // console.log(apiUrl);
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.send(data.results);
    // console.log(data.results);
    console.log("TMDB fetch complete.");
  };
  getMovies();
});

module.exports = router;
