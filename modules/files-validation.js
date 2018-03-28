const Form = require('multipart-data').Form;
const uuid = require('uuid/v1');
const Config = require('../configs/config');

module.exports = function (req, res, next) {
  const form = new Form();

  function fileFilter(file) {
    return Config.fileMimes.indexOf(file.type) !== -1
  }

  form.parse(req, function (err, fields, files) {
    if (!err) {
      if (fields.collectionId && files.image) {
        if (fileFilter(files.image)) {
          if (files.image.size < Config.maxFileSize) {
            let id = uuid();
            let extension = files.image.type.split('/')[1];
            req.fileInfo = {
              name: `${id}.${extension}`,
              id: id,
              title: fields.title ? fields.title : files.image.filename.substring(1, 100),
              extension: extension,
              mime: files.image.type,
              tempPath: files.image.path
            };
            req.fields = fields;
          } else {
            req.fileValidationError = {status: 422, message: 'File is too large'};
          }
        } else {
          req.fileValidationError = {status: 422, message: 'Wrong file type'};
        }
      } else {
        req.fileValidationError = {status: 422, message: 'Collection id and image are required'};
      }
    } else {
      req.fileValidationError = {status: 500, message: 'Server error'}
    }
    next()
  })
};
