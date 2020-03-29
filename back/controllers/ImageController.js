/* -------------------------------------------------------------------------- *\
    1) Imports and variable definitions.
\* -------------------------------------------------------------------------- */

const multer = require('multer');

const MIME_TYPE_MAP =
{
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg'
};

/* -------------------------------------------------------------------------- *\
    2) Storage function.
\* -------------------------------------------------------------------------- */

exports.storage = multer.diskStorage(
{
  destination: (req, file, callback) =>
  {
    let error = null;
    if (!MIME_TYPE_MAP[file.mimetype])
      error = new Error("invalid mimetype");
    callback(error, "assets/pictures");
  },
  filename: (req, file, callback) =>
  {
    const name = file.originalname.replace("." + MIME_TYPE_MAP[file.mimetype], "").toLocaleLowerCase().replace(' ', '-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    req.body.avatar = name + '-' + Date.now() + '.' + ext;
    callback(null, req.body.avatar);
  }
});