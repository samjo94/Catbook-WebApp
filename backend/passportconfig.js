const User = require("./userschema");
const bcrypt = require("bcrypt");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;



module.exports = function (passport) {
  passport.use(
    new localStrategy({
    usernameField: 'email',
    passwordField: 'password'},
    function(username, password, done){
      User.findOne({ email: username }, (err, user) => {
        if (err) throw err;
        if (!user) return done(null, false);

        if (!user.validPassword(password)) {
          return done(null, false);
        }
        else {
          return done(null, user);
        }
      });
    })
  );

  passport.serializeUser((user, callback) => {
     callback(null, user.id);
   });
   passport.deserializeUser((id, callback) => {
     User.findOne({ _id: id }, (err, user) => {
       const userInformation = {
         username: user.username,
       };
       callback(err, userInformation);
     });
   });
};
