const Form = require('multiparty');
const uuid = require('uuid/v1');
const Config = require('../configs/config');

module.exports = function (req, res, next) {
  let form = new Form.Form();

  function fileFilter(type) {
    return Config.fileMimes.indexOf(type) !== -1
  }

  form.parse(req, function (err, fields, files) {
    if (!err) {
      if (fields.collectionId && files.image) {
        if (fileFilter(files.image[0].headers['content-type'])) {
          if (files.image[0].size < Config.maxFileSize) {
            let id = uuid();
            let extension = files.image[0].headers['content-type'].split('/')[1];
            req.fileInfo = {
              name: `${id}.${extension}`,
              id: id,
              title: fields.title[0] ? fields.title : files.image[0].originalFilename.substring(0, 100),
              extension: extension,
              mime: files.image[0].headers['content-type'],
              tempPath: files.image[0].path
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
