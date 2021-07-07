const express = require("express");
// const pool = require("../db");
const router = express.Router();

const movies = require("./movies");
const storeMovie = require("../../utils/storeMovie");

router.get("/", async (req, res, next) => {
  try {
    // use this if there are request rate limits
    // const myCoolFunction = async (arr, i) => {
    //   const throttleTime = 500; // in milliseconds
    //   if (i < arr.length) {
    //     // console.log(i, arr[i]);
    //     await storeMovie(arr[i].id);
    //     i++;
    //     setTimeout(myCoolFunction, throttleTime, arr, i);
    //   } else {
    //     console.log("Finished.");
    //     res.send("Finished.");
    //   }
    // };

    // await myCoolFunction(movies, 0);

    // for (let i = 0; i < movies.length; i++) {
    for (let i = 240000; i < movies.length; i++) {
      // for (let i = 252000; i < movies.length; i++) {
      console.log("i:", i);
      await storeMovie(movies[i].id);
    }
    console.log("Finished.");
    res.send("Finished.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
