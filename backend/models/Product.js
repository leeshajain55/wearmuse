const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  images: [{
    type: String,
  }],
  sizes: [{
    type: String,
  }],
  colors: [{
    type: String,
  }],
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  brand: {
    type: String,
    default: 'StyleVerse',
  },
  tags: [{
    type: String,
    enum: ['new-arrival', 'trending', 'bestseller', 'sale'],
  }],
  reviews: [reviewSchema],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
}, { timestamps: true });

// Update rating stats when reviews change
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = { average: 0, count: 0 };
  } else {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.rating = {
      average: Math.round((sum / this.reviews.length) * 10) / 10,
      count: this.reviews.length,
    };
  }
};

module.exports = mongoose.model('Product', productSchema);
