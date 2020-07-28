const express = require("express");
const router = express.Router();

const generateQueryString = require("../utils/generateQueryString");

router.get("/", (req, res) => {
  let objtest = {
    "primary_release_date.gte": 2021,
    with_people: [123, 21],
    score: "123",
  };
  console.log(`object: ${objtest}`);
  let query = generateQueryString(objtest);
  console.log(`querystring: ${query}`);
  res.json(query);
});

module.exports = router;
