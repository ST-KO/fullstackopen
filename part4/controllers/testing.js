const testingRouter = require("express").Router();
const Blog = require("../model/blog.js");
const User = require("../model/user.js");

testingRouter.post("/reset", async (req, res) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  res.status(200).end();
});

module.exports = testingRouter;
