const pool = require("../db");
const igdb = require("igdb-api-node").default;
// const moment = require("moment");

// This middleware will check local storage for the existence of a game
// If this game does not exist in the table, it will fetch the data from igdb and store this locally for access
// FIX: This middleware might need to account for scheduled updates and overwrites that will be done elsewhere

module.exports = async function (req, res, next) {
  try {
    // These will be supplied with either req.params or req.body based on game details request or library addition
    // update node for nullish operator
    // const id = req.params.id ?? req.body.igdb_id;
    const id = req.params.id ? req.params.id : req.body.igdb_id;

    // console.log(req.params);
    // console.log(req.params.id);

    // console.log(req.body);
    // console.log(req.body.id);

    const stored_game = await pool.query(
      "SELECT g.id, g.name FROM igdb_game AS g WHERE g.id = $1",
      [id]
    );

    if (stored_game.rows.length > 0) {
      console.log("All game tables are stored.");
    } else {

      const CLIENT_ID = process.env.IGDB_CLIENT_ID;
      const APP_TOKEN = process.env.IGDB_APP_TOKEN;

      // if it isn't, fetch, send response, and store game in database

      const fetchgameAndStore = async () => {
        console.log("Not all game tables are stored, fetching...");


      const response = await igdb(CLIENT_ID, APP_TOKEN)
        .fields([
          "id",
          "age_ratings.*",   
          "aggregated_rating",
          "aggregated_rating_count",
          "alternative_names.*", 
          "artworks.*", 
          "bundles", 
          "category",
          "collection.*",
          "cover.*",
          "created_at",
          "expansions", 
          "external_games.*", 
          "first_release_date",
          "follows",
          "franchises.*", 
          "game_engines.*", 
          "game_modes.*", 
          "genres.*", 
          "hypes",
          "involved_companies.*", 
          "keywords.*", 
          "name",
          "platforms.*", 
          "player_perspectives.*", 
          "rating",
          "rating_count",
          "release_dates.*", 
          "screenshots.*", 
          "similar_games", 
          "slug",
          "summary",
          "tags", 
          "themes.*", 
          "total_rating",
          "total_rating_count",
          "updated_at",
          "url",
          "videos.*", 
          "websites.*", 
          "checksum",
        ])
        // .limit(20)
        // .offset(20) // offset results by 20
        // .sort("rating", "desc")
        .where(`id = ${id}`)
        .request("/games");
      
        // console.log(response.data);
        // res.json(stored_game.rows[0]);
      // const game = await response.json();
        
        const game = await response.data[0];

      // console.log(game.id);
      // console.log(game.name);
      // console.log(JSON.stringify(game.genres));

      if (!game.id) {
        throw new Error("game not found");
      }

      console.log("Storing fetched game...");

      const text_igdb_game =
        "INSERT INTO igdb_game(id, age_ratings, aggregated_rating, aggregated_rating_count, alternative_names, artworks, bundles, category, collection, cover, created_at_igdb, expansions, external_games, first_release_date, follows, franchises, game_engines, game_modes, genres, hypes, involved_companies, keywords, name, platforms, player_perspectives, rating, rating_count, release_dates, screenshots, similar_games, slug, summary, tags, themes, total_rating, total_rating_count, updated_at_igdb, url, videos, websites, checksum) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41) ON CONFLICT ON CONSTRAINT igdb_game_pkey DO NOTHING RETURNING *";
      const values_igdb_game = [
        game.id,
        JSON.stringify(game.age_ratings),
        game.aggregated_rating,
        game.aggregated_rating_count,
        JSON.stringify(game.alternative_names),
        JSON.stringify(game.artworks),
        game.bundles,
        game.category,
        JSON.stringify(game.collection),
        JSON.stringify(game.cover),
        // moment.unix(game.created_at).format("YYYY-MM-DD hh:mm:ss"),
        game.created_at,
        game.expansions,
        JSON.stringify(game.external_games),
        // moment.unix(game.first_release_date).format("YYYY-MM-DD hh:mm:ss"),
        game.first_release_date,
        game.follows,
        JSON.stringify(game.franchises),
        JSON.stringify(game.game_engines),
        JSON.stringify(game.game_modes),
        JSON.stringify(game.genres),
        game.hypes,
        JSON.stringify(game.involved_companies),
        JSON.stringify(game.keywords),
        game.name,
        JSON.stringify(game.platforms),
        JSON.stringify(game.player_perspectives),
        game.rating,
        game.rating_count,
        JSON.stringify(game.release_dates),
        JSON.stringify(game.screenshots),
        game.similar_games,
        game.slug,
        game.summary,
        game.tags,
        JSON.stringify(game.themes),
        game.total_rating,
        game.total_rating_count,
        // moment.unix(game.updated_at).format("YYYY-MM-DD hh:mm:ss"),
        game.updated_at,
        game.url,
        JSON.stringify(game.videos),
        JSON.stringify(game.websites),
        game.checksum,
      ];
      await pool.query(text_igdb_game, values_igdb_game);

      console.log("Stored.");
      };
      await fetchgameAndStore();
      // If i have the middleware setup to store game before returning, then i can restructure how the data is returned if i want to.
      // Right now it's mimicking igdb with certain fields expanded
    }
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
