function parseQuery(queryObj) {
  for (const parameterKey of Object.keys(queryObj)) {
    // console.log(parameterKey);
  }
  // Here I can check or modify the query object before generating the query string
  return querystring.stringify(queryObj);
}

module.exports = parseQuery;
