const { test, after, beforeEach, describe } = require("node:test");
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

test("likes property is missing from the request", async () => {
  const newBlog = {
    title: "Tailwind is easy",
    author: "Si",
    url: "abc",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert(!response.body.hasOwnProperty("likes"));
});

test("blog without content is added", async () => {
  const newBlog = {
    title: "Tailwind is easy",
    author: "Si",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);

  const blogAtEnd = await helper.blogsInDb();

  assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length);
});

describe("deletion of a blog", () => {
  test("succeds with status code 204 if id id valid", async () => {
    const blogAtStart = await helper.blogsInDb();
    const blogToDelete = blogAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length - 1);

    const title = blogAtEnd.map((b) => b.title);
    assert(!title.includes(blogToDelete.title));
  });
});

describe("updating a blog", () => {
  test("succeds with status code 200 if update passes", async () => {
    const blogAtStart = await helper.blogsInDb();

    const blogToUpdate = blogAtStart[0];

    const newBlog = {
      title: "React",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    };

    await api.put(`/api/blogs/${blogToUpdate.id}`).expect(200);

    const blogAtEnd = await helper.blogsInDb();
    const title = blogAtEnd.map((b) => b.title);
    assert(!title.includes(newBlog.title));
  });
});

after(async () => {
  await mongoose.connection.close();
});
