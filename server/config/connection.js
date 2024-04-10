const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/googlebooks"
);

mongoose.connection.once("open", async () => {
  const kittySchema = new mongoose.Schema({
    name: String,
  });

  const Kitten = mongoose.model("Kitten", kittySchema);

  await Kitten.create({ name: "Silence" });

  console.log("Connected to the Database");
});

module.exports = mongoose.connection;
