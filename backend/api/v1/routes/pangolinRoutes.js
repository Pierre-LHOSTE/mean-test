const express = require("express");
const api = express.Router();
const Pangolin = require("../models/pangolinModel");

api.get("/pangolins", (req, res) => {
  Pangolin.find({}, (err, pangolins) => {
    if (!err) res.status(200).json({ pangolins });
    else res.status(500).send(err);
  });
});

api.get("/pangolin/:id", (req, res) => {
  Pangolin.findById(req.params.id).select("-password").exec((err, pangolin) => {
    if (!err) res.status(200).json(pangolin);
    else res.status(500).send(err);
  });
});

api.post("/login", (req, res) => {
  const { name, password } = req.body;
  Pangolin.findOne({ name }, (err, pangolin) => {
    if (err) {
      res.status(500).send(err);
    }
    if (!pangolin) {
      res.status(404).json({ message: "Pangolin not found" });
    } else {
      if (pangolin.password == password) {
        res
          .status(200)
          .json({ message: "Login successful", pangolin: pangolin });
      } else {
        res.status(401).json({ message: "Invalid password" });
      }
    }
  });
});

api.post("/add/pangolin", (req, res) => {
  const pangolin = new Pangolin({
    name: req.body.name,
    password: req.body.password,
    friends: [],
    role: req.body.role,
    image:
      "https://picsum.photos/id/" +
      (Math.round(Math.random() * 1000) + 1) +
      "/500/500.jpg",
    createdAt: new Date(),
  });
  pangolin.save((err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json({
        message: "Pangolin created successfully",
        pangolinCreated: result,
      });
    }
  });
});

api.put("/updateRole/pangolin/:id", (req, res) => {
  const id = req.params.id;
  const new_role = req.body;

  Pangolin.findById(id, (err, pangolin) => {
    if (err) {
      res.status(500).send(err);
    }
    if (!pangolin) {
      res.status(404).json({ message: "Pangolin not found", pangolinId: id });
    } else if (pangolin) {
      pangolin.role = new_role.role;

      pangolin.save((err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json({
            message: "Pangolin role updated successfully",
            pangolinUpdated: result,
          });
        }
      });
    }
  });
});

api.put("/addFriend/pangolin/:id", (req, res) => {
  const id = req.params.id;
  const friend = req.body;

  Pangolin.findById(id, (err, pangolin) => {
    if (err) {
      res.status(500).send(err);
    }
    if (!pangolin) {
      res.status(404).json({ message: "Pangolin not found", pangolinId: id });
    } else if (pangolin) {
      pangolin.friends = [...pangolin.friends].concat([friend.new_friend]);

      pangolin.save((err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json({
            message: "Pangolin friend added successfully",
            pangolinUpdated: result,
          });
        }
      });
    }
  });
});

api.put("/deleteFriend/pangolin/:id", (req, res) => {
  const id = req.params.id;
  const friend = req.body;

  Pangolin.findById(id, (err, pangolin) => {
    if (err) {
      res.status(500).send(err);
    }
    if (!pangolin) {
      res.status(404).json({ message: "Pangolin not found", pangolinId: id });
    } else if (pangolin) {
      pangolin.friends = pangolin.friends.filter(function (p) {
        return p !== friend.old_friend;
      });

      pangolin.save((err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json({
            message: "Pangolin friend deleted successfully",
            pangolinUpdated: result,
          });
        }
      });
    }
  });
});

api.delete("/delete/pangolin/:id", (req, res) => {
  const id = req.params.id;
  Pangolin.findByIdAndDelete(id, (err, pangolin) => {
    if (err) {
      res.status(500).send(err);
    }
    if (!pangolin) {
      res.status(404).json({ error: "Pangolin not found" });
    } else if (pangolin) {
      res.status(200).json({
        message: "Pangolin deleted",
        pangolinDeleted: pangolin,
      });
    }
  });
});

module.exports = api;
