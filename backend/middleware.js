const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {useFindAndModify: false ,useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
const bodyParser = require('body-parser');
var sanitize = require('mongo-sanitize');
var SALT_WORK_FACTOR = 10;

db.on('error', console.error.bind(console, 'connection error:'));

const User = require("./userschema");


function save_user(req, resp, next){
    const user = new User();
    if(!req.query.username ||
    !req.query.password ||
    !req.query.email){
      return resp.sendStatus(500);
    }
    user.username = sanitize(req.query.username);
    user.password = user.generateHash(sanitize(req.query.password));
    user.email = sanitize(req.query.email);
    User.find({email: user.email}, (err, previousUsers) => {
      if (err) {
        return resp.sendStatus(500, {
          success: false,
          message: 'Error: Server error'
        });
      }
      else if (previousUsers.length > 0) {
        return resp.sendStatus(405, {
          success: false,
          message: 'Account already exist.'
        });
      }
      else {
        user.signUpDate = Date.now();
        user.save(function (err, user) {
          if (err) {
            return resp.sendStatus(500);
          } else {
            resp.sendStatus(200);
            return user;
          }
        });
      }
    });


  next();
}


function get_profile(req, resp, next){
  if(!req.query.username){
    return resp.sendStatus(500);
  }
  username = sanitize(req.query.username);
  User.findOne({username: username}, function(err, user){
    if (err) return resp.sendStatus(500);
    return resp.send(user);
  });
  next();
}


function search_user(req, resp, next){
  let search_string = sanitize(req.query.search_string);

  User.find({ username: { $regex: search_string, $options: "i" } }, function(err, docs) {
    if(err){
      return resp.sendStatus(500);
      console.log(err);
    }
    else{
      var result = [];
      docs.map(doc => {
          result.push({username: doc.username});
        })
      return resp.send(result);
    }
  });
  next();
}

function send_friend_request(req, resp, next){
  let to_user = sanitize(req.query.toUser);
  let from_user = sanitize(req.query.sessionUser);
  User.findOneAndUpdate(
   {username: to_user},
   { $push: { requests:  from_user} },
    function (error, success) {
          if (error) {
              console.log(error);
          } else {
            User.findOneAndUpdate(
             {username: from_user},
             { $push: { pending:  to_user} },
            function (error, success) {
                  if (error) {
                      console.log(error);
                  } else {
                      return resp.sendStatus(200);
                  }
              });
          }
      });

  next();
}

function accept_request(req, resp, next){
  let to_user = sanitize(req.query.to_user);
  let from_user = sanitize(req.query.from_user);
  User.findOneAndUpdate(
   {username: to_user},
   { $push: { friendlist:  from_user} },
    function (error, success) {
          if (error) {
              console.log(error);
          } else {
            User.findOneAndUpdate(
             {username: from_user},
             { $push: { friendlist: to_user} },
            function (error, success) {
                  if (error) {
                      console.log(error);
                  }
              });
          }
      });
    User.findOneAndUpdate(
     {username: to_user},
     { $pull: { requests:  from_user} },
      function (error, success) {
            if (error) {
                console.log(error);
            } else {
              User.findOneAndUpdate(
               {username: from_user},
               { $pull: { pending: to_user} },
              function (error, success) {
                    if (error) {
                        console.log(error);
                    } else {
                        return resp.sendStatus(200);
                    }
                });
            }
        });

  next();
}

function deny_request(req, resp, next){
  let to_user = sanitize(req.query.to_user);
  let from_user = sanitize(req.query.from_user);
  User.findOneAndUpdate(
   {username: to_user},
   { $pull: { requests:  from_user} },
    function (error, success) {
          if (error) {
              console.log(error);
          } else {
            User.findOneAndUpdate(
             {username: from_user},
             { $pull: { pending: to_user} },
            function (error, success) {
                  if (error) {
                      console.log(error);
                  } else {
                      return resp.sendStatus(200);
                  }
              });
          }
      });
  next();
}

function publish_message(req, resp, next){
  if(!req.query.username ||
  !req.query.from_user ||
  !req.query.message ||
  !req.query.date){
    return resp.sendStatus(500);
  }
  let to_user = sanitize(req.query.username);
  let from_user = sanitize(req.query.from_user);
  let message = sanitize(req.query.message);
  let date = sanitize(req.query.date);
  User.findOneAndUpdate(
   {username: to_user},
   { $push: { messages: {$each: [{message: message, from_user: from_user, date: date}], $position: 0}} },
  function (error, success) {
        if (error) {
            console.log(error);
        } else {
            return resp.sendStatus(200);
        }
    });


  next();
}

function get_all(req, resp, next){
  User.find(function (err, users) {
      if (err) return resp.sendStatus(500);
      resp.send(users);
      return users;
    });
    next();
  }


function delete_all(req, resp, next){
  User.deleteMany({}, function(err, tweets) {
    if (err) return resp.sendStatus(500);
  });
  resp.sendStatus(200);
  next();
};

exports.save_user = save_user;
exports.get_all = get_all;
exports.delete_all = delete_all;
exports.get_profile = get_profile;
exports.publish_message = publish_message;
exports.send_friend_request = send_friend_request;
exports.accept_request = accept_request;
exports.deny_request = deny_request;
exports.search_user = search_user;
