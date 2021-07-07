const express = require("express");
const pool = require("../db");
const router = express.Router();
const authorize = require("../middleware/authorize");
const checkMovieStorage = require("../middleware/checkMovieStorage");

//get all library movie items from authenticated user
// router.get("/movie", async (req, res) => {
//   try {
//     // console.log(req.user);
//     const library = await pool.query(
//       "SELECT lm.id, lm.tmdb_movie_id, lm.library_category_id, lm.score, lm.watch_date, lm.watch_count, lm.private, tm.title, tm.poster_path, tm.vote_average, tm.release_date, tm.overview, tm.backdrop_path FROM app_user AS u INNER JOIN library_movie AS lm ON u.id = lm.user_id LEFT JOIN tmdb_movie AS tm ON lm.tmdb_movie_id = tm.id WHERE u.id = $1",
//       [req.user.id]
//     );

//     res.json(library.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

//get one library movie item from authenticated user
// router.get("/movie/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const entry = await pool.query(
//       "SELECT tmdb_movie_id, library_category_id, score, watch_date FROM library_movie WHERE tmdb_movie_id = $1 AND user_id = $2",
//       [id, req.user.id]
//     );

//     res.json(entry.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

//create or completely update a library movie item.
//FIX: If there is other data saved such as score, watch date, etc., if user switches from want to watch and watched and vice versa with quick buttons, that data is erased. This is because the whole resource is updating.
router.post("/movie", authorize, checkMovieStorage, async (req, res) => {
  try {
    const {
      tmdb_movie_id,
      library_category_id,
      score,
      watch_date,
      watch_count,
      secret,
    } = req.body;

    console.log(req.body);

    // check if movie exists, throw err if it does
    const currentEntry = await pool.query(
      "SELECT tmdb_movie_id FROM library_movie WHERE user_id = $1 AND tmdb_movie_id = $2",
      [req.user.id, tmdb_movie_id]
    );

    if (currentEntry.rows.length > 0) {
      // return res.status(401).json("That movie is already in your library... updating.");
      console.log("Updating existing movie in your library...");

      // FIX: depending on what user sends, compare with currentEntry and update from req.body accordingly
      const updatedMovie = await pool.query(
        "UPDATE library_movie SET library_category_id = $3, score = $4, watch_date = $5, watch_count = $6, private = $7 WHERE user_id = $1 AND tmdb_movie_id = $2 RETURNING *",
        [
          req.user.id,
          tmdb_movie_id,
          library_category_id,
          score,
          watch_date,
          watch_count,
          secret,
        ]
      );
      res.json(updatedMovie.rows[0]);
    } else {
      console.log("Adding new movie to your library");

      const newMovie = await pool.query(
        "INSERT INTO library_movie (user_id, tmdb_movie_id, library_category_id, score, watch_date, watch_count) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [
          req.user.id,
          tmdb_movie_id,
          library_category_id,
          score,
          watch_date,
          watch_count,
        ]
      );

      res.json(newMovie.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
  }
});

// atempt to build dynamic update query
// router.get("/movie/:id", authorize, async (req, res) => {
//   try {
//     let setString = "";
//     let argNum = 3;
//     const body = req.body;

//     for (let keys = Object.keys(body), i = 0, end = keys.length; i < end; i++) {
//       let key = keys[i];

//       if (key === "user_id") {
//         continue;
//       }

//       let nextSet = "";

//       if (i === keys.length - 1) {
//         nextSet = `${key} = $` + argNum + " ";
//       } else {
//         nextSet = `${key} = $` + argNum + ", ";
//       }
//       setString += nextSet;
//       argNum++;
//     }
//     console.log(setString);
//     const updateMovie = await pool.query(
//       `UPDATE library_movie SET ${setString} WHERE id = $1 AND user_id = $2 RETURNING * `,
//       [id, req.user.id, library_category_id, score]
//     );
//     res.json(req.body);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// update library movie item
// router.put("/movie/:id", authorize, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { library_category_id, score, watch_date } = req.body;
//     const updateMovie = await pool.query(
//       "UPDATE library_movie SET library_category_id = COALESCE($1, library_category_id), score = COALESCE($2, score), watch_date = COALESCE($3, watch_date) WHERE id = $4 AND user_id = $5 RETURNING * ",
//       [library_category_id, score, watch_date, id, req.user.id]
//     );

//     if (updateMovie.rows.length === 0) {
//       return res.json("This library item is not yours");
//     }

//     res.json("Library movie item was updated");
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// update library movie item depending on which parameters are sent.
// However, this is technically functioning as a put since it's updating all the fields
// router.patch("/movie/:id", authorize, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { library_category_id, score, watch_date } = req.body;
//     const updateMovie = await pool.query(
//       "UPDATE library_movie SET library_category_id = COALESCE($1, library_category_id), score = COALESCE($2, score), watch_date = COALESCE($3, watch_date) WHERE id = $4 AND user_id = $5 RETURNING * ",
//       [library_category_id, score, watch_date, id, req.user.id]
//     );

//     if (updateMovie.rows.length === 0) {
//       return res.json("This library item is not yours");
//     }

//     res.json("Library movie item was updated");
//   } catch (err) {
//     console.error(err.message);
//   }
// });

//delete a library movie item
router.delete("/movie/:lib_id", authorize, async (req, res) => {
  try {
    const { lib_id } = req.params;
    const deleteMovie = await pool.query(
      "DELETE FROM library_movie WHERE id = $1 AND user_id = $2 RETURNING *",
      [lib_id, req.user.id]
    );

    if (deleteMovie.rows.length === 0) {
      return res.json("This library item is not yours");
    }

    res.json("Movie was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
