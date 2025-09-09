const multer = require('multer');
const path = require('path');

// Storage configuration for videos
const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/videos/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

// Storage configuration for thumbnails
const thumbnailStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/thumbnails/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

// File filter for videos
const videoFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed!'), false);
    }
};

// File filter for images
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const uploadVideo = multer({
    storage: videoStorage,
    fileFilter: videoFilter,
    limits: {
        fileSize: 100000000 // 100MB limit
    }
});

const uploadThumbnail = multer({
    storage: thumbnailStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5000000 // 5MB limit
    }
});

module.exports = { uploadVideo, uploadThumbnail };