const mongoose = require('mongoose');

const newspaperSchema = new mongoose.Schema({
  newspaperId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  cities: {
    type: [String],
    default: []
  },
  logo: {
    type: String,
    default: ''
  },
  basePrice: {
    type: Number,
    required: true
  },
  pricePerWord: {
    type: Number,
    default: 0
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

module.exports = mongoose.model('Newspaper', newspaperSchema);
