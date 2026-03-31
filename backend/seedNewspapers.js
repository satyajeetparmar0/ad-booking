require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Newspaper = require('./models/Newspaper');

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

const seedNewspapers = async () => {
  try {
    await mongoose.connect(`${MONGO_URL}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('🔗 Connected to MongoDB');

    // Clear existing newspapers
    await Newspaper.deleteMany({});
    console.log('🧹 Cleared existing newspapers');

    // Sample newspapers data
    const newspapers = [
      {
        newspaperId: uuidv4(),
        name: 'Times of India',
        language: 'English',
        cities: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad'],
        basePrice: 500,
        pricePerWord: 5,
        logo: ''
      },
      {
        newspaperId: uuidv4(),
        name: 'Hindustan Times',
        language: 'English',
        cities: ['Delhi', 'Mumbai', 'Bangalore', 'Chandigarh', 'Lucknow', 'Patna'],
        basePrice: 450,
        pricePerWord: 4.5,
        logo: ''
      },
      {
        newspaperId: uuidv4(),
        name: 'The Hindu',
        language: 'English',
        cities: ['Chennai', 'Bangalore', 'Hyderabad', 'Delhi', 'Mumbai', 'Coimbatore'],
        basePrice: 400,
        pricePerWord: 4,
        logo: ''
      },
      {
        newspaperId: uuidv4(),
        name: 'Dainik Jagran',
        language: 'Hindi',
        cities: ['Delhi', 'Lucknow', 'Kanpur', 'Varanasi', 'Patna', 'Ranchi'],
        basePrice: 300,
        pricePerWord: 3,
        logo: ''
      },
      {
        newspaperId: uuidv4(),
        name: 'Dainik Bhaskar',
        language: 'Hindi',
        cities: ['Bhopal', 'Indore', 'Jaipur', 'Ahmedabad', 'Chandigarh', 'Delhi'],
        basePrice: 350,
        pricePerWord: 3.5,
        logo: ''
      },
      {
        newspaperId: uuidv4(),
        name: 'Amar Ujala',
        language: 'Hindi',
        cities: ['Delhi', 'Agra', 'Meerut', 'Lucknow', 'Dehradun', 'Jaipur'],
        basePrice: 280,
        pricePerWord: 2.8,
        logo: ''
      },
      {
        newspaperId: uuidv4(),
        name: 'The Telegraph',
        language: 'English',
        cities: ['Kolkata', 'Ranchi', 'Jamshedpur', 'Siliguri', 'Guwahati'],
        basePrice: 380,
        pricePerWord: 3.8,
        logo: ''
      },
      {
        newspaperId: uuidv4(),
        name: 'Anandabazar Patrika',
        language: 'Bengali',
        cities: ['Kolkata', 'Siliguri', 'Asansol', 'Durgapur'],
        basePrice: 320,
        pricePerWord: 3.2,
        logo: ''
      },
      {
        newspaperId: uuidv4(),
        name: 'Deccan Chronicle',
        language: 'English',
        cities: ['Hyderabad', 'Vijayawada', 'Visakhapatnam', 'Bangalore', 'Chennai'],
        basePrice: 360,
        pricePerWord: 3.6,
        logo: ''
      },
      {
        newspaperId: uuidv4(),
        name: 'Maharashtra Times',
        language: 'Marathi',
        cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
        basePrice: 340,
        pricePerWord: 3.4,
        logo: ''
      },
      {
        newspaperId: uuidv4(),
        name: 'Malayala Manorama',
        language: 'Malayalam',
        cities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
        basePrice: 330,
        pricePerWord: 3.3,
        logo: ''
      },
      {
        newspaperId: uuidv4(),
        name: 'Dinamalar',
        language: 'Tamil',
        cities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy'],
        basePrice: 310,
        pricePerWord: 3.1,
        logo: ''
      }
    ];

    await Newspaper.insertMany(newspapers);
    console.log(`✅ Created ${newspapers.length} newspapers`);
    
    // Get unique cities
    const citiesSet = new Set();
    newspapers.forEach(np => np.cities.forEach(city => citiesSet.add(city)));
    console.log(`✅ Total cities covered: ${citiesSet.size}`);
    
    console.log('\n🎉 Newspaper seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedNewspapers();
