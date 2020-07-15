const express = require("express");
const pool = require("../db");
const router = express.Router();

//get a specific user
router.get("/:userName", async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT u.user_name, u.user_id, t.description FROM app_user AS u LEFT JOIN todos AS t ON u.user_id = t.user_id WHERE u.user_name = $1",
      [req.params.userName]
    );

    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
