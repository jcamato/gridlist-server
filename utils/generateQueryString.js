const querystring = require("querystring");

function generateQueryString(queryObj) {
  // Here I can check or modify the query object before generating the query string
  return querystring.stringify(queryObj);
}

module.exports = generateQueryString;
