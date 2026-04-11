// lib/models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    badge:       { type: String, default: '' },
    price:       { type: Number, required: true, min: 0 },
    description: { type: String, default: '' },
    includes:    [{ type: String }],
    images:      [{ type: String }],
    mainImage:   { type: String, default: '' },
    category: {
      type: String,
      enum: ['neutral', 'vajza', 'djem', 'personalizuar'],
      default: 'neutral',
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes për queries të shpejta
ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ featured: 1 });

export default mongoose.models.Product ||
  mongoose.model('Product', ProductSchema);