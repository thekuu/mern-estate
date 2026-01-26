import mongoose from 'mongoose';
import Listing from './api/models/listing.model.js';
import dotenv from 'dotenv';
dotenv.config();

const listings = [
  {
    name: 'Modern Skyline Penthouse',
    description: 'Experience the pinnacle of luxury living in this stunning penthouse with panoramic city views, high ceilings, and premium finishes.',
    address: 'Bole District, Addis Ababa',
    regularPrice: 85000,
    discountPrice: 75000,
    bathrooms: 3,
    bedrooms: 4,
    furnished: true,
    parking: true,
    type: 'rent',
    offer: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&w=1200&q=80'
    ],
    userRef: 'portfolio_demo'
  },
  {
    name: 'Contemporary Glass Villa',
    description: 'A masterpiece of modern architecture, this villa features floor-to-ceiling glass walls, an open-concept layout, and a private landscaped garden.',
    address: 'Old Airport Area, Addis Ababa',
    regularPrice: 12000000,
    discountPrice: 11500000,
    bathrooms: 4,
    bedrooms: 5,
    furnished: false,
    parking: true,
    type: 'sale',
    offer: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687940-4e2003e25d2b?auto=format&fit=crop&w=1200&q=80'
    ],
    userRef: 'portfolio_demo'
  },
  {
    name: 'Minimalist Urban Loft',
    description: 'Sleek, industrial-style loft in the heart of the city. Perfect for those who appreciate clean lines, natural light, and urban convenience.',
    address: 'Kazanchis, Addis Ababa',
    regularPrice: 45000,
    discountPrice: 45000,
    bathrooms: 1,
    bedrooms: 2,
    furnished: true,
    parking: false,
    type: 'rent',
    offer: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    ],
    userRef: 'portfolio_demo'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB for seeding');
    
    // Clear existing demo listings if needed
    await Listing.deleteMany({ userRef: 'portfolio_demo' });
    
    await Listing.insertMany(listings);
    console.log('Database seeded with high-quality listings');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
