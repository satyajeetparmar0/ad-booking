const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const BookingNew = require('../models/BookingNew');
const { authMiddleware } = require('../middleware/auth');
const mongoose = require('mongoose');

// Payment Transaction Schema
const paymentTransactionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: String,
  userEmail: String,
  amount: Number,
  currency: { type: String, default: 'inr' },
  bookingData: Object,
  paymentStatus: { type: String, default: 'pending' },
  status: { type: String, default: 'initiated' },
  paymentId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PaymentTransaction = mongoose.model('PaymentTransaction', paymentTransactionSchema);

// Create Stripe Checkout Session
router.post('/create-checkout', authMiddleware, async (req, res) => {
  try {
    const { bookingData, originUrl } = req.body;

    if (!bookingData || !bookingData.price) {
      return res.status(400).json({ error: 'Booking data with price is required' });
    }

    // Amount is determined server-side from booking data
    const amount = parseFloat(bookingData.price);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid price' });
    }

    const baseUrl = originUrl || process.env.REACT_APP_BACKEND_URL;
    const successUrl = `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/book-now`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${bookingData.category} Ad - ${bookingData.newspaperName}`,
            description: `${bookingData.adType} in ${bookingData.newspaperName}, ${bookingData.city}`
          },
          unit_amount: Math.round(amount * 100) // Convert to paise
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: req.user.userId,
        userEmail: req.user.email,
        category: bookingData.category,
        city: bookingData.city,
        newspaperId: bookingData.newspaperId,
        newspaperName: bookingData.newspaperName,
        adType: bookingData.adType,
        publishDate: bookingData.publishDate,
        price: String(amount)
      }
    });

    // Create payment transaction record
    await PaymentTransaction.create({
      sessionId: session.id,
      userId: req.user.userId,
      userEmail: req.user.email,
      amount: amount,
      currency: 'inr',
      bookingData: bookingData,
      paymentStatus: 'pending',
      status: 'initiated'
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Check payment status
router.get('/checkout-status/:sessionId', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Check if already processed
    const existing = await PaymentTransaction.findOne({ sessionId });
    if (existing && existing.paymentStatus === 'paid') {
      return res.json({
        status: existing.status,
        paymentStatus: existing.paymentStatus,
        bookingId: existing.bookingId
      });
    }

    // Fetch from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const updateData = {
      status: session.status,
      paymentStatus: session.payment_status,
      updatedAt: new Date()
    };

    if (session.payment_intent) {
      updateData.paymentId = session.payment_intent;
    }

    // Update transaction
    await PaymentTransaction.findOneAndUpdate(
      { sessionId },
      updateData
    );

    // If payment is successful and booking not yet created
    if (session.payment_status === 'paid' && existing && existing.paymentStatus !== 'paid') {
      const bd = existing.bookingData;
      const { v4: uuidv4 } = require('uuid');
      const User = require('../models/User');
      const user = await User.findOne({ userId: existing.userId });

      const wordCount = bd.adContent ? bd.adContent.trim().split(/\s+/).length : 0;

      const booking = new BookingNew({
        bookingId: uuidv4(),
        userId: existing.userId,
        userName: user ? user.name : 'User',
        userEmail: existing.userEmail,
        category: bd.category,
        city: bd.city,
        newspaperId: bd.newspaperId,
        newspaperName: bd.newspaperName,
        adType: bd.adType,
        adContent: bd.adContent || '',
        adImage: bd.adImage || '',
        publishDate: bd.publishDate,
        wordCount,
        price: bd.price,
        paymentStatus: 'completed',
        bookingStatus: 'confirmed',
        paymentId: session.payment_intent
      });

      await booking.save();

      // Update transaction with booking reference
      await PaymentTransaction.findOneAndUpdate(
        { sessionId },
        { paymentStatus: 'paid', bookingId: booking.bookingId }
      );

      // Send confirmation email
      try {
        const Resend = require('resend').Resend;
        const resend = new Resend(process.env.RESEND_API_KEY);
        const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

        await resend.emails.send({
          from: senderEmail,
          to: [existing.userEmail],
          subject: `Booking Confirmed - ${bd.category} Ad in ${bd.newspaperName}`,
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
                  <p>Dear <strong>${user ? user.name : 'Customer'}</strong>,</p>
                  <p>Your ad booking has been confirmed successfully!</p>
                  <table style="width:100%; border-collapse:collapse; margin: 20px 0;">
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 12px 0; color: #666;">Booking ID</td>
                      <td style="padding: 12px 0; font-weight: bold; text-align: right;">${booking.bookingId.substring(0, 8).toUpperCase()}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 12px 0; color: #666;">Category</td>
                      <td style="padding: 12px 0; font-weight: bold; text-align: right;">${bd.category}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 12px 0; color: #666;">Newspaper</td>
                      <td style="padding: 12px 0; font-weight: bold; text-align: right;">${bd.newspaperName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 12px 0; color: #666;">City</td>
                      <td style="padding: 12px 0; font-weight: bold; text-align: right;">${bd.city}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 12px 0; color: #666;">Publish Date</td>
                      <td style="padding: 12px 0; font-weight: bold; text-align: right;">${new Date(bd.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                    </tr>
                  </table>
                  <div class="price-box">
                    <div style="color: #666; font-size: 14px;">Amount Paid</div>
                    <div class="price">\u20B9${bd.price}</div>
                  </div>
                  <p style="color: #666; font-size: 13px;">For queries, call <strong>+91 9973634393</strong></p>
                </div>
                <div class="footer">
                  <p>AD ADDA - From Idea to Impact</p>
                </div>
              </div>
            </body>
            </html>
          `
        });
        console.log(`Email sent to ${existing.userEmail}`);
      } catch (emailErr) {
        console.error('Email failed:', emailErr.message);
      }

      return res.json({
        status: 'complete',
        paymentStatus: 'paid',
        bookingId: booking.bookingId
      });
    }

    res.json({
      status: session.status,
      paymentStatus: session.payment_status
    });
  } catch (error) {
    console.error('Check status error:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

// Stripe Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = req.body;

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await PaymentTransaction.findOneAndUpdate(
        { sessionId: session.id },
        { status: 'complete', paymentStatus: 'paid', paymentId: session.payment_intent, updatedAt: new Date() }
      );
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook failed' });
  }
});

module.exports = router;
