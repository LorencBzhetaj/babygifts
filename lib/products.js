// lib/products.js
// Persistent products store using a simple JSON file approach
// In production, replace with a real database (PostgreSQL, MongoDB, etc.)

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Default products (with real images from the uploaded photo)
const DEFAULT_PRODUCTS = [
  {
    id: '1',
    name: 'Shportë Rozë & Ari',
    badge: '💗 Për Vajzën',
    price: 5000,
    description: 'Set luksoz rozë me veshje velvet, arushe teddy, fjongo dhe kartë personalizuar me emrin e bebit. Materiale 100% organike dhe të sigurta për bebë.',
    includes: ['Veshje rozë organike', 'Arushe Teddy', 'Çorape të punuara me dorë', 'Furçë natyrale', 'Kartë personalizuar me emër', 'Fjongo velvet'],
    images: ['/images/product1.jpg', '/images/hero-bg.jpg'],
    mainImage: '/images/product1.jpg',
    category: 'vajza',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Shportë Krem & Karamel',
    badge: '🤍 Neutral',
    price: 5000,
    description: 'Set neutral elegant me veshje krem premium, arushe teddy të butë, furçë druri natyrale, sapun luleje dhe kujtimor bebeje të personalizuar.',
    includes: ['Veshje krem organike', 'Arushe Teddy', 'Furçë druri natyrale', 'Sapun luleje', 'Kujtimor bebeje', 'Fjongo satin'],
    images: ['/images/product2.jpg', '/images/product1.jpg'],
    mainImage: '/images/product2.jpg',
    category: 'neutral',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Kuti Blu "Welcome Baby"',
    badge: '💙 Për Djalin',
    price: 4500,
    description: 'Kuti hapëse elegante me veshje blu celeste të cilësisë së lartë, çorape të punuara me dorë, furçë premium dhe kartë personalizuar me emrin e bebit.',
    includes: ['Veshje blu celeste', 'Çorape të punuara me dorë', 'Furçë premium', 'Kartë personalizuar', 'Fjongo blu', 'Kuti dhuratë luksoze'],
    images: ['/images/product3.jpg', '/images/product4.jpg'],
    mainImage: '/images/product3.jpg',
    category: 'djem',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Shportë me Emër Ari',
    badge: '✨ Personalizuar',
    price: 5000,
    description: 'Shportë e punuar me dorë me emrin e bebit në shkronja ari — dhurata unike e llojit të saj. Çdo detaj është menduar me dashuri për të krijuar një kujtim të paharrueshëm.',
    includes: ['Emri i bebit në ari', 'Veshje premium', 'Arushe Teddy special', 'Lule të thata dekorative', 'Fjongo luksoz', 'Kartë urime'],
    images: ['/images/product4.jpg', '/images/product2.jpg'],
    mainImage: '/images/product4.jpg',
    category: 'personalizuar',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Set Premium Rozë',
    badge: '⭐ Bestseller',
    price: 5000,
    description: 'Koleksioni ynë më i plotë: veshje rozë organike, çorape të punuara artizanale, sapun luleje, furçë natyrale dhe Baby Album kujtimor i personalizuar.',
    includes: ['Veshje rozë organike', 'Çorape artizanale', 'Sapun luleje premium', 'Furçë natyrale', 'Baby Album kujtimor', 'Arushe Teddy', 'Kartë me emrin e bebit'],
    images: ['/images/product5.jpg', '/images/product1.jpg'],
    mainImage: '/images/product5.jpg',
    category: 'vajza',
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Shportë "Welcome Baby"',
    badge: '🤍 Klasik',
    price: 4500,
    description: 'Elegancë natyrore: shportë artizanale me fjongo velvet, lule të thata të zgjedhura me kujdes dhe set i plotë veshje organike për bebe të sapolindur.',
    includes: ['Veshje organike', 'Fjongo velvet', 'Lule të thata dekorative', 'Çorape të butë', 'Furçë natyrale', 'Kartë urime'],
    images: ['/images/product6.jpg', '/images/product3.jpg'],
    mainImage: '/images/product6.jpg',
    category: 'neutral',
    featured: false,
    createdAt: new Date().toISOString(),
  },
];

export function getProducts() {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_PRODUCTS, null, 2));
    return DEFAULT_PRODUCTS;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export function saveProducts(products) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
}

export function getProductById(id) {
  const products = getProducts();
  return products.find(p => p.id === id) || null;
}

export function createProduct(data) {
  const products = getProducts();
  const newProduct = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id, data) {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...data };
  saveProducts(products);
  return products[idx];
}

export function deleteProduct(id) {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
  return filtered;
}
