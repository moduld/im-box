const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Image', new Schema({
  id: String,
  title: String,
  url: String,
  user: String,
  collectionId: String
}));
