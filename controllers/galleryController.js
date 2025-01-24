const Gallery = require('../models/gallery');

exports.addGalleryImage = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!caption) {
      return res.status(400).json({ error: 'Caption is required.' });
    }

    const newGalleryImage = new Gallery({
      caption,
      image: req.file ? `uploads/${req.file.filename}` : null, 
    });

    await newGalleryImage.save();
    res.status(201).json({
      message: 'Gallery image added successfully!',
      galleryImage: {
        ...newGalleryImage.toObject(),
        image: newGalleryImage.image
          ? `http://localhost:3000/${newGalleryImage.image}`
          : null, 
      },
    });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    res.status(500).json({ error: 'Server error while adding gallery image.' });
  }
};

exports.getGalleryImages = async (req, res) => {
  try {
    const galleryImages = await Gallery.find();

    const updatedGalleryImages = galleryImages.map(image => ({
      ...image.toObject(),
      image: image.image
        ? `http://localhost:3000/${image.image}`
        : null, 
    }));

    res.status(200).json(updatedGalleryImages);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ error: 'Server error while fetching gallery images.' });
  }
};

exports.getGalleryImageById = async (req, res) => {
  try {
    const galleryImage = await Gallery.findById(req.params.id);

    if (!galleryImage) {
      return res.status(404).json({ error: 'Gallery image not found.' });
    }

    res.status(200).json({
      ...galleryImage.toObject(),
      image: galleryImage.image
        ? `http://localhost:3000/${galleryImage.image}`
        : null, 
    });
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    res.status(500).json({ error: 'Server error while fetching gallery image.' });
  }
};

exports.editGalleryImage = async (req, res) => {
  try {
    const { caption } = req.body;

    const updateFields = { caption };

    if (req.file) {
      updateFields.image = `uploads/${req.file.filename}`;
    }

    const updatedGalleryImage = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedGalleryImage) {
      return res.status(404).json({ error: 'Gallery image not found.' });
    }

    res.status(200).json({
      message: 'Gallery image updated successfully!',
      galleryImage: {
        ...updatedGalleryImage.toObject(),
        image: updatedGalleryImage.image
          ? `http://localhost:3000/${updatedGalleryImage.image}`
          : null, 
      },
    });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ error: 'Server error while updating gallery image.' });
  }
};

exports.deleteGalleryImage = async (req, res) => {
  try {
    const deletedGalleryImage = await Gallery.findByIdAndDelete(req.params.id);

    if (!deletedGalleryImage) {
      return res.status(404).json({ error: 'Gallery image not found.' });
    }

    res.status(200).json({ message: 'Gallery image deleted successfully!' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: 'Server error while deleting gallery image.' });
  }
};
