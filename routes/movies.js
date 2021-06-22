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
    // console.log("");
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

    let queryParts = [];

    // SELECT
    // queryParts.push("SELECT *, count(*) OVER() AS total_results");
    queryParts.push("SELECT *");

    // FROM
    queryParts.push("FROM tmdb_movie");

    // FIGURING OUT "WHERE" PART OF QUERY
    // create array from request, check for filters and at least one valid. if so, continue with where push
    // put any where lines in an array
    let queryWhereParts = [];

    // this is for filters that need to reference other tables (genres, cast, crew, etc.)
    let queryWhereIntersectParts = [];
    /*
    tmdb_movie_id in (
      select tmdb_movie_id from tmdb_movie_genres where tmdb_movie_genre_id = 28
      INTERSECT
      select tmdb_movie_id from tmdb_movie_genres where tmdb_movie_genre_id = 12
      INTERSECT
      select tmdb_movie_id from tmdb_movie_cast where name = 'Ian McKellen'
    )
    */

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

    let parseCheckboxListFilter = (
      name,
      tmdb_movie_table_list,
      tmdb_movie_table_filter_id,
      format
    ) => {
      let filter = _.get(req, `query.${name}`);

      // let filterIds = [];

      if (filter) {
        // take out all characters that are not numbers or periods
        const filterSplit = filter.split(",");
        if (filterSplit.length > 0) {
          // console.log("filterSplit", filterSplit);
          for (let i = 0; i < filterSplit.length; i++) {
            const indexOfFilter = format.findIndex(
              (f) => f.name === toTitleCase(filterSplit[i])
            );

            if (indexOfFilter >= 0) {
              // filterIds.push(format[indexOfFilter].id);
              queryWhereIntersectParts.push(
                `select tmdb_movie_id from ${tmdb_movie_table_list} where ${tmdb_movie_table_filter_id} = ${format[indexOfFilter].id}`
              );
            }
          }
        }
      }

      // console.log("queryintersect", queryWhereIntersectParts);
    };

    // SELECT id, title, genres
    // FROM tmdb_movie
    // CROSS JOIN lateral jsonb_array_elements(genres) id(ele)
    // WHERE (ele->>'id')::jsonb @> '28';

    // INTERSECT queries first
    parseCheckboxListFilter(
      "genre",
      "tmdb_movie_genres",
      "tmdb_movie_genre_id",
      genres
    );
    // other queries next
    parseSliderRangeFilter("score", "vote_average", 0, 100);
    parseSliderRangeFilter(
      "release",
      "release_date",
      1874,
      new Date().getFullYear() + 1
    );
    parseSliderRangeFilter("runtime", "runtime", 0, 300);
    // parseSliderRangeFilter("score_count", "vote_count", 0, Number.MAX_VALUE);

    const sortedBy = _.get(req, `query.sort`);

    if (sortedBy === "score") {
      queryWhereParts.push("vote_count > 100");
    } else if (sortedBy === "release") {
      queryWhereParts.push("release_date > '1799-01-01'");
    } else if (sortedBy === "revenue") {
      queryWhereParts.push("revenue > 1000");
    } else if (sortedBy === "budget") {
      queryWhereParts.push("budget > 1000");
    }

    // WHERE
    if (queryWhereParts.length > 0 || queryWhereIntersectParts.length > 0) {
      // queryParts.push("WHERE vote_count > 10 AND");
      queryParts.push("WHERE");

      if (queryWhereIntersectParts.length > 0) {
        /*
    tmdb_movie_id in (
      select tmdb_movie_id from tmdb_movie_genres where tmdb_movie_genre_id = 28
      INTERSECT
      select tmdb_movie_id from tmdb_movie_genres where tmdb_movie_genre_id = 12
      INTERSECT
      select tmdb_movie_id from tmdb_movie_cast where name = 'Ian McKellen'
    )
    */
        queryWhereParts = queryWhereParts.concat(
          "id in (" + queryWhereIntersectParts.join(" INTERSECT ") + ")"
        );
      }
      if (queryWhereParts.length > 0) {
        queryParts = queryParts.concat(queryWhereParts.join(" AND "));
      }
      // add these to queryParts
      // console.log("queryParts", queryParts);
    }

    // ORDER
    let parseSort = () => {
      const sort = _.get(req, `query.sort`);
      const order = _.get(req, `query.order`);

      let currentSort = "popularity";
      let currentOrder = "desc";

      if (sort || order) {
        if (sort === "score") {
          currentSort = "vote_average";
        } else if (sort === "release") {
          currentSort = "release_date";
        } else if (sort === "revenue") {
          currentSort = "revenue";
        } else if (sort === "budget") {
          currentSort = "budget";
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

    // console.log(queryParts.join(" "));

    // generate
    const movies = await pool.query(
      queryParts.join(" ")
      // , [id]
    );

    // console.log("total results", movies.rows[0].total_results);

    res.json(movies.rows);
    // console.log("Movies sent.");
    // console.log(" ");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
