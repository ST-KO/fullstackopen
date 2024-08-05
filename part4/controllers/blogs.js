const blogsRouter = require("express").Router();
const Blog = require("../model/blog.js");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const blog = new Blog(req.body);

  if (!blog.title || !blog.author || !blog.url) {
    res.status(400).end();
  } else {
    const result = await blog.save();
    res.status(201).json(result);
  }
});

blogsRouter.delete("/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

blogsRouter.put("/:id", async (req, res) => {
  const body = req.body;

  const blog = {
    title: body.content,
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
