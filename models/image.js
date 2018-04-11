const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Image', new Schema({
  name: String,
  id: String,
  title: String,
  user: String,
  collectionId: String,
  path: String,
  mime: String,
  isThumbnail: Boolean
}));
