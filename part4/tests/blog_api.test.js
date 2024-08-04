const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app.js");
const Blog = require("../model/blog.js");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("blog list application returns the correct amount of blog posts", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("unique identifier property of the blog posts is named id", async () => {
  const response = await api.get("/api/blogs").expect(200);
  response.body.forEach((blog) => {
    assert(blog.hasOwnProperty("id"));
    assert(!blog.hasOwnProperty("_id"));
  });
});

test("successfully creates a new blog post", async () => {
  const newBlog = {
    title: "React is easy",
    author: "Si",
    url: "abc",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 1);

  const title = blogAtEnd.map((b) => b.title);
  assert(title.includes("React is easy"));
});

after(async () => {
  await mongoose.connection.close();
});
