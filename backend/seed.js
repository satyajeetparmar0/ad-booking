require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const User = require('./models/User');
const Ad = require('./models/Ad');

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

const seedData = async () => {
  try {
    await mongoose.connect(`${MONGO_URL}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('🔗 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Ad.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create admin user
    const adminUser = new User({
      userId: uuidv4(),
      name: 'Admin User',
      email: 'admin@adadda.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✅ Admin user created: admin@adadda.com / admin123');

    // Create client user
    const clientUser = new User({
      userId: uuidv4(),
      name: 'John Doe',
      email: 'client@adadda.com',
      password: 'client123',
      role: 'client'
    });
    await clientUser.save();
    console.log('✅ Client user created: client@adadda.com / client123');

    // Create sample ads
    const sampleAds = [
      {
        adId: uuidv4(),
        title: 'Times of India - Full Page Ad',
        description: 'Premium full-page advertisement in Times of India. Reach millions of readers across India.',
        category: 'Newspaper',
        price: 50000,
        location: 'Mumbai',
        imageUrl: 'https://images.unsplash.com/photo-1736248991839-67d11f7a5643?w=800',
        duration: '1 Day',
        features: ['Full Page', 'Color Print', 'National Edition', 'Prime Position']
      },
      {
        adId: uuidv4(),
        title: 'Radio City 91.1 FM - Prime Slot',
        description: 'Advertise during peak morning hours on Radio City. Perfect for brand awareness.',
        category: 'Radio',
        price: 15000,
        location: 'Delhi',
        imageUrl: 'https://images.pexels.com/photos/5061702/pexels-photo-5061702.jpeg?w=800',
        duration: '30 Seconds',
        features: ['Morning Slot', 'High Listenership', 'Repeat Plays', 'Professional Voice-over']
      },
      {
        adId: uuidv4(),
        title: 'Google Display Network - Banner Campaign',
        description: 'Run targeted banner ads across millions of websites. Advanced audience targeting.',
        category: 'Digital',
        price: 25000,
        location: 'Pan India',
        imageUrl: 'https://images.unsplash.com/photo-1763671727638-5bc55bb9c980?w=800',
        duration: '7 Days',
        features: ['Geo-targeting', 'Analytics Dashboard', 'A/B Testing', 'Retargeting']
      },
      {
        adId: uuidv4(),
        title: 'Star Plus - Prime Time Commercial',
        description: 'Advertise during popular shows on Star Plus. Maximum visibility.',
        category: 'TV',
        price: 75000,
        location: 'National',
        imageUrl: 'https://images.pexels.com/photos/7865064/pexels-photo-7865064.jpeg?w=800',
        duration: '30 Seconds',
        features: ['Prime Time', 'HD Quality', 'National Coverage', 'High TRP']
      },
      {
        adId: uuidv4(),
        title: 'Hindu Business Line - Quarter Page',
        description: 'Business section advertisement in Hindu Business Line.',
        category: 'Newspaper',
        price: 12000,
        location: 'Chennai',
        imageUrl: 'https://images.unsplash.com/photo-1736248991839-67d11f7a5643?w=800',
        duration: '1 Day',
        features: ['Business Section', 'Color Print', 'Weekday Edition']
      },
      {
        adId: uuidv4(),
        title: 'Instagram Stories Ads',
        description: 'Full-screen vertical video ads on Instagram Stories. Highly engaging format.',
        category: 'Digital',
        price: 18000,
        location: 'Pan India',
        imageUrl: 'https://images.unsplash.com/photo-1763671727638-5bc55bb9c980?w=800',
        duration: '5 Days',
        features: ['Swipe Up', 'Demographics Filter', 'Analytics', 'Video Format']
      }
    ];

    await Ad.insertMany(sampleAds);
    console.log(`✅ Created ${sampleAds.length} sample ads`);

    console.log('\n🎉 Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
