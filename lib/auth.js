// lib/auth.js
// Simple session-based auth for admin panel
// In production, use NextAuth.js or similar

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'babygifts2025admin';
const SESSION_SECRET = process.env.SESSION_SECRET || 'babygifts-secret-key-change-in-prod';

export function verifyPassword(password) {
  return password === ADMIN_PASSWORD;
}

export function getSessionSecret() {
  return SESSION_SECRET;
}
