const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Ad = require('../models/Ad');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all ads (public)
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, location, search } = req.query;
    
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const ads = await Ad.find(query).sort({ createdAt: -1 });
    res.json({ ads });
  } catch (error) {
    console.error('Get ads error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single ad (public)
router.get('/:id', async (req, res) => {
  try {
    const ad = await Ad.findOne({ adId: req.params.id });
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }
    res.json({ ad });
  } catch (error) {
    console.error('Get ad error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create ad (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, category, price, location, imageUrl, duration, features } = req.body;

    const ad = new Ad({
      adId: uuidv4(),
      title,
      description,
      category,
      price,
      location,
      imageUrl: imageUrl || '',
      duration: duration || '',
      features: features || []
    });

    await ad.save();
    res.status(201).json({ message: 'Ad created successfully', ad });
  } catch (error) {
    console.error('Create ad error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update ad (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, category, price, location, imageUrl, duration, features, isActive } = req.body;

    const ad = await Ad.findOneAndUpdate(
      { adId: req.params.id },
      { title, description, category, price, location, imageUrl, duration, features, isActive },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    res.json({ message: 'Ad updated successfully', ad });
  } catch (error) {
    console.error('Update ad error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete ad (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const ad = await Ad.findOneAndDelete({ adId: req.params.id });
    
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }

    res.json({ message: 'Ad deleted successfully' });
  } catch (error) {
    console.error('Delete ad error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
