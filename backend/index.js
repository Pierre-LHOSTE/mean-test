const express = require("express");
const app = express();
const cors = require("cors");
const api = require("./api/v1/routes/pangolinRoutes");
const db = require("./db");

app.get("/", (req, res) => {
  res.status(200).json({ message: "work", date: new Date() });
});

app.use(cors());
app.use(express.json());
app.use("/api/v1/", api);
  
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
