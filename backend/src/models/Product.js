const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0
    },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Fashion', 'Home', 'Fitness', 'Accessories'],
      default: 'Electronics'
    },
    image: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 10
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 12
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
