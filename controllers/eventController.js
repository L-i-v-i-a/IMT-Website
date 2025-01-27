const Event = require('../models/event'); 

exports.addEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue, moreInfo } = req.body;

    if (!title || !description || !date || !time || !venue) {
      return res.status(400).json({ error: 'All required fields must be filled.' });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      venue,
      moreInfo,
      image: req.file ? `uploads/${req.file.filename}` : null, 
    });

    await newEvent.save();
    res.status(201).json({
      message: 'Event added successfully!',
      event: {
        ...newEvent.toObject(),
        image: newEvent.image
          ? `http://localhost:3000/${newEvent.image}`
          : null, 
      },
    });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Server error while adding the event.' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();

    const updatedEvents = events.map(event => ({
      ...event.toObject(),
      image: event.image
        ? `http://localhost:3000/${event.image}`
        : null, 
    }));

    res.status(200).json(updatedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Server error while fetching events.' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    res.status(200).json({
      ...event.toObject(),
      image: event.image
        ? `http://localhost:3000/${event.image}`
        : null,
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Server error while fetching event.' });
  }
};

exports.editEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue, moreInfo } = req.body;

    const updateFields = {
      title,
      description,
      date,
      time,
      venue,
      moreInfo,
    };

    if (req.file) {
      updateFields.image = `uploads/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    res.status(200).json({
      message: 'Event updated successfully!',
      event: {
        ...updatedEvent.toObject(),
        image: updatedEvent.image
          ? `http://localhost:3000/${updatedEvent.image}`
          : null, 
      },
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Server error while updating the event.' });
  }
};


exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    res.status(200).json({ message: 'Event deleted successfully!' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Server error while deleting the event.' });
  }
};


exports.searchEvents = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    const events = await Event.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { venue: { $regex: query, $options: 'i' } },
      ],
    });

    const updatedEvents = events.map(event => ({
      ...event.toObject(),
      image: event.image
        ? `http://localhost:3000/${event.image}`
        : null,
    }));

    res.status(200).json(updatedEvents);
  } catch (error) {
    console.error('Error searching events:', error);
    res.status(500).json({ error: 'Server error while searching events.' });
  }
};
