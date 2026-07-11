const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, required: true },
    year: { type: Number },
    rating: { type: Number, default: 0 },
    type: { type: String, enum: ['movie', 'series'], default: 'movie' },
    videoUrl: { type: String },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);