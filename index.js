const { response } = require("express");
const express = require("express");
const app = express();
var morgan = require("morgan");

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "050-123456",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "060-123456",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "070-123456",
  },
];

const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;

var dateTime = new Date();

console.log(maxId);

app.get("/info", (req, res) => {
  res.send(
    `<h1>Phonebook has info for ${maxId} people</h1><h1>${dateTime}</h1>`
  );
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
  res.json(person);
});

app.use(express.json());

function checkName(persons, name) {
  const found = persons.find((person) => person.name === name);
  if (found) {
    return persons;
  }
}

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "missing input",
    });
  }

  if (checkName(persons, body.name)) {
    return res.status(400).json({
      error: "already in list",
    });
  }

  const person = {
    id: maxId + 1,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.use(express.static("build"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
