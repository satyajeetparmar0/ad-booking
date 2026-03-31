const express = require('express');
const router = express.Router();
const Newspaper = require('../models/Newspaper');

// Get all active newspapers
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    
    let query = { isActive: true };
    if (city) {
      query.cities = city;
    }
    
    const newspapers = await Newspaper.find(query).sort({ name: 1 });
    res.json({ newspapers });
  } catch (error) {
    console.error('Get newspapers error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get newspapers by city
router.get('/by-city/:city', async (req, res) => {
  try {
    const newspapers = await Newspaper.find({
      cities: req.params.city,
      isActive: true
    }).sort({ name: 1 });
    
    res.json({ newspapers });
  } catch (error) {
    console.error('Get newspapers by city error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all cities (unique from all newspapers)
router.get('/cities', async (req, res) => {
  try {
    const newspapers = await Newspaper.find({ isActive: true });
    const citiesSet = new Set();
    
    newspapers.forEach(newspaper => {
      newspaper.cities.forEach(city => citiesSet.add(city));
    });
    
    const cities = Array.from(citiesSet).sort();
    res.json({ cities });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
