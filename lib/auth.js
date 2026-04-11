import crypto from 'crypto';

function getAdminPassword() {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) throw new Error('ADMIN_PASSWORD nuk është vendosur!');
  return pwd;
}

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET nuk është vendosur!');
  return secret;
}

export function verifyPassword(password) {
  return password === getAdminPassword();
}

export function createSessionToken() {
  const payload = 'admin-session';
  return crypto
    .createHmac('sha256', getSessionSecret())
    .update(payload)
    .digest('hex');
}

export function verifySessionToken(token) {
  if (!token) return false;
  try {
    const expected = crypto
      .createHmac('sha256', getSessionSecret())
      .update('admin-session')
      .digest('hex');
    return token === expected;
  } catch {
    return false;
  }
}

export function destroySessionToken() {
  // Logout bëhet duke pastruar cookie-n në browser
}