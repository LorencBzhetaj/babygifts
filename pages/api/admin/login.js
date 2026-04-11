// pages/api/admin/login.js
import { serialize, parse } from 'cookie';
import { verifyPassword, createSessionToken, destroySessionToken } from '../../../lib/auth';


export default function handler(req, res) {
  if (req.method === 'POST') {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Fjalëkalimi mungon' });
    }

    if (verifyPassword(password)) {
      // Krijo token të sigurt — NUK ruajmë fjalëkalimin në cookie
      const token = createSessionToken();

      const cookie = serialize('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8, // 8 orë
        path: '/',
      });
      res.setHeader('Set-Cookie', cookie);
      return res.status(200).json({ success: true });
    }

    return res.status(401).json({ error: 'Fjalëkalim i gabuar' });
  }

  if (req.method === 'DELETE') {
    // Logout — fshi token nga memory dhe pastro cookie
    const cookies = parse(req.headers.cookie || '');
    const token = cookies['admin_session'];
    if (token) destroySessionToken(token);

    const cookie = serialize('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ success: true });
  }

  res.status(405).end();
}