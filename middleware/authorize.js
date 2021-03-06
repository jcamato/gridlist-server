const jwt = require("jsonwebtoken");
require("dotenv").config();

// this middleware will continue on if the token is inside the local storage
// FIX: need to also check if authenticated user has authorization for a certain request

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("jwt_token");

  // Check if not token
  if (!token) {
    return res.status(403).json({ message: "authorization denied" });
  }

  // Verify token
  try {
    // it is going to give us the user id (user:{id: user.id})
    const verify = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verify.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
