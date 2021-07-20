const pool = require("../db");
const fetch = require("node-fetch");

module.exports = async function (tmdb_person_id) {
  try {
    const stored_person = await pool.query(
      ["SELECT p.id", "FROM tmdb_person AS p", "WHERE p.id = $1"].join(" "),
      [tmdb_person_id]
    );

    if (stored_person.rows.length > 0) {
      console.log("Person already stored... ", tmdb_person_id);
    } else {
      const APP_KEY = process.env.TMDB_KEY;

      const fetchPersonAndStore = async () => {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${tmdb_person_id}?api_key=${APP_KEY}`
        );
        const person = await response.json();

        if (!person.id) {
          throw new Error("Person not found");
        }

        console.log(
          "Person not already stored, fetching and storing...",
          person.id,
          person.name
        );

        const text_tmdb_person = [
          "INSERT INTO tmdb_person(id, birthday, known_for_department, deathday, name, gender, biography, popularity, place_of_birth, profile_path, adult, imdb_id, homepage)",
          "VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
          "ON CONFLICT ON CONSTRAINT tmdb_person_pkey DO NOTHING RETURNING *",
        ];
        const values_tmdb_person = [
          person.id,
          person.birthday,
          person.known_for_department,
          person.deathday,
          person.name,
          person.gender,
          person.biography,
          person.popularity,
          person.place_of_birth,
          person.profile_path,
          person.adult,
          person.imdb_id,
          person.homepage,
        ];
        await pool.query(text_tmdb_person.join(" "), values_tmdb_person);

        // console.log("Stored.");
      };
      await fetchPersonAndStore();
    }
    return;
  } catch (err) {
    console.error(err.message);
    // res.status(500).send("Server error");
  }
};
