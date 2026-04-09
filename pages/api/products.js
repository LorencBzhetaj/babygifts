// pages/api/products.js
import connectDB from '../../lib/mongodb';
import Product from '../../lib/models/Product';
import { parse } from 'cookie';

function isAuthenticated(req) {
  const cookies = parse(req.headers.cookie || '');
  return cookies['admin_session'] === (process.env.ADMIN_PASSWORD || 'babygifts2025admin');
}

export default async function handler(req, res) {
  await connectDB();
  const { method, query } = req;

  // ── GET — publik, për frontend ──
  if (method === 'GET') {
    try {
      const products = await Product.find({}).sort({ createdAt: -1 }).lean();
      const cleaned = products.map(p => ({ ...p, id: p._id.toString(), _id: undefined }));
      return res.status(200).json(cleaned);
    } catch (err) {
      return res.status(500).json({ error: 'Gabim serveri' });
    }
  }

  // ── Të gjitha metodat e tjera kërkojnë auth ──
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // ── POST — shto produkt të ri ──
  if (method === 'POST') {
    try {
      const product = await Product.create(req.body);
      return res.status(201).json({ ...product.toObject(), id: product._id.toString() });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // ── PUT — përditëso produkt ──
  if (method === 'PUT') {
    const { id } = query;
    if (!id) return res.status(400).json({ error: 'id required' });
    try {
      const updated = await Product.findByIdAndUpdate(id, req.body, { new: true }).lean();
      if (!updated) return res.status(404).json({ error: 'Produkti nuk u gjet' });
      return res.status(200).json({ ...updated, id: updated._id.toString() });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  // ── DELETE — fshi produkt ──
  if (method === 'DELETE') {
    const { id } = query;
    if (!id) return res.status(400).json({ error: 'id required' });
    try {
      await Product.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
