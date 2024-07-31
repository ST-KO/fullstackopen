const mongoose = require("mongoose");

if (process.env.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://scytherock74:${password}@cluster0.gfwaidq.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const peopleSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const People = mongoose.model("People", peopleSchema);

if (process.argv.length > 3) {
  const people = new People({
    name: process.argv[3],
    number: process.argv[4],
  });

  people.save().then((result) => {
    console.log(
      `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
    );
    mongoose.connection.close();
  });
} else {
  People.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((people) => {
      console.log(`${people.name} ${people.number}`);
    });
    mongoose.connection.close();
  });
}
