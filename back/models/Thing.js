// MODEL for Thing

/* -------------------------------------------------------------------------- *\
    1) Imports the required elements (node package)
\* -------------------------------------------------------------------------- */

const mongoose = require('mongoose');

/* -------------------------------------------------------------------------- *\
    2) Creates the model (schema) for objects of this class.
\* -------------------------------------------------------------------------- */

const thingSchema = mongoose.Schema(
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: Number, required: true },
});

/* -------------------------------------------------------------------------- *\
    3) Exports the model (schema).
\* -------------------------------------------------------------------------- */

module.exports = mongoose.model('Thing', thingSchema);
