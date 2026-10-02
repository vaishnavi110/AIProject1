const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Seeding initial data...');

    // 1. Seed Admin User
    const existingAdmin = await User.findOne({ email: 'admin@shopease.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin User',
        email: 'admin@shopease.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin account created (admin@shopease.com / admin123)');
    } else {
      console.log('Admin account already exists');
    }

    // 2. Seed Initial Categories
    const initialCategories = [
      { name: 'Electronics', description: 'Gadgets, audio, and smart devices' },
      { name: 'Fashion', description: 'Apparel, footwear, and trending wear' },
      { name: 'Shoes', description: 'Footwear for running, sports, and casual use' },
      { name: 'Accessories', description: 'Bags, watches, sunglasses, and essentials' }
    ];

    const categoryMap = {};
    for (const cat of initialCategories) {
      let createdCat = await Category.findOne({ name: cat.name });
      if (!createdCat) {
        createdCat = await Category.create(cat);
      }
      categoryMap[cat.name] = createdCat._id;
    }
    console.log('Categories seeded successfully');

    // 3. Seed Initial Products
    const initialProducts = [
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Premium over-ear wireless headphones with active noise cancellation and 30-hour battery life.',
        price: 2999,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
        category: categoryMap['Electronics'],
        stock: 15
      },
      {
        name: 'Mechanical RGB Gaming Keyboard',
        description: 'Tactile mechanical switches with per-key customizable RGB backlighting and wrist rest.',
        price: 4499,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600',
        category: categoryMap['Electronics'],
        stock: 12
      },
      {
        name: 'Running Sports Shoes',
        description: 'Lightweight, breathable athletic running shoes with responsive foam cushioning.',
        price: 4999,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
        category: categoryMap['Shoes'],
        stock: 10
      },
      {
        name: 'Classic Vintage Denim Jacket',
        description: 'Timeless denim jacket tailored from 100% durable cotton with a relaxed fit.',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600',
        category: categoryMap['Fashion'],
        stock: 20
      },
      {
        name: 'Classic Leather Minimalist Watch',
        description: 'Elegant analog quartz watch with genuine leather strap and scratch-resistant sapphire glass.',
        price: 3299,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600',
        category: categoryMap['Accessories'],
        stock: 8
      }
    ];

    for (const prod of initialProducts) {
      const existingProd = await Product.findOne({ name: prod.name });
      if (!existingProd) {
        await Product.create(prod);
      }
    }
    console.log('Products seeded successfully');

    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
