// scripts/seed.js
// Ekzekuto me: node scripts/seed.js
// Shton produktet fillestare në MongoDB

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    badge: String,
    price: Number,
    description: String,
    includes: [String],
    images: [String],
    mainImage: String,
    category: String,
    featured: Boolean,
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const initialProducts = [
  {
    name: 'Shportë Rozë & Ari',
    badge: '💗 Për Vajzën',
    price: 5000,
    description: 'Set luksoz rozë me veshje velvet, arushe teddy, fjongo dhe kartë personalizuar me emrin e bebit. Materiale 100% organike dhe të sigurta për bebë.',
    includes: ['Veshje rozë organike', 'Arushe Teddy', 'Çorape të punuara me dorë', 'Furçë natyrale', 'Kartë personalizuar me emër', 'Fjongo velvet'],
    images: ['/images/product1.jpg', '/images/product2.jpg'],
    mainImage: '/images/product1.jpg',
    category: 'vajza',
    featured: true,
  },
  {
    name: 'Shportë Krem & Karamel',
    badge: '🤍 Neutral',
    price: 5000,
    description: 'Set neutral elegant me veshje krem premium, arushe teddy të butë, furçë druri natyrale, sapun luleje dhe kujtimor bebeje të personalizuar.',
    includes: ['Veshje krem organike', 'Arushe Teddy', 'Furçë druri natyrale', 'Sapun luleje', 'Kujtimor bebeje', 'Fjongo satin'],
    images: ['/images/product2.jpg', '/images/product1.jpg'],
    mainImage: '/images/product2.jpg',
    category: 'neutral',
    featured: true,
  },
  {
    name: 'Kuti Blu "Welcome Baby"',
    badge: '💙 Për Djalin',
    price: 4500,
    description: 'Kuti hapëse elegante me veshje blu celeste të cilësisë së lartë, çorape të punuara me dorë, furçë premium dhe kartë personalizuar me emrin e bebit.',
    includes: ['Veshje blu celeste', 'Çorape të punuara me dorë', 'Furçë premium', 'Kartë personalizuar', 'Fjongo blu', 'Kuti dhuratë luksoze'],
    images: ['/images/product3.jpg', '/images/product4.jpg'],
    mainImage: '/images/product3.jpg',
    category: 'djem',
    featured: true,
  },
  {
    name: 'Shportë me Emër Ari',
    badge: '✨ Personalizuar',
    price: 5000,
    description: 'Shportë e punuar me dorë me emrin e bebit në shkronja ari — dhurata unike e llojit të saj.',
    includes: ['Emri i bebit në ari', 'Veshje premium', 'Arushe Teddy special', 'Lule të thata dekorative', 'Fjongo luksoz', 'Kartë urime'],
    images: ['/images/product4.jpg', '/images/product2.jpg'],
    mainImage: '/images/product4.jpg',
    category: 'personalizuar',
    featured: true,
  },
  {
    name: 'Set Premium Rozë',
    badge: '⭐ Bestseller',
    price: 5000,
    description: 'Koleksioni ynë më i plotë: veshje rozë organike, çorape të punuara artizanale, sapun luleje, furçë natyrale dhe Baby Album kujtimor.',
    includes: ['Veshje rozë organike', 'Çorape artizanale', 'Sapun luleje premium', 'Furçë natyrale', 'Baby Album kujtimor', 'Arushe Teddy', 'Kartë me emrin e bebit'],
    images: ['/images/product5.jpg', '/images/product1.jpg'],
    mainImage: '/images/product5.jpg',
    category: 'vajza',
    featured: false,
  },
  {
    name: 'Shportë "Welcome Baby"',
    badge: '🤍 Klasik',
    price: 4500,
    description: 'Elegancë natyrore: shportë artizanale me fjongo velvet, lule të thata dhe set i plotë veshje organike.',
    includes: ['Veshje organike', 'Fjongo velvet', 'Lule të thata dekorative', 'Çorape të butë', 'Furçë natyrale', 'Kartë urime'],
    images: ['/images/product6.jpg', '/images/product3.jpg'],
    mainImage: '/images/product6.jpg',
    category: 'neutral',
    featured: false,
  },
];

async function seed() {
  try {
    console.log('🔌 Duke u lidhur me MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ U lidh me sukses!');

    const count = await Product.countDocuments();
    if (count > 0) {
      console.log(`⚠️  Ka tashmë ${count} produkte në databazë. Po kapërcen seed.`);
      console.log('   Nëse dëshiron t\'i fshish dhe rifillosh, ekzekuto:');
      console.log('   node scripts/seed.js --force');
      if (!process.argv.includes('--force')) {
        process.exit(0);
      }
      await Product.deleteMany({});
      console.log('🗑️  Produktet e vjetra u fshinë.');
    }

    await Product.insertMany(initialProducts);
    console.log(`✅ ${initialProducts.length} produkte u shtuan në MongoDB!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Gabim:', err.message);
    process.exit(1);
  }
}

seed();
