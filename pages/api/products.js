import connectDB from '../../lib/mongodb';
import Product from '../../lib/models/Product';
import { parse } from 'cookie';
import { verifySessionToken } from '../../lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isAuthenticated(req) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies['admin_session'];
  return token ? verifySessionToken(token) : false;
}

function getPublicId(url) {
  const parts = url.split('/');
  const filename = parts[parts.length - 1].split('.')[0];
  return `babygifts/products/${filename}`;
}

export default async function handler(req, res) {
  await connectDB();
  const { method, query } = req;

  if (method === 'GET') {
    try {
      const products = await Product.find({}).sort({ createdAt: -1 }).lean();
      const cleaned = products.map(p => ({
        ...p,
        id: p._id.toString(),
        _id: undefined,
        createdAt: p.createdAt?.toISOString() || null,
        updatedAt: p.updatedAt?.toISOString() || null,
      }));
      return res.status(200).json(cleaned);
    } catch (err) {
      return res.status(500).json({ error: 'Gabim serveri' });
    }
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (method === 'POST') {
    const { name, price, category } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Emri i produktit është i detyrueshëm' });
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      return res.status(400).json({ error: 'Çmimi duhet të jetë numër pozitiv' });
    }
    const validCategories = ['neutral', 'vajza', 'djem', 'personalizuar'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ error: 'Kategoria është e pavlefshme' });
    }
    try {
      const product = await Product.create({
        ...req.body,
        name: name.trim(),
        price: Number(price),
      });
      return res.status(201).json({
        ...product.toObject(),
        id: product._id.toString(),
        _id: undefined,
      });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  if (method === 'PUT') {
    const { id } = query;
    if (!id) return res.status(400).json({ error: 'id required' });
    if (
      req.body.price !== undefined &&
      (isNaN(Number(req.body.price)) || Number(req.body.price) <= 0)
    ) {
      return res.status(400).json({ error: 'Çmimi duhet të jetë numër pozitiv' });
    }
    try {
      const updated = await Product.findByIdAndUpdate(
        id,
        {
          ...req.body,
          ...(req.body.price && { price: Number(req.body.price) }),
        },
        { new: true, runValidators: true }
      ).lean();
      if (!updated) return res.status(404).json({ error: 'Produkti nuk u gjet' });
      return res.status(200).json({
        ...updated,
        id: updated._id.toString(),
        _id: undefined,
      });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  if (method === 'DELETE') {
    const { id } = query;
    if (!id) return res.status(400).json({ error: 'id required' });
    try {
      const product = await Product.findById(id).lean();

      if (product?.images?.length) {
        const deletePromises = product.images
          .filter(url => url.includes('cloudinary.com'))
          .map(url => cloudinary.uploader.destroy(getPublicId(url)));
        await Promise.allSettled(deletePromises);
      }

      await Product.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}