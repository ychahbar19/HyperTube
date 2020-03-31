// MIDDLEWARE to manage file inputs.

/* -------------------------------------------------------------------------- *\
    1) Imports the required elements (node package)
\* -------------------------------------------------------------------------- */

const multer = require('multer');

/* -------------------------------------------------------------------------- *\
    2) Defines a 'library' for file types and the storage function.
\* -------------------------------------------------------------------------- */

const MIME_TYPES =
{
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage(
{
  destination: (req, file, callback) => { callback(null, 'images'); },
  filename: (req, file, callback) =>
  {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

/* -------------------------------------------------------------------------- *\
    3) Exports the storage function for .........
\* -------------------------------------------------------------------------- */

module.exports = multer({ storage: storage }).single('image');
