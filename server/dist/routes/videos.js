"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Video_1 = __importDefault(require("../model/Video"));
const router = express_1.default.Router();
// Get all videos
router.get('/', async (req, res) => {
    try {
        const videos = await Video_1.default.find().sort({ uploadDate: -1 });
        res.json(videos);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching videos' });
    }
});
// Get single video
router.get('/:id', async (req, res) => {
    try {
        const video = await Video_1.default.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        // Increment views
        video.views += 1;
        await video.save();
        res.json(video);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching video' });
    }
});
// Create new video (for demo, we'll use placeholder URLs)
router.post('/', async (req, res) => {
    try {
        const { title, description, videoUrl, thumbnailUrl, duration } = req.body;
        const video = new Video_1.default({
            title,
            description,
            videoUrl: videoUrl || 'https://example.com/sample-video.mp4',
            thumbnailUrl: thumbnailUrl || 'https://via.placeholder.com/320x180',
            duration: duration || 120
        });
        await video.save();
        res.status(201).json(video);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating video' });
    }
});
exports.default = router;
