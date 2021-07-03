const jwt = require("jsonwebtoken");
require("dotenv").config();

// FIX: should this just resolve to user = 'GUEST' if not a valid token or token is missing?
// check if request is coming from a User or Guest. Pass on res.locals.user as 'GUEST' or USER_ID
module.exports = function (req, res, next) {
  // initialize authentication to false
  res.locals.authenticated = false;

  try {
    // Get token from header
    const token = req.header("jwt_token");

    if (token) {
      // Verify token
      // it is going to give us the user id (user:{id: user.id})
      const verify = jwt.verify(token, process.env.JWT_SECRET);

      res.locals.authenticated = true;
      res.locals.user = verify.user;
    }

    next();
  } catch (err) {
    // if header token is not a valid token
    res.status(401).json({ msg: "Token is not valid" });
  }
};
