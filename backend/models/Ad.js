const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  adId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Newspaper', 'Radio', 'TV', 'Digital']
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: ''
  },
  features: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ad', adSchema);
