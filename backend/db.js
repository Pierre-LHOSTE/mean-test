const mongoose = require("mongoose");

const db_url = "mongodb://localhost:27017/pangolinsdb";

mongoose.connect(db_url, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  family: 4,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("Failed to connect to MongoDB: " + err);
});

