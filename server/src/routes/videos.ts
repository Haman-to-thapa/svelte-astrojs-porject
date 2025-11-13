import express from 'express';
import Video from '../model/Video';

const router = express.Router();

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadDate: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos' });
  }
});

// Get single video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Increment views
    video.views += 1;
    await video.save();
    
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching video' });
  }
});

// Create new video (for demo, we'll use placeholder URLs)
router.post('/', async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, duration } = req.body;
    
    const video = new Video({
      title,
      description,
      videoUrl: videoUrl || 'https://example.com/sample-video.mp4',
      thumbnailUrl: thumbnailUrl || 'https://via.placeholder.com/320x180',
      duration: duration || 120
    });
    
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error creating video' });
  }
});

export default router;