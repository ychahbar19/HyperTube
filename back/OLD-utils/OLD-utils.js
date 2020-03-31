const multer = require('multer');

const MYME_TYPES = {
    'image/jpg' : 'jpg',
    'image/png' : 'png',
    'image/jpeg' : 'jpeg',
    'image/gif' : 'gif'
  };
  
  const upload = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'assets/images')
    },
    filename: (req, file, callback) => {
      const name = file.originalname.split(' ').join('_');
      const extension = MYME_TYPES[file.mimetype];
      callback(null, name + Date.now() + '.' + extension);
    }
  });
  


  module.exports = multer({ storage: upload, fileFilter: imageFilter }).single('image');