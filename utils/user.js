const pool = require("../db");

module.exports.getUserFromUserId = async (user_id) => {
  const user = await pool.query(
    "SELECT id, username FROM app_user WHERE id = $1",
    [user_id]
  );

  return user.rows[0];
};

module.exports.getUserFromUsername = async (username) => {
  const user = await pool.query(
    "SELECT id, username FROM app_user AS u WHERE username = $1",
    [username]
  );

  return user.rows[0];
};
