const express = require("express");
const igdb = require("igdb-api-node").default;

const router = express.Router();

router.post("/", (req, res) => {
  // use this to take in fetch filters from the frontend
});

router.get("/", (req, res) => {
  // console.log("Trying to fetch IGDB...");

  // console.log("req.baseUrl: " + req.baseUrl); // /games
  // console.log("req.originaUrl: " + req.originalUrl); // /games?include_adult=false&vote_count.gte=200&sort_by=popularity
  // console.log("req.body: " + req.body); // undefined

  const APP_KEY = process.env.IGDB_KEY;

  let filters = [
    {
      label: "Genre",
      query: "&with_genres",
      defaultValue: [],
      currentValue: [],
      prepareValueForQuery: (value) => {
        return value;
      },
    },
    {
      label: "Release LTE",
      query: "&primary_release_date.lte",
      defaultValue: 2021,
      currentValue: 2021,
      prepareValueForQuery: (value) => {
        return `${value}-12-31`;
      },
    },
    {
      label: "Runtime GTE",
      query: "&with_runtime.gte",
      defaultValue: 0,
      currentValue: 0,
      prepareValueForQuery: (value) => {
        return value;
      },
    },
  ];

  const getGames = async () => {
    try {
      // const where = 'release_dates.platform = (6)'
      const where = "rating > 0 & rating_count >= 200 & category = 0";
      const response = await igdb(APP_KEY)
        .fields(
          "id, name, rating, rating_count, popularity, cover.url, summary, release_dates.y, category"
        )
        // array of strings works too
        // .fields([
        //   "id",
        //   "name",
        //   "rating",
        //   "rating_count",
        //   "popularity",
        //   "cover.url",
        //   "summary",
        //   "release_dates.y",
        //   "category",
        // ])
        .limit(20)
        // .offset(20) // offset results by 20
        .sort("rating", "desc")
        .where(where)
        .request("/games");
      res.send(response.data);
      // console.log(response.data);
      console.log("IGDB fetch complete.");
    } catch (error) {
      console.log(error);
    }
  };
  getGames();
});

module.exports = router;
