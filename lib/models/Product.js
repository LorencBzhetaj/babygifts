// lib/models/Product.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    badge: { type: String, default: '' },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    includes: [{ type: String }],
    images: [{ type: String }],
    mainImage: { type: String, default: '' },
    category: {
      type: String,
      enum: ['neutral', 'vajza', 'djem', 'personalizuar'],
      default: 'neutral',
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model('Product', ProductSchema);
