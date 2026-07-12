const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  watchedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number, // percentage or minute watched
    default: 0
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
}, { timestamps: true });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);

