const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/Booking');
const Ad = require('../models/Ad');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Create booking (authenticated users)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { adId, startDate, adContent, paymentId } = req.body;

    // Get ad details
    const ad = await Ad.findOne({ adId });
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    // Get user details
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const booking = new Booking({
      bookingId: uuidv4(),
      userId: req.user.userId,
      adId,
      adTitle: ad.title,
      userName: user.name,
      userEmail: user.email,
      startDate,
      adContent,
      totalPrice: ad.price,
      paymentStatus: paymentId ? 'completed' : 'pending',
      paymentId: paymentId || '',
      status: paymentId ? 'confirmed' : 'pending'
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's bookings
router.get('/my-bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings (admin only)
router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update booking status (admin only)
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findOneAndUpdate(
      { bookingId: req.params.id },
      { status },
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

// Delete booking (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ bookingId: req.params.id });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get revenue stats (admin only)
router.get('/stats/revenue', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ paymentStatus: 'completed' });
    
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const totalBookings = bookings.length;
    const allBookingsCount = await Booking.countDocuments();
    
    res.json({
      totalRevenue,
      paidBookings: totalBookings,
      totalBookings: allBookingsCount,
      pendingBookings: allBookingsCount - totalBookings
    });
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
