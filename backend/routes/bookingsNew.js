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

    // Send email confirmation on successful payment
    if (paymentStatus === 'completed' && booking.userEmail) {
      try {
        const Resend = require('resend').Resend;
        const resend = new Resend(process.env.RESEND_API_KEY);
        const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

        await resend.emails.send({
          from: senderEmail,
          to: [booking.userEmail],
          subject: `Booking Confirmed - ${booking.category} Ad in ${booking.newspaperName}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; }
                .header { background: linear-gradient(135deg, #F97316, #EAB308); color: white; padding: 30px 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; }
                .content { padding: 30px 20px; background: #ffffff; }
                .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
                .detail-label { color: #666; font-size: 14px; }
                .detail-value { font-weight: bold; color: #333; font-size: 14px; }
                .price-box { background: #FFF7ED; border: 2px solid #F97316; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                .price { font-size: 32px; font-weight: bold; color: #F97316; }
                .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; background: #f9f9f9; }
                .success-badge { display: inline-block; background: #22C55E; color: white; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: bold; margin-top: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>AD ADDA</h1>
                  <p style="margin: 5px 0 0; opacity: 0.9;">Booking Confirmation</p>
                  <div class="success-badge">PAYMENT SUCCESSFUL</div>
                </div>
                <div class="content">
                  <p>Dear <strong>${booking.userName}</strong>,</p>
                  <p>Your ad booking has been confirmed successfully! Here are your booking details:</p>
                  
                  <table style="width:100%; border-collapse:collapse; margin: 20px 0;">
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 12px 0; color: #666;">Booking ID</td>
                      <td style="padding: 12px 0; font-weight: bold; text-align: right;">${booking.bookingId.substring(0, 8).toUpperCase()}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 12px 0; color: #666;">Category</td>
                      <td style="padding: 12px 0; font-weight: bold; text-align: right;">${booking.category}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 12px 0; color: #666;">Newspaper</td>
                      <td style="padding: 12px 0; font-weight: bold; text-align: right;">${booking.newspaperName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 12px 0; color: #666;">City</td>
                      <td style="padding: 12px 0; font-weight: bold; text-align: right;">${booking.city}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 12px 0; color: #666;">Ad Type</td>
                      <td style="padding: 12px 0; font-weight: bold; text-align: right;">${booking.adType}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 12px 0; color: #666;">Publish Date</td>
                      <td style="padding: 12px 0; font-weight: bold; text-align: right;">${new Date(booking.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #666;">Payment ID</td>
                      <td style="padding: 12px 0; font-weight: bold; text-align: right;">${paymentId}</td>
                    </tr>
                  </table>

                  <div class="price-box">
                    <div style="color: #666; font-size: 14px;">Amount Paid</div>
                    <div class="price">${'\u20B9'}${booking.price}</div>
                  </div>

                  <p style="color: #666; font-size: 13px;">Your ad will be published on the selected date. You can track your booking status from your dashboard.</p>
                  <p style="color: #666; font-size: 13px;">For any queries, call us at <strong>+91 9973634393</strong></p>
                </div>
                <div class="footer">
                  <p>AD ADDA - From Idea to Impact: Your One-Stop Ad Solution</p>
                  <p>&copy; 2025 AD ADDA. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `
        });
        console.log(`✅ Confirmation email sent to ${booking.userEmail}`);
      } catch (emailErr) {
        console.error('⚠️ Email send failed:', emailErr.message);
      }
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
