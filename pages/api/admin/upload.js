// pages/api/admin/upload.js
// Kërkon: npm install cloudinary formidable
// Kërkon në .env.local:
//   CLOUDINARY_CLOUD_NAME=...
//   CLOUDINARY_API_KEY=...
//   CLOUDINARY_API_SECRET=...

import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import { parse } from 'cookie';
import { verifySessionToken } from '../../../lib/auth';

export const config = {
  api: { bodyParser: false },
};

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const form = formidable({
    maxFileSize: 5 * 1024 * 1024, // 5MB
    filter: ({ mimetype }) => mimetype && mimetype.startsWith('image/'),
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Ngarkimi dështoi' });
    }

    const fileArray = files.file
      ? Array.isArray(files.file) ? files.file : [files.file]
      : [];

    if (fileArray.length === 0) {
      return res.status(400).json({ error: 'Asnjë imazh nuk u dërgua' });
    }

    try {
      const uploads = await Promise.all(
        fileArray.map(f =>
          cloudinary.uploader.upload(f.filepath, {
            folder: 'babygifts/products',
            transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
          })
        )
      );

      const urls = uploads.map(u => u.secure_url);
      return res.status(200).json({ urls });
    } catch (uploadErr) {
      console.error('Cloudinary error:', uploadErr);
      return res.status(500).json({ error: 'Ngarkimi në Cloudinary dështoi' });
    }
  });
}