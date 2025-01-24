// routes/searchRoutes.js
const express = require('express');
const Course = require('../models/course');
const News = require('../models/news');
const Gallery = require('../models/gallery');

const router = express.Router();

// General search route
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || ''; // Search term
    const regex = new RegExp(query, 'i'); // Case-insensitive regex for search

    // Search in courses
    const courses = await Course.find({
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } }
      ]
    });

    // Search in news
    const news = await News.find({
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { content: { $regex: regex } }
      ]
    });

    // Search in gallery
    const gallery = await Gallery.find({
      caption: { $regex: regex }
    });

    // Combine results from all collections
    res.status(200).json({ courses, news, gallery });
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

module.exports = router;
