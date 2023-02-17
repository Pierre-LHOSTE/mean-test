const mongoose = require("mongoose");

const pangolinShema = new mongoose.Schema({
  name: { type: String, unique: true },
  password: { type: String },
  role: { type: String },
  friends: { type: Array },
  image: { type: String },
  createdAt: { type: Date },
});

const Pangolin = mongoose.model("Pangolin", pangolinShema);

module.exports = Pangolin;
