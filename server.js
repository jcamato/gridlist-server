const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/auth", require("./routes/auth"));
app.use("/library", require("./routes/library"));

// app.use("/user", require("./routes/user"));
// app.use("/users", require("./routes/users"));

// Discover Pages?
app.use("/movies", require("./routes/movies"));
// app.use("/games", require("./routes/api/igdb"));

// Browse Pages
app.use("/browse/movies", require("./routes/browse/movies"));

// Detail Pages?
app.use("/movie", require("./routes/movie"));
app.use("/game", require("./routes/game"));

// Library Pages
app.use("/user", require("./routes/user"));

// Search results
app.use("/search", require("./routes/search"));

// Admin
app.use(
  "/database/tmdb/import_movies",
  require("./database/tmdb/import_movies")
);
app.use(
  "/database/tmdb/import_people",
  require("./database/tmdb/import_people")
);
app.use("/testing", require("./routes/testing"));

app.listen(process.env.PORT, () =>
  console.log(
    `Server started on port ${process.env.PORT}. See http://localhost:${process.env.PORT}/`
  )
);
