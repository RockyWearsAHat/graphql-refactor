const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/googlebooks";

mongoose.connect(uri);

mongoose.connection.once("open", async () => {
  console.log("Connected to the Database");
});

module.exports = mongoose.connection;
