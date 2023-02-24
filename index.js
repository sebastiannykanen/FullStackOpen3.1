require("dotenv").config();
const { response } = require("express");
const express = require("express");
const app = express();
var morgan = require("morgan");
const Person = require("./models/Person");
const cors = require("cors");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static("build"));

var dateTime = new Date();

app.get("/info", (req, res) => {
  res.send(
    `<h1>Phonebook has info for ${maxId} people</h1><h1>${dateTime}</h1>`
  );
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

app.use(express.json());

function checkName(persons, name) {
  const found = persons.find((person) => person.name === name);
  if (found) {
    return persons;
  }
}

app.post("/api/persons", (request, response) => {
  const body = request.body;

  console.log(body);

  if (body.name === undefined) {
    return response.status(400).json({ error: "name missing" });
  }

  if (body.number === undefined) {
    return response.status(400).json({ error: "number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(express.static("build"));

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
