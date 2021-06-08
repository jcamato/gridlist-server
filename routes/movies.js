const express = require("express");
// const { query } = require("../db");
const pool = require("../db");
const router = express.Router();

const toTitleCase = require("../utils/toTitleCase");
const { genres } = require("../database/tmdb");

const _ = require("lodash");

// PUBLIC ROUTE to get movies
router.get("/", async (req, res) => {
  try {
    console.log("");
    // const {
    //   tmdb_movie_id,
    //   library_category_id,
    //   score,
    //   watch_date,
    //   watch_count,
    //   secret,
    // } = req.query;

    // console.log(req.query);

    // console.log(queryParts);

    // FIGURING OUT "WHERE" PART OF QUERY
    // create array from request, check for filters and at least one valid. if so, continue with where push
    // put any where lines in an array
    let queryWhereParts = [];

    // might need this for free text filters
    // https://www.npmjs.com/package/pg-format

    // CREATE UTIL FUNCTION FOR THESE. GENERIC for get range from int range string

    let parseSliderRangeFilter = (name, tmdb_name, lower, upper) => {
      let filter = _.get(req, `query.${name}`);
      if (filter) {
        // take out all characters that are not numbers or periods
        const filterSplit = filter.split("..");
        if (filterSplit.length === 2) {
          let min = parseInt(filterSplit[0]);
          let max = parseInt(filterSplit[1]);
          if (
            (min || min === 0) &&
            (max || max === 0) &&
            min <= max &&
            min >= lower &&
            max <= upper
          ) {
            if (name === "score") {
              queryWhereParts.push(
                `${tmdb_name} BETWEEN ${min / 10} AND ${max / 10}`
              );
            } else if (name === "release") {
              queryWhereParts.push(
                `${tmdb_name} BETWEEN '${min}-01-01' AND '${max}-12-31'`
              );
            } else if (name === "runtime") {
              queryWhereParts.push(`${tmdb_name} BETWEEN ${min} AND ${max}`);
            }
            // queryWhereParts.push(
            //   `${tmdb_name} BETWEEN ${min + 5} AND ${max + 5}`
            // );
            // console.log("queryWhereParts", name, queryWhereParts);
          }
        }
        // validate filter.
        // if filter is good
        // add queryWherePart for "filter BETWEEN 25 and 35"
      }
    };

    let parseCheckboxListFilter = (name, tmdb_name, format) => {
      let filter = _.get(req, `query.${name}`);

      let filterParts = [];

      if (filter) {
        // take out all characters that are not numbers or periods
        const filterSplit = filter.split(",");
        if (filterSplit.length > 0) {
          // console.log("filterSplit", filterSplit);
        }

        for (let i = 0; i < filterSplit.length; i++) {
          const indexOfFilter = format.findIndex(
            (f) => f.name === toTitleCase(filterSplit[i])
          );

          if (indexOfFilter >= 0) {
            filterParts.push(indexOfFilter);
          }
        }
      }

      console.log(filterParts);
    };

    parseSliderRangeFilter("score", "vote_average", 0, 100);
    parseSliderRangeFilter(
      "release",
      "release_date",
      1896,
      new Date().getFullYear() + 1
    );
    parseCheckboxListFilter("genre", "genres", genres);
    parseSliderRangeFilter("runtime", "runtime", 0, 300);

    let queryParts = [];

    // SELECT
    queryParts.push(
      "SELECT title, vote_average, vote_count, popularity, release_date, runtime, revenue, budget"
    );

    // FROM
    queryParts.push("FROM tmdb_movie");

    // WHERE
    if (queryWhereParts.length > 0) {
      queryParts.push("WHERE vote_count > 200 AND");
      queryParts = queryParts.concat(queryWhereParts.join(" AND "));
      // add these to queryParts
      // console.log("queryParts", queryParts);
    }

    // ORDER
    let parseSort = () => {
      let sort = _.get(req, `query.sort`);
      let order = _.get(req, `query.order`);

      let currentSort = "popularity";
      let currentOrder = "desc";

      if (sort || order) {
        if (sort === "score") {
          currentSort = "vote_average";
        } else if (sort === "release") {
          currentSort = "release_date";
        } else if (sort === "revenue") {
          currentSort = "revenue";
        }
        if (order === "asc") {
          currentOrder = "asc";
        }
      }

      queryParts.push(
        `ORDER BY ${currentSort} ${currentOrder}, vote_count DESC`
      );
    };
    parseSort();

    // PAGES
    let parsePage = () => {
      let page = parseInt(_.get(req, `query.page`));

      let currentPage = 1;

      if (page && page > 1) {
        currentPage = page;
      }

      if (currentPage === 1) {
        queryParts.push(`LIMIT 20`);
      } else {
        // FIX: depending on infinite scroll vs page buttons I may not need offset, just increase limit by page number sent
        queryParts.push(`LIMIT ${20} OFFSET ${20 * (currentPage - 1)}`);
      }
    };

    parsePage();
    // queryParts.push("LIMIT 20");

    console.log(queryParts.join(" "));

    // generate
    const movies = await pool.query(
      queryParts.join(" ")
      // , [id]
    );

    res.json(movies.rows);
    console.log("Movies sent.");
    console.log(" ");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
