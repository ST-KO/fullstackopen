const Blog = require("../model/blog.js");

const initialBlogs = [
  {
    title: "HTML is easy",
    author: "Si",
    url: "asd",
  },
  {
    title: "CSS is easy",
    author: "Si",
    url: "asd",
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = { initialBlogs, blogsInDb };
