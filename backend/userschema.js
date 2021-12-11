const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
  username: {type: String,
    default: ''},
  email: {type: String,
    default: ''},
  password: {type: String,
    default: ''},
  signUpDate:{
    type: Date,
    default: Date.now()},
  friendlist: {type: [String]},
  pending: {type: [String]},
  requests: {type: [String]},
  messages: [{
    message: {type: [String]},
    from_user: {type: [String]},
    date: {type: Date}
  }]
  });

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', UserSchema);
