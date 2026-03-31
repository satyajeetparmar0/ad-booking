const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const BookingNew = require('../models/BookingNew');
const Newspaper = require('../models/Newspaper');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Create new booking
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const {
      category,
      city,
      newspaperId,
      adType,
      adContent,
      adImage,
      publishDate,
      price
    } = req.body;

    // Get newspaper details
    const newspaper = await Newspaper.findOne({ newspaperId });
    if (!newspaper) {
      return res.status(404).json({ error: 'Newspaper not found' });
    }

    // Get user details
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate word count
    const wordCount = adContent.trim().split(/\s+/).length;

    const booking = new BookingNew({
      bookingId: uuidv4(),
      userId: req.user.userId,
      userName: user.name,
      userEmail: user.email,
      category,
      city,
      newspaperId,
      newspaperName: newspaper.name,
      adType,
      adContent,
      adImage: adImage || '',
      publishDate,
      wordCount,
      price
    });

    await booking.save();
    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's bookings
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await BookingNew.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings (admin)
router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await BookingNew.find().sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update booking status (admin)
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { bookingStatus } = req.body;
    
    const booking = await BookingNew.findOneAndUpdate(
      { bookingId: req.params.id },
      { bookingStatus },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update payment status after payment
router.patch('/:id/payment', authMiddleware, async (req, res) => {
  try {
    const { paymentId, paymentStatus } = req.body;
    
    const updateData = { paymentStatus };
    if (paymentId) updateData.paymentId = paymentId;
    if (paymentStatus === 'completed') {
      updateData.bookingStatus = 'confirmed';
    }
    
    const booking = await BookingNew.findOneAndUpdate(
      { bookingId: req.params.id },
      updateData,
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Payment updated', booking });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete booking (admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const booking = await BookingNew.findOneAndDelete({ bookingId: req.params.id });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get revenue stats (admin)
router.get('/stats/revenue', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await BookingNew.find({ paymentStatus: 'completed' });
    
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.price, 0);
    const totalBookings = await BookingNew.countDocuments();
    const paidBookings = bookings.length;
    
    res.json({
      totalRevenue,
      paidBookings,
      totalBookings,
      pendingBookings: totalBookings - paidBookings
    });
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
