require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const People = require("./models/person.js");

const app = express();

let data = [
  {
    id: "1",
    name: "Arto Hella",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

const unkownEndpoint = (req, res, next) => {
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

app.get("/api/persons", (req, res) => {
  People.find({}).then((result) => {
    res.json(result);
  });
});

app.get("/api/info", (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook has info for ${data.length} people.<br/><br/>${date}`);
});

app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  People.findById(id).then((result) => {
    res.json(result);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  People.findByIdAndDelete(id).then((result) => {
    res.status(204).end();
  });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  // Check for missing name or number
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  // Check for duplicate names
  // const nameExists = data.some((data) => data.name === body.name);

  // if (nameExists) {
  //   return res.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  // const newId = Math.floor(Math.random() * 10000000);

  const newPerson = new People({
    name: body.name,
    number: body.number,
  });

  newPerson.save().then((result) => {
    res.json(newPerson);
  });
});

app.use(unkownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server is running on port: ${PORT}`);
