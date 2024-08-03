const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./utils/logger.js");
const blogsRouter = require("./controllers/blogs.js");
const config = require("./utils/config.js");

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

app.use("/api/blogs", blogsRouter);

module.exports = app;
