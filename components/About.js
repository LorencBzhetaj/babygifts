import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './About.module.css';

export default function About() {
  const ref = useRef(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll('.r') || [];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className={styles.about} ref={ref}>
      {/* Images side */}
      <div className={`${styles.imgs} r`}>
        <div className={styles.imgItem}>
          <div className={styles.imgInner}>
            <Image
              src="/images/product2.jpg"
              alt="Shportë artizanale dhuratë bebë - Baby Gifts Albania"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
        </div>
        <div className={`${styles.imgItem} ${styles.imgSecond}`}>
          <div className={styles.imgInner}>
            <Image
              src="/images/product4.jpg"
              alt="Set personalizuar me emër ari - Baby Gifts Albania"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
        </div>
        <div className={styles.floatBadge}>
          <span className={styles.floatNum}>★ 5.0</span>
          <span className={styles.floatLabel}>Vlerësim Klientësh</span>
        </div>
      </div>

      {/* Text side */}
      <div className={styles.text}>
        <span className="sTag r">✦ Pse Ne</span>
        <h2 className={`serifH2 r r2`}>
          Me Dashuri &amp;<br />
          <em>Kujdes Artizanal</em>
        </h2>
        <div className="r r3">
          <p className={styles.para}>
            Çdo shportë dhe kuti dhuratë krijohet me dorë, me kujdes dhe me respekt të thellë
            për detajet. Produktet tona nuk janë thjesht dhurata — janë momente të ruajtura
            përgjithmonë.
          </p>
          <blockquote className={styles.pullQuote}>
            "Çdo fjongo e lidhur, çdo veshje e zgjedhur — tregon dashurinë
            e marrë nga zemra."
          </blockquote>
          <p className={styles.para}>
            Çdo porosi është unike dhe personalizohet me emrin e bebit. Ne përdorim materiale
            premium organike dhe punime artizanale të kualitetit të lartë.
          </p>
        </div>

        <div className={`${styles.features} r r4`}>
          {[
            { icon: '✨', title: 'Personalizim me Emër Ari', desc: 'Emri i bebit i shkruar me shkronja ari — dhurata unike e llojit të saj.' },
            { icon: '🌸', title: 'Materiale Premium & Organike', desc: 'Veshje organike, fjongo velvet dhe lule të thata të zgjedhura me kujdes.' },
            { icon: '🎁', title: 'Paketim Luksoz', desc: 'Çdo dhuratë vjen e paketuar bukur, gati për t\'u dhuruar direkt.' },
            { icon: '🚀', title: 'Dorëzim i Shpejtë', desc: 'Brenda 48 orëve në Tiranë. Porosi via WhatsApp +355 69 288 1903.' },
          ].map((f) => (
            <div key={f.title} className={styles.feat}>
              <div className={styles.featIcon}>{f.icon}</div>
              <div>
                <div className={styles.featTitle}>{f.title}</div>
                <div className={styles.featDesc}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
