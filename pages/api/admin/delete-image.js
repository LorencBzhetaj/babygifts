import { v2 as cloudinary } from 'cloudinary';
import { parse } from 'cookie';
import { verifySessionToken } from '../../../lib/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isAuthenticated(req) {
  const cookies = parse(req.headers.cookie || '');
  return verifySessionToken(cookies['admin_session'] || '');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL mungon' });

  try {
    const parts = url.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    const publicId = `babygifts/products/${filename}`;
    const result = await cloudinary.uploader.destroy(publicId);
    return res.status(200).json({ success: true, result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}