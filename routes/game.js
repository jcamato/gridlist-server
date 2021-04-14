const express = require("express");
const pool = require("../db");
const router = express.Router();
const checkGameStorage = require("../middleware/checkGameStorage");

// individual game returns details with certain fields expanded. If game isn't already stored, it stores this in the 4 respective tables
// FIX: make the URL the game title with special chars removed and hyphens instead of spaces. this might be done in the client

// PUBLIC ROUTE to get a game
router.get("/:id", checkGameStorage, async (req, res) => {
  try {
    const { id } = req.params;

    const stored_game = await pool.query(
      "SELECT g.* FROM igdb_game AS g WHERE g.id = $1",
      [id]
    );

    res.json(stored_game.rows[0]);
    console.log("Game sent.");
    console.log(" ");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
