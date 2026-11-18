require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

const sampleProducts = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description:
      'Industry-leading noise cancellation with dual processors, 30-hour battery life, crystal-clear hands-free calling, and ultra-comfortable lightweight design.',
    price: 349.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
    stock: 25,
    rating: 4.9,
    numReviews: 142,
    featured: true
  },
  {
    name: 'Apple Watch Ultra 2 Titanium',
    description:
      'Rugged 49mm aerospace-grade titanium case, precision dual-frequency GPS, up to 36 hours of battery life, and bright 3000-nit Always-On Retina display.',
    price: 799.00,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
    stock: 15,
    rating: 4.8,
    numReviews: 98,
    featured: true
  },
  {
    name: 'Minimalist Merino Wool Overcoat',
    description:
      'Tailored mid-weight Italian merino wool blend coat with structured lapels, breathable satin lining, and deep welt pockets for everyday layering.',
    price: 229.50,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    stock: 18,
    rating: 4.7,
    numReviews: 64,
    featured: true
  },
  {
    name: 'AirGlide Runner Pro Sneakers',
    description:
      'Engineered knit upper paired with responsive nitrogen-infused foam midsole for effortless daily runs and all-day urban comfort.',
    price: 139.99,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    stock: 40,
    rating: 4.6,
    numReviews: 210,
    featured: false
  },
  {
    name: 'Nordic Ceramic Pour-Over Coffee Set',
    description:
      'Handcrafted matte stoneware dripper and 600ml server designed for optimal thermal retention and balanced, clean coffee extraction.',
    price: 68.00,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&q=80',
    stock: 30,
    rating: 4.8,
    numReviews: 53,
    featured: false
  },
  {
    name: 'Smart Ambient Desk Lamp',
    description:
      'Touch-dimmable architectural aluminum LED lamp with adjustable warm-to-daylight color temperatures and built-in wireless charging base.',
    price: 89.99,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    stock: 22,
    rating: 4.5,
    numReviews: 41,
    featured: false
  },
  {
    name: 'Adjustable Cast Iron Kettlebell Set',
    description:
      'Space-saving quick-lock kettlebell ranging from 10 lb to 40 lb with powder-coated wide handle for swings, squats, and functional strength workouts.',
    price: 159.00,
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    stock: 14,
    rating: 4.9,
    numReviews: 87,
    featured: true
  },
  {
    name: 'Pro Grip Natural Cork Yoga Mat',
    description:
      '5mm high-density natural tree rubber base topped with antimicrobial sustainably harvested cork for superior traction even during intense sessions.',
    price: 74.99,
    category: 'Fitness',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',
    stock: 35,
    rating: 4.7,
    numReviews: 76,
    featured: false
  },
  {
    name: 'Full-Grain Leather Everyday Backpack',
    description:
      'Water-resistant full-grain leather backpack featuring a padded 16-inch MacBook Pro compartment, luggage pass-through, and brass hardware.',
    price: 189.00,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    stock: 19,
    rating: 4.8,
    numReviews: 112,
    featured: false
  },
  {
    name: 'Polarized Tortoiseshell Sunglasses',
    description:
      'Hand-polished cellulose acetate frames fitted with scratch-resistant UV400 polarized mineral glass lenses.',
    price: 115.00,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
    stock: 28,
    rating: 4.6,
    numReviews: 49,
    featured: false
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();

    const createdProducts = await Product.insertMany(sampleProducts);

    const demoUser = await User.create({
      name: 'Alex Morgan',
      email: 'demo@shopsphere.com',
      password: 'Password123!',
      phone: '+1 (555) 234-5678',
      address: {
        street: '742 Evergreen Terrace',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94107',
        country: 'United States'
      },
      cart: [
        { product: createdProducts[0]._id, quantity: 1 },
        { product: createdProducts[4]._id, quantity: 2 }
      ],
      wishlist: [createdProducts[1]._id, createdProducts[2]._id]
    });

    console.log('Seed completed successfully!');
    console.log(`Inserted ${createdProducts.length} products.`);
    console.log('Demo Account -> Email: demo@shopsphere.com | Password: Password123!');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedDatabase();
