const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require("../api/v1/models/pangolinModel");

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ name: username })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Nom d\'utilisateur ou mot de passe incorrect' });
          }
        });
      })
      .catch(err => done(err));
  })
);