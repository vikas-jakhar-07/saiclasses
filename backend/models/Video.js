const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    filename: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Video', VideoSchema);