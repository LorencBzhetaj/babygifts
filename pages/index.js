import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import About from '../components/About';
import Products from '../components/Products';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { getProducts } from '../lib/products';

export default function Home({ products }) {
  const siteUrl = 'https://www.babygiftsalbania.al';
  const siteName = 'Baby Gifts Albania';
  const description =
    'Dhurata të personalizuara dhe luksoze për bebë të sapolindur. Shporta dhe kutia dhuratë artizanale për vajza dhe djem. Kids body, çorape, furça, arushe teddy dhe shumë më tepër. Porosit tani – Tiranë. Tel: 0697536334';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${siteUrl}/#business`,
        name: siteName,
        alternateName: 'Dhurata për Bebin',
        description,
        url: siteUrl,
        telephone: '+355697536334',
        image: `${siteUrl}/images/logo.png`,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/logo.png`,
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Tiranë',
          addressCountry: 'AL',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '41.3275',
          longitude: '19.8187',
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
          opens: '09:00',
          closes: '20:00',
        },
        sameAs: [
          'https://www.instagram.com/dhurata_per_bebin',
          'https://wa.me/355697536334',
        ],
        priceRange: '4500 - 5000 ALL',
        currenciesAccepted: 'ALL',
        paymentAccepted: 'Cash, Bank Transfer',
        hasMap: 'https://maps.google.com/?q=Tiranë,Albania',
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        description,
        inLanguage: 'sq',
      },
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/#products`,
        name: 'Koleksioni i Dhuratave për Bebë',
        description: 'Shporta dhe kutia dhuratë artizanale për bebë të sapolindur',
        itemListElement: products.slice(0, 6).map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: p.name,
            description: p.description,
            image: `${siteUrl}${p.mainImage || p.images?.[0]}`,
            offers: {
              '@type': 'Offer',
              price: p.price,
              priceCurrency: 'ALL',
              availability: 'https://schema.org/InStock',
              seller: { '@id': `${siteUrl}/#business` },
            },
            category: 'Baby Gifts, Dhurata Bebë, Kids Body, Socks, Teddy Bears, Brushes',
          },
        })),
      },
    ],
  };

  return (
    <>
      <Head>
        {/* ── Primary Meta ── */}
        <title>Baby Gifts Albania | Dhurata Luksoze për Bebë – Shporta & Kutia Dhuratë | Tiranë</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="baby gifts, dhurata bebë, shporta dhuratë, femije, bebe, dhurata, shporta, kids body, socks, brushes, teddy bears, arushe teddy, çorape, furça, dhurata për femije, baby shower, welcome baby, tiranë, albania, shqipëri, personalizim, artizanal dhurata bebe, dhurata bebë, dhurata për bebë, dhurata per bebe,
                    dhurata femije, dhurata për fëmijë, dhurata per femije,
                    rroba bebe, rroba për bebë, rroba per bebe,
                    shporte dhurate, shportë dhuratë, shporte per bebe,
                    kids body, body bebe, çorape bebe, corape bebe,
                    furça bebe, furca bebe, arushe teddy, lodra bebe,
                    baby gifts, baby shower, welcome baby,
                    dhurata shqiperi, dhurata tirane, dhurata albania,
                    beba, bebja, i sapolindur, sapolindur,
                    dhurata per nene te reja, dhurata personalizuara,
                    set dhurate bebe, kuti dhurate bebe" />
        <meta name="author" content="Baby Gifts Albania" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Albanian" />
        <link rel="canonical" href={siteUrl} />

        {/* ── Open Graph / Facebook ── */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content="Baby Gifts Albania | Dhurata Luksoze për Bebë – Tiranë" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${siteUrl}/images/og-image.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="sq_AL" />

        {/* ── Twitter Card ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Baby Gifts Albania | Dhurata Luksoze për Bebë" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}/images/og-image.jpg`} />

        {/* ── Mobile / PWA ── */}
        <meta name="theme-color" content="#9e5a6a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Baby Gifts AL" />

        {/* ── Geo ── */}
        <meta name="geo.region" content="AL-11" />
        <meta name="geo.placename" content="Tiranë" />
        <meta name="geo.position" content="41.3275;19.8187" />
        <meta name="ICBM" content="41.3275, 19.8187" />

        {/* ── JSON-LD Schema ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Products products={products} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export async function getStaticProps() {
  const products = getProducts();
  return {
    props: { products },
    revalidate: 60, // ISR: revalidate every 60s
  };
}
