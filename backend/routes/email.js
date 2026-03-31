const express = require('express');
const router = express.Router();
const Resend = require('resend').Resend;

const resend = new Resend(process.env.RESEND_API_KEY);
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

router.post('/send-confirmation', async (req, res) => {
  try {
    const { email, name, bookingId, adTitle, startDate, totalPrice } = req.body;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #002FA7; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #002FA7; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Your booking has been confirmed successfully.</p>
            <h3>Booking Details:</h3>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Ad Service:</strong> ${adTitle}</p>
            <p><strong>Start Date:</strong> ${new Date(startDate).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₹${totalPrice}</p>
            <p>Thank you for choosing AdAdda!</p>
          </div>
          <div class="footer">
            <p>© 2025 AdAdda. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [email],
      subject: `Booking Confirmation - ${adTitle}`,
      html: htmlContent
    });

    res.json({ 
      message: 'Email sent successfully',
      emailId: result.data?.id
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
