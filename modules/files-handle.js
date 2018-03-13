const fs = require('fs');
const multer  = require('multer');
const path = require('path');
const uuid = require('uuid/v1');
const Mimes = require('../configs/config').fileMimes;

  let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      fs.open(path.join(__dirname, `../uploads/${req.currentUser._id}`),'r', (err, fd) => {
        if (err) {
          if (err.code === 'ENOENT'){
            fs.mkdirSync(`./uploads/${req.currentUser._id}`);
            cb(null, `./uploads/${req.currentUser._id}`);
          }
        }
        if (fd) {
          cb(null, `./uploads/${req.currentUser._id}`);
        }
      })
    },
    filename: function (req, file, cb) {
      let id = uuid();
      let extension = file.mimetype.split('/')[1];
      file.id = id;
      cb(null, `${id}.${extension}`);
    }
  });

  function fileFilter(req, file, cb) {
    if (Mimes.indexOf(file.mimetype) !== -1) {
      cb(null, true);
    } else {
      req.fileValidationError = 'goes wrong on the mimetype';
      cb(null, false);
    }
  }

module.exports = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 10485760 } });
