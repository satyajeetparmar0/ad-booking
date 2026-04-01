require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const adRoutes = require('./routes/ads');
const bookingRoutes = require('./routes/bookings');
const bookingsNewRoutes = require('./routes/bookingsNew');
const newspaperRoutes = require('./routes/newspapers');
const uploadRoutes = require('./routes/upload');
const emailRoutes = require('./routes/email');
const paymentRoutes = require('./routes/payment');
const { initStorage } = require('./services/storage');

const app = express();
const PORT = 8001;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGINS || '*' }));

// Stripe webhook needs raw body - must be before express.json()
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

mongoose.connect(`${MONGO_URL}/${DB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  // Initialize storage on startup
  initStorage().then(() => {
    console.log('✅ Storage initialized');
  }).catch(err => {
    console.error('⚠️ Storage init failed:', err.message);
  });
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'AdAdda API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/bookings-new', bookingsNewRoutes);
app.use('/api/newspapers', newspaperRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/payment', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
