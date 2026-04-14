# Baby Gifts Albania — Next.js Website

Faqe e plotë Next.js për Baby Gifts Albania me admin panel.

## 🚀 Si të fillosh

### 1. Instalo dependencies
```bash
npm install
# Instalon edhe formidable për upload fotosh
npm install formidable cookie
```

### 2. Shto variablat e mjedisit
```bash
cp .env.example .env.local
# Edito .env.local dhe ndrysho ADMIN_PASSWORD
```

### 3. Shto fotot
Kopjo fotot e tua në `/public/images/`:
```
public/
  images/
    logo.png          ← Foto e parë (logo rrethi)
    hero-bg.jpg       ← Foto e dytë (background hero)
    product1.jpg      ← Produkti 1 (shportë rozë)
    product2.jpg      ← Produkti 2 (shportë krem)
    product3.jpg      ← Produkti 3 (kuti blu)
    product4.jpg      ← Produkti 4 (shportë ari)
    product5.jpg      ← Produkti 5 (set premium)
    product6.jpg      ← Produkti 6 (welcome baby)
    og-image.jpg      ← Imazhi për Open Graph (1200×630px)
```

### 4. Fillo serverin
```bash
npm run dev
```

Hap [http://localhost:3000](http://localhost:3000)

---

## 🔐 Admin Panel

URL: [http://localhost:3000/admin](http://localhost:3000/admin)

Fjalëkalimi default: `babygifts2025admin`

**⚠️ Ndryshoje fjalëkalimin** në `.env.local` para se ta vendosësh online!

### Çfarë mund të bësh në Admin Panel:
- ✅ Shto produkte të reja
- ✅ Edito emrin, çmimin, përshkrimin, kategorinë
- ✅ Ngarko foto të shumta për çdo produkt
- ✅ Vendos foton kryesore (thumbnail)
- ✅ Hiq foto individuale
- ✅ Fshi produkte
- ✅ Shëno produkte si "featured"

---

## 📁 Struktura e Projektit

```
babygifts/
├── components/
│   ├── Navbar.js          # Menu navigimit
│   ├── Hero.js            # Seksioni kryesor
│   ├── Marquee.js         # Strip animacion
│   ├── About.js           # Seksioni "Pse Ne"
│   ├── Products.js        # Grid produkteve
│   ├── ProductModal.js    # Modal detaje + galeri
│   ├── Contact.js         # Kontakt
│   └── Footer.js          # Footer
├── lib/
│   ├── products.js        # CRUD produkteve (JSON file)
│   └── auth.js            # Autentifikimi admin
├── pages/
│   ├── index.js           # Faqja kryesore (SEO + JSON-LD)
│   ├── admin/
│   │   ├── index.js       # Dashboard admin
│   │   └── login.js       # Login admin
│   └── api/
│       ├── products.js    # REST API produkteve
│       └── admin/
│           ├── login.js   # Login/logout API
│           └── upload.js  # Upload fotosh
├── public/images/         # Fotografitë
├── styles/globals.css     # Stilet globale
└── data/products.json     # Të dhënat produkteve (auto-krijohet)
```

---

## 🌐 Deploy në Vercel

```bash
npm install -g vercel
vercel
```

Shto variablat e mjedisit në Vercel Dashboard:
- `ADMIN_PASSWORD` = fjalëkalimi yt
- `SESSION_SECRET` = string random i gjatë

---

## 📞 Kontakt
- Tel: 0697 536 334
- WhatsApp: [wa.me/355697536334](https://wa.me/+355 69 288 1903)
- Instagram: @dhurata_per_bebin
