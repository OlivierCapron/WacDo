const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage(
  {
    destination : (req , file,  callback) => callback(null, 'uploads/'),
    filename : (req, file, callback) => {
       //test.png => 65465464816-test.png
       const unique = Date.now() + '-'  + Math.round(Math.random() * 100000);
       callback(null, unique + path.extname(file.originalname));
    }
  });

  const fileFilter= (req, file, callback) => {
    // Expression reguliere 
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const isExtensionValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isMimeTypeValid = allowedTypes.test(file.mimetype);
    if(isExtensionValid && isMimeTypeValid)
    {
      callback(null, true);
    }
    else{
      callback(new Error('Seules les images sont autorisées'));
    }
  }


  const upload = multer(
    {
        storage : storage,
        fileFilter : fileFilter,
        limits : {fileSize : 5 * 1024 * 1024}
    }
  );

  module.exports = upload;
  