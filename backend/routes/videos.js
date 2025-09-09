const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Video = require('../models/Video');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/videos/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /mp4|avi|mov|wmv/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Videos only!');
        }
    }
});

// Get all videos
router.get('/', async (req, res) => {
    try {
        const videos = await Video.find().populate('createdBy', 'username');
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single video
router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id).populate('createdBy', 'username');
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload video (admin only)
router.post('/', auth, upload.single('video'), async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { title, description, category } = req.body;

        const video = new Video({
            title,
            description,
            filename: req.file.filename,
            category,
            createdBy: req.user.id
        });

        await video.save();
        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update video (admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { title, description, category } = req.body;
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            { title, description, category },
            { new: true }
        );

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.json(video);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete video (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const video = await Video.findByIdAndDelete(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;