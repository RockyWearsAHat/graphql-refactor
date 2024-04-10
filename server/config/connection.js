const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

mongoose.connect(uri);

mongoose.connection.once("open", async () => {
  console.log("Connected to the Database");
});

module.exports = mongoose.connection;
