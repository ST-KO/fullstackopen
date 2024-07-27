const express = require("express");
const app = express();

app.use(express.json());

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

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(data);
});

app.get("/api/info", (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook has info for ${data.length} people.<br/><br/>${date}`);
});

app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const person = data.find((data) => data.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  data = data.filter((data) => data.id !== id);

  res.status(204).end();
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
  const nameExists = data.some((data) => data.name === body.name);

  if (nameExists) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const newId = Math.floor(Math.random() * 10000000);

  const newPerson = {
    id: newId,
    name: body.name,
    number: body.number,
  };

  data = data.concat(newPerson);

  res.json(newPerson);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server is running on port: ${PORT}`);
