const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const name = process.argv[3];

const phoneNumber = process.argv[4];

const url = `mongodb+srv://sebastiannykanen:${password}@cluster0.qekdml0.mongodb.net/persons?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personsSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personsSchema);

const person = new Person({
  name: name,
  number: phoneNumber,
});

if (process.argv.length > 4) {
  person.save().then((result) => {
    console.log(`added ${name} number ${phoneNumber} to phonebook`);
    mongoose.connection.close();
  });
}

if (process.argv.length < 4) {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

// 3.13: puhelinluettelo ja tietokanta, step1

// Muuta backendin kaikkien puhelintietojen näyttämistä siten, että backend hakee näytettävät puhelintiedot tietokannasta.

// Varmista, että frontend toimii muutosten jälkeen.

// Tee tässä ja seuraavissa tehtävissä Mongoose-spesifinen koodi omaan moduuliinsa samaan tapaan kuin kohdassa Tietokantamäärittelyjen eriyttäminen moduuliksi.
// 3.14: puhelinluettelo ja tietokanta, step2

// Muuta backendiä siten, että uudet numerot tallennetaan tietokantaan. Varmista, että frontend toimii muutosten jälkeen.

// Tässä vaiheessa voit olla välittämättä siitä, onko tietokannassa jo henkilöä, jolla on sama nimi kuin lisättävällä.
