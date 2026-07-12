const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  year: String,
  genre: String,
  type: String,
  img: String,
  row: String,
  progress: Number,
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);