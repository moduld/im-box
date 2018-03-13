var fs = require('fs');
var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.stat(`./uploads/${req.currentUser._id}`, (err, stat) => {
        if (err) {FsError(err)}
        if (!stat) {
          fs.mkdirSync(`./uploads/${req.currentUser._id}`);
          cb(null, `./uploads/${req.currentUser._id}`);
        } else {
          cb(null, `./uploads/${req.currentUser._id}`);
        }
      })
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, file.originalname);
  }
});

function fileFilter(req, file, cb) {
  cb(null, true);
}

function FsError(err) {

}

var upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports.upload = upload;
