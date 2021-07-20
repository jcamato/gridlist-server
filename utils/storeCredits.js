const pool = require("../db");
const fetch = require("node-fetch");

const storePerson = require("./storePerson");

module.exports = async function (tmdb_movie_id) {
  try {
    const stored_credits = await pool.query(
      [
        "SELECT ct.tmdb_movie_id",
        "FROM tmdb_movie_cast AS ct",
        "INNER JOIN tmdb_movie_crew AS cw ON ct.tmdb_movie_id = cw.tmdb_movie_id",
        "WHERE ct.tmdb_movie_id = $1",
      ].join(" "),
      [tmdb_movie_id]
    );

    if (stored_credits.rows.length > 0) {
      console.log("Credits already stored... ", tmdb_movie_id);
    } else {
      const APP_KEY = process.env.TMDB_KEY;

      const fetchCreditsAndStore = async () => {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${tmdb_movie_id}/credits?api_key=${APP_KEY}`
        );
        const credits = await response.json();

        if (!credits.id) {
          throw new Error("credits not found");
        }

        console.log(
          "Credits not already stored, fetching and storing...",
          credits.id
        );

        // console.log("cast", credits.cast[0]);
        // console.log("crew", credits.crew[0]);

        // cast
        for (let i = 0; i < credits.cast.length; i++) {
          await storePerson(credits.cast[i].id);

          const text_tmdb_cast = [
            "INSERT INTO tmdb_movie_cast(tmdb_movie_id, tmdb_person_id, adult, gender, known_for_department, name, original_name, popularity, profile_path, cast_id, character, credit_id, cast_order)",
            "VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
            "ON CONFLICT ON CONSTRAINT tmdb_movie_cast_pkey DO NOTHING RETURNING *",
          ];

          const values_tmdb_cast = [
            tmdb_movie_id,
            credits.cast[i].id,
            credits.cast[i].adult,
            credits.cast[i].gender,
            credits.cast[i].known_for_department,
            credits.cast[i].name,
            credits.cast[i].original_name,
            credits.cast[i].popularity,
            credits.cast[i].profile_path,
            credits.cast[i].cast_id,
            credits.cast[i].character,
            credits.cast[i].credit_id,
            credits.cast[i].order,
          ];
          await pool.query(text_tmdb_cast.join(" "), values_tmdb_cast);

          console.log(
            "Cast member stored...",
            tmdb_movie_id,
            credits.cast[i].id
          );
        }

        // crew
        for (let i = 0; i < credits.crew.length; i++) {
          await storePerson(credits.crew[i].id);

          const text_tmdb_crew = [
            "INSERT INTO tmdb_movie_crew(tmdb_movie_id, tmdb_person_id, adult, gender, known_for_department, name, original_name, popularity, profile_path, credit_id, department, job)",
            "VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
            "ON CONFLICT ON CONSTRAINT tmdb_movie_crew_pkey DO NOTHING RETURNING *",
          ];

          const values_tmdb_crew = [
            tmdb_movie_id,
            credits.crew[i].id,
            credits.crew[i].adult,
            credits.crew[i].gender,
            credits.crew[i].known_for_department,
            credits.crew[i].name,
            credits.crew[i].original_name,
            credits.crew[i].popularity,
            credits.crew[i].profile_path,
            credits.crew[i].credit_id,
            credits.crew[i].department,
            credits.crew[i].job,
          ];
          await pool.query(text_tmdb_crew.join(" "), values_tmdb_crew);
        }
        // console.log("Stored.");
      };
      await fetchCreditsAndStore();
    }
    return;
  } catch (err) {
    console.error(err.message);
    // res.status(500).send("Server error");
  }
};
