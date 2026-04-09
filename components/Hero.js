import Image from 'next/image';
import styles from './Hero.module.css';

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.bgDec}></div>

      <div className={styles.left}>
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          Artizanat Shqiptar · Tiranë
        </div>
        <h1 className={styles.h1}>
          Dhurata <em>me Zemër</em><br />
          për Bebin <span className={styles.gold}>Tuaj</span>
        </h1>
        <p className={styles.desc}>
          Shporta dhe kutia dhuratë të punuara me dorë, të personalizuara me emrin e bebit.
          Çdo dhuratë është unike dhe tregon historinë e dashurisë tuaj.
        </p>
        <div className={styles.actions}>
          <button className="btnPrimary" onClick={() => scrollTo('products')}>
            Shiko Koleksionin
          </button>
          <button className="btnSecondary" onClick={() => scrollTo('contact')}>
            Na Kontakto
          </button>
        </div>
        <div className={styles.stats}>
          <div>
            <div className={styles.statNum}>200+</div>
            <div className={styles.statLabel}>Dhurata të dërguara</div>
          </div>
          <div>
            <div className={styles.statNum}>100%</div>
            <div className={styles.statLabel}>Personalizim</div>
          </div>
          <div>
            <div className={styles.statNum}>48h</div>
            <div className={styles.statLabel}>Dorëzim i shpejtë</div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        {/* Big image – full column */}
        <div className={`${styles.hvItem} ${styles.hvBig}`}>
          <div className={styles.hvInner}>
            <Image
              src="/images/hero-bg.jpg"
              alt="Shportë dhuratë luksoze për bebë - Baby Gifts Albania"
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <span className={styles.hvTag}>✦ Koleksioni 2025</span>
        </div>
        {/* Small image top right */}
        <div className={styles.hvItem}>
          <div className={styles.hvInner}>
            <Image
              src="/images/product3.jpg"
              alt="Kuti dhuratë për bebë - Welcome Baby"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>
          <span className={styles.hvTag}>🎁 Kuti Dhuratë</span>
        </div>
        {/* Small image bottom right */}
        <div className={styles.hvItem}>
          <div className={styles.hvInner}>
            <Image
              src="/images/product5.jpg"
              alt="Set premium rozë për bebë vajzë"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>
          <span className={styles.hvTag}>✨ Personalizuar</span>
        </div>
      </div>
    </section>
  );
}
