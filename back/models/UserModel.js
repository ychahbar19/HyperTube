// 1) Import
const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator'); //Supports 'unique: true' property.
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

// 3) Add the plugins
//userSchema.plugin(uniqueValidator);
userSchema.plugin(findOrCreate);

// 4) Export
module.exports = mongoose.model('UserModel', userSchema);
