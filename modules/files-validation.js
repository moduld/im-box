const Form = require('multiparty');
const uuid = require('uuid/v1');
const Config = require('../configs/config');

module.exports = function (req, res, next) {
  let form = new Form.Form();

  function fileFilter(file) {
    return Config.fileMimes.indexOf(file.headers['content-type']) !== -1 && file.size < Config.maxFileSize
  }

  form.parse(req, function (err, fields, files) {
    if (!err) {
      if (fields.collectionId[0] && Array.isArray(files.images) && files.images.length) {
        let fileInfo = [];
        for (let i = 0; i < files.images.length; i++) {
          if (fileFilter(files.images[i])) {
              let id = uuid();
              let extension = files.images[i].headers['content-type'].split('/')[1];
              fileInfo.push({
                name: `${id}.${extension}`,
                id: id,
                title: files.images[i].originalFilename.substring(0, 100),
                extension: extension,
                mime: files.images[i].headers['content-type'],
                tempPath: files.images[i].path
              });
          }
        }
        if (fileInfo.length) {
          req.fileInfo = fileInfo;
          req.collectionId = fields.collectionId[0];
        } else {
          req.fileValidationError = {status: 422, message: 'All files have wrong format or are too large'};
        }
      } else {
        req.fileValidationError = {status: 422, message: 'Collection id and images are required'};
      }
    } else {
      req.fileValidationError = {status: 500, message: 'Server error'}
    }
    next()
  })
};
