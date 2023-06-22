const express = require("express");
const api = express.Router();
const Pangolin = require("../models/pangolinModel");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

api.post("/add/pangolin", (req, res) => {
  console.log("add");

  const { name, password } = req.body;

  console.log(name, password);

  // Vérifiez si l'utilisateur existe déjà dans la base de données
  Pangolin.findOne({ name: name })
    .then((user) => {
      if (user) {
        // L'utilisateur existe déjà
        return res.status(400).json({ message: "Already registered" });
      } else {
        // Créez un nouvel utilisateur
        const newUser = new Pangolin({
          name: name,
          password: password,
          friends: [],
          role: req.body.role,
          image:
            "https://picsum.photos/id/" +
            (Math.round(Math.random() * 1000) + 1) +
            "/500/500.jpg",
          createdAt: new Date(),
        });

        // Générez un sel pour le hachage du mot de passe
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;

          // Hachez le mot de passe avec le sel
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            // Enregistrez le mot de passe haché dans la base de données
            newUser.password = hash;
            newUser
              .save()
              .then((result) => {
                res.status(201).json({
                  message: "Pangolin created successfully",
                  pangolinCreated: result,
                });
              })
              .catch((err) => console.log(err));
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

/*
// Route pour la connexion
api.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) {
      return res.status(400).json({ message: "Wrong" });
    }
    req.logIn(user, err => {
      if (err) throw err;
      res.json({ message: "Connected"});
    });
  })(req, res, next);
});

*/

api.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    if (!user) {
      return res.status(400).json({ message: "Wrong" });
    }
    req.logIn(user, (err) => {
      let token;
      let expiresIn = "1h";
      const pangolin = Object.assign({}, user._doc);
      delete pangolin.password;
      console.log("user:");
      console.log(pangolin);

      try {
        token = jwt.sign(
          { ...pangolin },
          "secretkeyappearshere",
          { expiresIn: expiresIn }
        );
      } catch (err) {
        console.log(err);
        const error = new Error("Error! Something went wrong.");
        return next(error);
      }
      console.log(token);
      return res
        .status(200)
        .json({
          message: "Login successful",
          pangolin: pangolin,
          token: token,
          expiresIn: expiresIn,
        });
    });
  })(req, res, next);
});


api.get("/accessResource", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res
      .status(200)
      .json({ success: false, message: "Error! Token was not provided." });
  }
  const decodedToken = jwt.verify(token, "secretkeyappearshere");
  res
    .status(200)
    .json({
      success: true,
      data: { ...decodedToken },
    });
});

/*


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


*/

api.get("/pangolins", (req, res) => {
  Pangolin.find({}, (err, pangolins) => {
    if (!err) res.status(200).json({ pangolins });
    else res.status(500).send(err);
  });
});

api.get("/pangolin/:id", (req, res) => {
  Pangolin.findById(req.params.id)
    .select("-password")
    .exec((err, pangolin) => {
      if (!err) res.status(200).json(pangolin);
      else res.status(500).send(err);
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
  const friend = JSON.parse(req.body.new_friend);

  Pangolin.findById(id, (err, pangolin) => {
    if (err) {
      res.status(500).send(err);
    }
    if (!pangolin) {
      res.status(404).json({ message: "Pangolin not found", pangolinId: id });
    } else if (pangolin) {
      pangolin.friends = [...pangolin.friends].concat([friend]);
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
        return p._id !== friend.old_friend;
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
