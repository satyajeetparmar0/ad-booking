const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Matrimonial', 'Recruitment', 'Property', 'Education', 'Business', 'Public Notice', 'Obituary', 'Name Change', 'Lost Found', 'Vehicle']
  },
  city: {
    type: String,
    required: true
  },
  newspaperId: {
    type: String,
    required: true
  },
  newspaperName: {
    type: String,
    required: true
  },
  adType: {
    type: String,
    required: true,
    enum: ['Classified Text', 'Classified Display', 'Display Ad']
  },
  adContent: {
    type: String,
    required: true
  },
  adImage: {
    type: String,
    default: ''
  },
  publishDate: {
    type: Date,
    required: true
  },
  wordCount: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    default: ''
  },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BookingNew', bookingSchema);
