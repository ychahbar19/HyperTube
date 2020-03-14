// 1) Import
const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');
const findOrCreate = require('mongoose-findorcreate');

// 2) Define
const userSchema = mongoose.Schema(
{
  //email: { type: String, required: true, unique: true },
  email: String,
  username: String,
  avatar: String,
  first_name: String,
  last_name: String,
  password: String,
  preferred_language: { type: String, default: 'EN' },
  fortytwoId: String
});

//Adds mongoose's uniqueValidator plugin to support 'unique: true' property.
//userSchema.plugin(uniqueValidator);

userSchema.plugin(findOrCreate);

// 3) Export
module.exports = mongoose.model('UserModel', userSchema);
