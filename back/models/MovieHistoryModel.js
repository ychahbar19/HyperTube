// 1) Import
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); // Supports 'unique: true' property.

/* -------------------------------------------------------------------------- *\
    2) Creates the model (schema) for objects of this class.
\* -------------------------------------------------------------------------- */

// 2) Define
const movieHistorySchema = mongoose.Schema({
  hash: { type: String, required: true, unique: true },
  lastSeen: { type: Number, required: true },
  extension: { type: String, required: true }
});

// 3) Add the plugins
movieHistorySchema.plugin(uniqueValidator);

// 4) Export
module.exports = mongoose.model("MovieHistoryModel", movieHistorySchema);
