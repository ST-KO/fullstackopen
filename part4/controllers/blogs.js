const blogsRouter = require("express").Router();
const Blog = require("../model/blog.js");
const User = require("../model/user.js");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  // const blog = new Blog(req.body);
  const body = req.body;
  const token = req.token;

  if (!body.title || !body.author || !body.url) {
    res.status(400).end();
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  });

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();

  res.status(201).json(result);
});

blogsRouter.delete("/:id", async (req, res) => {
  // const token = req.token;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "user not authenticated" });
  }

  // const decodedToken = jwt.verify(token, process.env.SECRET);
  // if (!decodedToken.id) {
  //   return res.status(401).json({ error: "token invalid" });
  // }

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.stauts(401).json({ error: "blog not found" });
  }

  // Check if the user who is trying to delete the blog is the same as the one who created it
  if (blog.user.toString() !== user.id.toString()) {
    return res
      .status(403)
      .json({ error: "user not authorised to delete the post" });
  }

  // If all went well, proceed with deletion
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

blogsRouter.put("/:id", async (req, res) => {
  const body = req.body;
  const token = req.token;

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updateBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });

  res.status(200).json(updateBlog);
});

module.exports = blogsRouter;
