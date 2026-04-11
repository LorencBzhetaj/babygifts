// lib/auth.js
import crypto from 'crypto';

if (!process.env.ADMIN_PASSWORD) throw new Error('ADMIN_PASSWORD nuk është vendosur!');
if (!process.env.SESSION_SECRET) throw new Error('SESSION_SECRET nuk është vendosur!');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET;

export function verifyPassword(password) {
  return password === ADMIN_PASSWORD;
}

export function createSessionToken() {
  // Krijo një signature bazuar në secret — e verifikueshme pa memory
  const payload = 'admin-session';
  return crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex');
}

export function verifySessionToken(token) {
  // Rikalkullo token-in e pritur dhe krahaso
  const expected = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update('admin-session')
    .digest('hex');
  return token === expected;
}

export function destroySessionToken() {
  // Me HMAC nuk kemi nevojë të fshijmë gjë nga memory
  // Logout bëhet duke pastruar cookie-n në browser
}