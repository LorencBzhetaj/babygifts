import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} id="nav">
      <a href="#hero" className={styles.brand} onClick={e => { e.preventDefault(); scrollTo('hero'); }}>
        <div className={styles.logoCircle}>
          <Image src="/images/logo.png" alt="Baby Gifts Logo" width={42} height={42} style={{ borderRadius: '50%', objectFit: 'cover' }} />
        </div>
        <div className={styles.brandName}>
          Baby Gifts Albania
          <span>Tiranë · Shqipëri</span>
        </div>
      </a>

      <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
        <li><a href="#about" onClick={e => { e.preventDefault(); scrollTo('about'); }}>Rreth Nesh</a></li>
        <li><a href="#products" onClick={e => { e.preventDefault(); scrollTo('products'); }}>Produktet</a></li>
        <li><a href="#contact" onClick={e => { e.preventDefault(); scrollTo('contact'); }}>Kontakt</a></li>
        <li>
          <a
            href="https://wa.me/355692881903"
            className={styles.cta}
            target="_blank"
            rel="noopener noreferrer"
          >
            Porosit Tani
          </a>
        </li>
      </ul>

      <button
        className={styles.burger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span className={menuOpen ? styles.burgerOpen : ''}></span>
        <span className={menuOpen ? styles.burgerOpen : ''}></span>
        <span className={menuOpen ? styles.burgerOpen : ''}></span>
      </button>
    </nav>
  );
}
