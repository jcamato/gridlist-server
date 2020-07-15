const express = require("express");
const pool = require("../db");
const router = express.Router();

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT u.user_name, u.user_id FROM app_user AS u"
    );

    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
