const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app.js");
const Blog = require("../model/blog.js");
const User = require("../model/user");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const api = supertest(app);

let token;
beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "root", passwordHash });

  await user.save();

  token = jwt.sign({ id: user._id }, process.env.SECRET);
});

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
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 1);

  const title = blogAtEnd.map((b) => b.title);
  assert(title.includes("React is easy"));
});

test("fails with status code 401 if token is not provided", async () => {
  const newBlog = {
    title: "React is easy",
    author: "Si",
    url: "abc",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/);

  const blogAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length);
});

test("likes property is missing from the request", async () => {
  const newBlog = {
    title: "Tailwind is easy",
    author: "Si",
    url: "abc",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
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
  test("succeds with status code 204 if id is valid", async () => {
    const newBlog = {
      title: "React is easy",
      author: "Si",
      url: "abc",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogAtStart = await helper.blogsInDb();
    const blogToDelete = blogAtStart[2];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length);

    const title = blogAtEnd.map((b) => b.title);
    assert(!title.includes(blogToDelete.title));
  });
});
//     let token;
//     let user;
//     let blogToDelete;

//     beforeEach(async () => {
//       await User.deleteMany({});
//       await Blog.deleteMany({});

//       const passwordHash = await bcrypt.hash("sekret", 10);
//       user = new User({ username: "root", passwordHash });
//       await user.save();

//       token = jwt.sign({ id: user._id }, process.env.SECRET);

//       const blog = new Blog({
//         title: "React is easy",
//         author: "Si",
//         url: "abc",
//         user: user._id
//       });
//       await blog.save();

//       blogToDelete = blog;
//     });

//     test("succeeds with status code 204 if the blog is deleted by its creator", async () => {
//       await api
//         .delete(`/api/blogs/${blogToDelete.id}`)
//         .set('Authorization', `Bearer ${token}`)
//         .expect(204);

//       const blogAtEnd = await helper.blogsInDb();
//       assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length);

//       const title = blogAtEnd.map((b) => b.title);
//       assert(!title.includes(blogToDelete.title));
//     });

//     test("fails with status code 401 if a user is not authenticated", async () => {
//       await api
//         .delete(`/api/blogs/${blogToDelete.id}`)
//         .expect(401);
//     });

//     test("fails with status code 401 if the user is not the creator of the blog", async () => {
//       const anotherUser = new User({ username: "anotherUser", passwordHash: await bcrypt.hash("password", 10) });
//       await anotherUser.save();

//       const anotherToken = jwt.sign({ id: anotherUser._id }, process.env.SECRET);

//       await api
//         .delete(`/api/blogs/${blogToDelete.id}`)
//         .set('Authorization', `Bearer ${anotherToken}`)
//         .expect(401);
//     });
//   });

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

describe("where there is initially one user", async () => {
  const usersAtStart = await helper.usersInDb();

  test("creation succeeds with a fresh username", async () => {
    // const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const username = usersAtEnd.map((user) => user.username);
    assert(username.includes(newUser.username));
  });

  test("creation fails with proper status code and message if username does not exist", async () => {
    const newUser = {
      name: "Matti Luukkainen",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes("Username must be at least 3 characters long")
    );

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper status code and message if username is less than 3 characters long", async () => {
    const newUser = {
      username: "ml",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes("Username must be at least 3 characters long")
    );

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper status code and message if username already taken", async () => {
    // const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(result.body.error.includes("expected `username` to be unique"));

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper status code and message if password does not exist", async () => {
    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes("Password must be at least 3 characters long")
    );

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper status code and message if password is less than 3 characters long", async () => {
    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "sa",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes("Password must be at least 3 characters long")
    );

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
