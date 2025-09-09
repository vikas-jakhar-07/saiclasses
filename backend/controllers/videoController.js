const Video = require('../models/Video');
const fs = require('fs');
const path = require('path');

// Get all videos
const getVideos = async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single video
const getVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create video
const createVideo = async (req, res) => {
    try {
        const { title, description, category } = req.body;

        const video = new Video({
            title,
            description,
            category,
            filename: req.file.filename,
            createdBy: req.user.id
        });

        const createdVideo = await video.save();
        res.status(201).json(createdVideo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update video
const updateVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Check if user is the creator or admin
        if (video.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { title, description, category } = req.body;

        const updatedVideo = await Video.findByIdAndUpdate(
            req.params.id,
            { title, description, category },
            { new: true, runValidators: true }
        );

        res.json(updatedVideo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete video
const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Check if user is the creator or admin
        if (video.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Delete the video file from uploads folder
        const videoPath = path.join(__dirname, '../uploads/videos/', video.filename);
        if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
        }

        await Video.findByIdAndDelete(req.params.id);
        res.json({ message: 'Video removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getVideos,
    getVideo,
    createVideo,
    updateVideo,
    deleteVideo,
};