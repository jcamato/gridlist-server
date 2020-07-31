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

app.use("/user", require("./routes/user"));
// app.use("/users", require("./routes/users"));

// Discover Pages?
app.use("/movies", require("./routes/api/tmdb"));
app.use("/games", require("./routes/api/igdb"));

// Detail Pages?
app.use("/movie", require("./routes/movie"));

// test environment, not for production
app.use("/test", require("./routes/test"));

app.listen(process.env.PORT, () =>
  console.log(
    `Server started on port ${process.env.PORT}. See http://localhost:${process.env.PORT}/`
  )
);
