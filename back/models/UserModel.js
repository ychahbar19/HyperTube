// 1) Import
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //Supports 'unique: true' property.
//const findOrCreate = require('mongoose-findorcreate');

// 2) Define
const userSchema = mongoose.Schema(
{
    /*
    email: String,
    username: String,
    avatar: String,
    first_name: String,
    last_name: String,
    password: String,
    preferred_language: { type: String, default: 'EN' },
    fortytwoId: String
    */
   firstName: { type: String, required: true },
   lastName: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   username: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   active: { type: Boolean, default: false },
   randomStr: { type: String }
});


// 3) Add the plugins
userSchema.plugin(uniqueValidator);
//userSchema.plugin(findOrCreate);

// 4) Export
module.exports = mongoose.model('UserModel', userSchema);