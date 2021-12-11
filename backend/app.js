var middleware = require("./middleware");
const bodyParser = require('body-parser');
const express = require("express");
const path = require("path");
const app = express();
const port = 5000;
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportconfig")(passport);


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send("index response");
});


app.get('/search_user', middleware.search_user, function(req, res) {
})

app.post("/save", middleware.save_user, function(req, res){
});

app.get("/user", (req, res) => {
  res.send(req.user);
});

app.post("/friendrequest", middleware.send_friend_request, (req, res) => {
});

app.post("/acceptrequest", middleware.accept_request, (req, res) => {
})

app.post("/denyrequest", middleware.deny_request, function(req, res){
});

app.post("/publishmessage", middleware.publish_message, function(req, res){
});

app.get("/getprofile", middleware.get_profile, function(req, res){
});

app.post("/login", function(req, res, next){
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      res.send({auth: false});
    }
    if (!user){
      res.send({auth: false});
    }
    else {
      req.login(user, (err) => {
        if (err) throw err;
        res.send({auth: true, user: user.username});
      });
    }
  })(req, res, next);
});

app.post('/logout', function(req, res){
  req.logout();
  res.redirect('/');

});

app.get("/getall", middleware.get_all, function(req, res){
});

app.get("/deleteall", middleware.delete_all, function(req, res){
});

app.get("*", (req, res) => {
  res.status(404).send("Page does not exist.")
});

app.listen(port, error => (
  error
    ? console.error(error)
    : console.info(`Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`)
));

module.exports = app;
