// pages/api/admin/upload.js
// Handles image uploads for products
// Uses multipart/form-data via formidable

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { parse } from 'cookie';

export const config = {
  api: { bodyParser: false },
};

function isAuthenticated(req) {
  const cookies = parse(req.headers.cookie || '');
  return cookies['admin_session'] === (process.env.ADMIN_PASSWORD || 'babygifts2025admin');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'images', 'products');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    filter: ({ mimetype }) => mimetype && mimetype.startsWith('image/'),
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Ngarkimi dështoi' });
    }

    const fileArray = files.file ? (Array.isArray(files.file) ? files.file : [files.file]) : [];
    const urls = fileArray.map(f => {
      const filename = path.basename(f.filepath);
      return `/images/products/${filename}`;
    });

    return res.status(200).json({ urls });
  });
}
