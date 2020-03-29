// 1) Import
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // Supports 'unique: true' property.
const findOrCreate = require('mongoose-findorcreate');

/* -------------------------------------------------------------------------- *\
    2) Creates the model (schema) for objects of this class.
\* -------------------------------------------------------------------------- */

// 2) Define
const userSchema = mongoose.Schema({
  /*
  active: { type: Boolean, default: false },
  avatar: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  randomStr: { type: String }
  */
 active: { type: Boolean, default: false },
 avatar: { type: String },
 firstName: { type: String },
 lastName: { type: String },
 email: { type: String, unique: true },
 username: { type: String, unique: true },
 password: { type: String },
 randomStr: { type: String },
 fortytwoId: String
});

// 3) Add the plugins
userSchema.plugin(uniqueValidator);
userSchema.plugin(findOrCreate);

// 4) Export
module.exports = mongoose.model('UserModel', userSchema);