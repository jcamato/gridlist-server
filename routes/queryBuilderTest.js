const express = require("express");
const router = express.Router();

// const generateQueryString = require("../utils/generateQueryString");
const _ = require("lodash");

// Query String Encoder
router.get("/", (req, res) => {
  let defaultFilters = [
    {
      name: "group",
      type: "value",
      display: "Group",
      defaultValue: 0,
      currentValue: 0,
    },
    {
      name: "score",
      type: "range",
      display: "Score",
      defaultValue: [0, 100],
      currentValue: [0, 100],
    },
    {
      name: "release",
      type: "range",
      display: "Release Year",
      defaultValue: [1878, new Date().getFullYear() + 7],
      currentValue: [1878, 1999],
    },
    {
      name: "genre",
      type: "list", //array for checkboxlist, chiplist, or search filter
      display: "Genre",
      defaultValue: [],
      currentValue: [3, 14],
    },
    {
      name: "runtime",
      type: "range",
      display: "Runtime",
      defaultValue: [0, 240],
      currentValue: [0, 240],
    },
    {
      name: "status",
      type: "value", //array for checkboxlist, chiplist, or search filter
      display: "Status",
      defaultValue: 0,
      currentValue: 0,
    },
  ];

  const currentFilters = defaultFilters.filter(
    // deep comparison
    (filter) => !_.isEqual(filter.defaultValue, filter.currentValue)
  );

  console.log(currentFilters);

  let queries = [];

  currentFilters.map((filter) => {
    if (filter.type === "range") {
      // code to only return bounds that changed
      // let nextLower = "";
      // let nextUpper = "";
      // if (filter.currentValue[0] !== filter.defaultValue[0]) {
      //   nextLower = filter.currentValue[0];
      // }
      // if (filter.currentValue[1] !== filter.defaultValue[1]) {
      //   nextUpper = filter.currentValue[1];
      // }
      // queries.push(`${filter.name}=${nextLower}..${nextUpper}`);

      // otherwise, can just return both bounds always?
      queries.push(
        `${filter.name}=${filter.currentValue[0]}..${filter.currentValue[1]}`
      );
    } else if (filter.type === "list") {
      queries.push(`${filter.name}=` + filter.currentValue.join(","));
    } else {
      queries.push(`${filter.name}=${filter.currentValue}`);
    }
  });

  // for (const [key, value] of Object.entries(filters)) {
  //   // console.log(`${key}: ${value.gte}`);
  //   if (value.type === "slider") {
  //     // console.log(`${key} is an object has gte`);
  //     if (!_.isEqual(value.currentValue, value.defaultValue)) {
  //       // let nextLower = "";
  //       // let nextUpper = "";
  //       // if (value.currentValue.gte !== value.defaultValue.gte) {
  //       //   nextLower = value.currentValue.gte;
  //       // }
  //       // if (value.currentValue.lte !== value.defaultValue.lte) {
  //       //   nextUpper = value.currentValue.lte;
  //       // }
  //       queries.push(
  //         `${key}=${value.currentValue.gte}..${value.currentValue.lte}`
  //       );
  //     }
  //   } else if (value.type === "checkbox") {
  //     // console.log(`${key} is an array`);
  //     if (!_.isEqual(value.currentValue, value.defaultValue)) {
  //       queries.push(`${key}=` + value.currentValue.join(","));
  //     }
  //   } else {
  //     // console.log(`${key} is a regular value.`);
  //     if (value.currentValue !== value.defaultValue) {
  //       queries.push(`${key}=${value.currentValue}`);
  //     }
  //   }
  // }

  let queryString = queries.join("&");
  console.log(queries);
  console.log(queryString);

  res.json(queryString);

  // build array = ['score=80..', 'release_year=1999..2008', 'genres=6,8,12,15', 'status=3']
  // queryString = array.join("&");

  // console.log(`object: ${filters}`);
  // let query = generateQueryString(filters);
  // console.log(`querystring: ${query}`);
  // res.json(query);
});

module.exports = router;
