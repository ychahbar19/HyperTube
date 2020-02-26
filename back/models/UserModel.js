// MODEL for User

/* -------------------------------------------------------------------------- *\
    1) Imports the required elements (node packages)
\* -------------------------------------------------------------------------- */

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/* -------------------------------------------------------------------------- *\
    2) Creates the model (schema) for objects of this class.
\* -------------------------------------------------------------------------- */

const userSchema = mongoose.Schema(
{
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//Adds mongoose's uniqueValidator plugin to support 'unique: true' property.
userSchema.plugin(uniqueValidator);

/* -------------------------------------------------------------------------- *\
    3) Exports the model (schema).
\* -------------------------------------------------------------------------- */

module.exports = mongoose.model('User', userSchema);




// userExists(user) {
//     connection db -> check if user exists in db
//     return true or false;
// }