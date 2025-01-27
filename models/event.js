const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  description: { type: String, required: true }, 
  date: { type: Date, required: true }, 
  time: { type: String, required: true }, 
  venue: { type: String, required: true }, 
  moreInfo: { type: String }, 
  image: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('Event', eventSchema);
