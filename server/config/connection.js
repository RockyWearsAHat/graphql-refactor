const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.once("open", async () => {
  const kittySchema = new mongoose.Schema({
    name: String,
  });

  const Kitten = mongoose.model("Kitten", kittySchema);

  await Kitten.create({ name: "Silence" });

  console.log("Connected to the Database");
});

module.exports = mongoose.connection;
