const blogsRouter = require("express").Router();
const Blog = require("../model/blog.js");
const User = require("../model/user.js");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  // const blog = new Blog(req.body);
  const body = req.body;

  if (!body.title || !body.author || !body.url) {
    res.status(400).end();
  }

  const user = await User.findById(body.userId);

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();

  res.status(201).json(result);
});

blogsRouter.delete("/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

blogsRouter.put("/:id", async (req, res) => {
  const body = req.body;

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
