const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Collection', new Schema({
  id: String,
  title: String,
  thumbnail: String,
  user: String
}));
