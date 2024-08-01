require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const People = require("./models/person.js");

const app = express();

// app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

const unkownEndpoint = (req, res) => {
  res.status(404).send({ error: "unkown endpoint" });
};

// Custom token to log the req body
morgan.token("body", (req) => JSON.stringify(req.body));

// Custom format string
const customFormat =
  ":method :url :status :res[content-length] - :response-time ms :body";

// Use morgan middlware with the cutom format
app.use(morgan(customFormat));

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

app.get("/api/persons", (req, res, next) => {
  People.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.get("/api/info", (req, res, next) => {
  const date = new Date();
  People.countDocuments({})
    .then((count) => {
      res.send(`<p>Phonebook has info for ${count} people.<br/><br/>${date}`);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  People.findById(id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  People.findByIdAndDelete(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  // Check for missing name or number
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  const newPerson = new People({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  const person = {
    name,
    number,
  };

  People.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators,
    context: "query",
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.use(unkownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server is running on port: ${PORT}`);
