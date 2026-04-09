import styles from './Footer.module.css';

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        Baby Gifts Albania
        <span>© {new Date().getFullYear()} · @dhurata_per_bebin · Tiranë, Shqipëri</span>
      </div>
      <nav className={styles.links} aria-label="Footer navigation">
        {[
          { label: 'Kryefaqja', id: 'hero' },
          { label: 'Rreth Nesh', id: 'about' },
          { label: 'Produktet', id: 'products' },
          { label: 'Kontakt', id: 'contact' },
        ].map(({ label, id }) => (
          <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>
            {label}
          </a>
        ))}
      </nav>
      <div className={styles.copy}>Bërë me ❤️ në Tiranë</div>
    </footer>
  );
}
