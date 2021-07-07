const pool = require("../db");

// libraries
const _ = require("lodash");

// utils
const toTitleCase = require("../utils/toTitleCase");

// return Object of all movie IDs in library of given user id
// module.exports.getAllMovieIDsInLibraryOfUser = async function (user_id) {
//   try {
//     let text = [];
//     let values = [];

//     text.push("SELECT lm.tmdb_movie_id");
//     text.push("FROM library_movie as lm");
//     text.push("WHERE lm.user_id = $1");

//     values = [user_id];

//     const response = await pool.query(text.join(" "), values);

//     return response.rows;
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };

// return Object of all movie IDs and their category in library of given user id (and optional category)
// module.exports.getAllMovieIDsInLibraryOfUserByCategory = async function (
//   user_id,
//   category
// ) {
//   try {
//     let text = [];
//     let values = [];

//     text.push("SELECT lm.tmdb_movie_id, lm.library_category_id");
//     text.push("FROM library_movie as lm");
//     text.push("WHERE lm.user_id = $1");

//     if (category) {
//       text.push("AND lm.library_category_id = $2");
//       values = [user_id, category];
//     } else {
//       values = [user_id];
//     }

//     const response = await pool.query(text.join(" "), values);

//     return response.rows;
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };

const getLibraryMovieData = async (tmdb_movie_id, user_id) => {
  const libraryMovie = await pool.query(
    "SELECT library_category_id, score, watch_date, watch_count FROM library_movie WHERE user_id = $1 AND tmdb_movie_id = $2",
    [user_id, tmdb_movie_id]
  );

  return libraryMovie.rows[0];
};

const appendLibraryMovieData = async (
  movies,
  authenticatedUserId,
  libraryUserId
) => {
  const moviesAppended = _.cloneDeep(movies);

  for (let i = 0; i < moviesAppended.length; i++) {
    let authenticatedUserLibraryData = {
      library_category_id: null,
      score: null,
      watch_date: null,
      watch_count: null,
    };

    if (authenticatedUserId) {
      const libraryMovie = await getLibraryMovieData(
        moviesAppended[i].id,
        authenticatedUserId
      );

      if (libraryMovie) {
        authenticatedUserLibraryData.library_category_id =
          libraryMovie.library_category_id;
        authenticatedUserLibraryData.score = libraryMovie.score;
        authenticatedUserLibraryData.watch_date = libraryMovie.watch_date;
        authenticatedUserLibraryData.watch_count = libraryMovie.watch_count;
      }
    }

    moviesAppended[i].authenticatedUserLibraryData =
      authenticatedUserLibraryData;

    let libraryUserLibraryData = {
      library_category_id: null,
      score: null,
      watch_date: null,
      watch_count: null,
    };

    if (libraryUserId) {
      const libraryMovie = await getLibraryMovieData(
        moviesAppended[i].id,
        libraryUserId
      );

      if (libraryMovie) {
        libraryUserLibraryData.library_category_id =
          libraryMovie.library_category_id;
        libraryUserLibraryData.score = libraryMovie.score;
        libraryUserLibraryData.watch_date = libraryMovie.watch_date;
        libraryUserLibraryData.watch_count = libraryMovie.watch_count;
      }
    }

    moviesAppended[i].libraryUserLibraryData = libraryUserLibraryData;
  }

  return moviesAppended;
};

// return movie data depending on query. Attach user object to each movie that is null or populated with an autheticated user's data for that movie. If this is passed an ID list, add this condition to the ID INTERSECT statement

// options = {
//   query: { },
//   authenticatedUser: { id: ''},
//   libraryUser: { id: ''},
// };
module.exports.getMovies = async function (options) {
  try {
    let response = null;
    let authenticatedUserId = null;
    let libraryUserId = null;

    if (options.authenticatedUser) {
      authenticatedUserId = options.authenticatedUser.id;
    }

    if (options.libraryUser) {
      libraryUserId = options.libraryUser.id;
    }

    let queryParts = [];

    // SELECT
    // queryParts.push("SELECT *, count(*) OVER() AS total_results");
    queryParts.push("SELECT tmdb_movie.*");

    // FROM
    queryParts.push("FROM tmdb_movie");

    // If user LibraryUser exists and not empty, inner join on that user. FIX: update to attach authenticated user data and library user data as an object. should this JOIN be here regardless when trying to access a user's library?
    if (libraryUserId) {
      if (authenticatedUserId && authenticatedUserId === libraryUserId) {
        // if authenticated user is the library user, show all items
        queryParts.push(
          `INNER JOIN library_movie AS lm ON lm.user_id = '${libraryUserId}' AND lm.tmdb_movie_id = tmdb_movie.id`
        );
      } else {
        // if not, only show non private items
        queryParts.push(
          `INNER JOIN library_movie AS lm ON lm.user_id = '${libraryUserId}' AND lm.private = false AND lm.tmdb_movie_id = tmdb_movie.id`
        );
      }
    }

    // this is for filters that directly check conditions in tmdb_movie
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
      let filter = _.get(options, `query.${name}`);
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

    let parseCheckboxListFilter = async (
      name,
      tmdb_movie_table_list,
      tmdb_movie_table_filter_id
    ) => {
      let filter = _.get(options, `query.${name}`);
      let format = [];

      // let filterIds = [];

      if (filter) {
        if (name === "genre") {
          const genres = await pool.query(
            "SELECT id, name FROM tmdb_movie_genre"
          );

          format = genres.rows;
        }
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
    await parseCheckboxListFilter(
      "genre",
      "tmdb_movie_genres",
      "tmdb_movie_genre_id"
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

    const sortedBy = _.get(options, `query.sort`);

    // Depending on the chosen sort, minimum conditions should be set for these fields to remove low or missing values when viewing in ascending order
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
      const sort = _.get(options, `query.sort`);
      const order = _.get(options, `query.order`);

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
      let page = parseInt(_.get(options, `query.page`));

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

    console.log(" ");
    console.log(queryParts.join(" "));

    // generate
    response = await pool.query(
      queryParts.join(" ")
      // , [id]
    );

    const returnedMovies = response.rows;

    const finalMovies = await appendLibraryMovieData(
      returnedMovies,
      authenticatedUserId,
      libraryUserId
    );

    return finalMovies;
  } catch (err) {
    console.error(err.message);
    // res.status(500).send("Server error");
  }
};
