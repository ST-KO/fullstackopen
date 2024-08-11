const express = require("express");
const cors = require("cors");
require("express-async-errors");
const mongoose = require("mongoose");
const logger = require("./utils/logger.js");
const blogsRouter = require("./controllers/blogs.js");
const usersRouter = require("./controllers/users.js");
const middleware = require("./utils/middleware.js");
const config = require("./utils/config.js");
const loginRouter = require("./controllers/login.js");

const app = express();

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connect to MongoDB");
  })
  .catch((error) => {
    logger.error("error, connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());

app.use(middleware.getTokenFrom);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
