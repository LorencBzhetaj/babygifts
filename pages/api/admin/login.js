// pages/api/admin/login.js
import { serialize } from 'cookie';
import { verifyPassword } from '../../../lib/auth';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { password } = req.body;

    if (verifyPassword(password)) {
      const cookie = serialize('admin_session', password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8, // 8 hours
        path: '/',
      });
      res.setHeader('Set-Cookie', cookie);
      return res.status(200).json({ success: true });
    }

    return res.status(401).json({ error: 'Fjalëkalim i gabuar' });
  }

  if (req.method === 'DELETE') {
    // Logout
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
