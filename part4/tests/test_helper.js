const Blog = require("../model/blog.js");
const User = require("../model/user.js");

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

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = { initialBlogs, blogsInDb, usersInDb };
