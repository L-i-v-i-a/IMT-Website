const News = require('../models/news');

exports.addNews = async (req, res) => {
  try {
    const { title, description, content } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newNews = new News({
      title,
      description,
      content,
      date: new Date(),
      image: req.file ? `uploads/${req.file.filename}` : null, 
    });

    await newNews.save();
    res.status(201).json({
      message: 'News added successfully!',
      news: {
        ...newNews.toObject(),
        image: newNews.image
          ? `http://localhost:3000/${newNews.image}`
          : null, 
      },
    });
  } catch (error) {
    console.error('Error adding news:', error);
    res.status(500).json({ error: 'Server error while adding news.' });
  }
};

exports.getNews = async (req, res) => {
  try {
    const newsList = await News.find();

    const updatedNewsList = newsList.map(news => ({
      ...news.toObject(),
      image: news.image
        ? `http://localhost:3000/${news.image}`
        : null, 
    }));

    res.status(200).json(updatedNewsList);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Server error while fetching news.' });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ error: 'News not found.' });
    }

    res.status(200).json({
      ...news.toObject(),
      image: news.image
        ? `http://localhost:3000/${news.image}`
        : null, 
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Server error while fetching news.' });
  }
};

exports.editNews = async (req, res) => {
  try {
    const { title, description, content } = req.body;

    const updateFields = {
      title,
      description,
      content,
      date: new Date(), 
    };

    if (req.file) {
      updateFields.image = `uploads/${req.file.filename}`;
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ error: 'News not found.' });
    }

    res.status(200).json({
      message: 'News updated successfully!',
      news: {
        ...updatedNews.toObject(),
        image: updatedNews.image
          ? `http://localhost:3000/${updatedNews.image}`
          : null, 
      },
    });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: 'Server error while updating news.' });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);

    if (!deletedNews) {
      return res.status(404).json({ error: 'News not found.' });
    }

    res.status(200).json({ message: 'News deleted successfully!' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Server error while deleting news.' });
  }
};
