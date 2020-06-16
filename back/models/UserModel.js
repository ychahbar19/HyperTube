// 1) Import
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // Supports 'unique: true' property.
const findOrCreate = require('mongoose-findorcreate');

// 2) Define
const userSchema = mongoose.Schema({
  active: { type: Boolean, default: false },
  provider: { type: String, default: 'HyperTube' },
  providerId: { type: String },
  avatar: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  language: { type: String, default: 'en' },
  randomStr: { type: String },
  movieHistory: {type: Array, default: null}
});

// 3) Add the plugins
userSchema.plugin(uniqueValidator);
userSchema.plugin(findOrCreate);

// 4) Export
module.exports = mongoose.model('UserModel', userSchema);