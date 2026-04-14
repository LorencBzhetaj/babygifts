import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './Contact.module.css';

export default function Contact() {
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
    <section id="contact" className={styles.contact} ref={ref}>
      <div className={`${styles.header} r`}>
        <span className="sTag">✦ Na Kontaktoni</span>
        <h2 className="serifH2">
          Porosisni <em>Dhuratën</em> Tuaj
        </h2>
        <p>Jemi këtu për t&apos;ju ndihmuar të zgjidhni dhuratën e përsosur. Përgjigjemi me kënaqësi!</p>
      </div>

      <div className={styles.grid}>
        <div className={`${styles.cards} r r2`}>
          {[
            { href: 'tel:355692881903', icon: '📞', title: 'Na Telefononi', val: '+355 69 288 1903', ext: false },
            { href: 'https://wa.me/355692881903', icon: '💬', title: 'WhatsApp', val: 'Mesazh i drejtpërdrejtë', ext: true },
            { href: 'https://www.instagram.com/dhurata_per_bebin', icon: '📸', title: 'Instagram', val: '@dhurata_per_bebin', ext: true },
            { href: null, icon: '📍', title: 'Vendndodhja', val: 'Tiranë, Shqipëri 🇦🇱', ext: false },
          ].map((c) => (
            c.href ? (
              <a
                key={c.title}
                href={c.href}
                className={styles.card}
                target={c.ext ? '_blank' : undefined}
                rel={c.ext ? 'noopener noreferrer' : undefined}
              >
                <div className={styles.icon}>{c.icon}</div>
                <div>
                  <div className={styles.cardTitle}>{c.title}</div>
                  <div className={styles.cardVal}>{c.val}</div>
                </div>
              </a>
            ) : (
              <div key={c.title} className={styles.card}>
                <div className={styles.icon}>{c.icon}</div>
                <div>
                  <div className={styles.cardTitle}>{c.title}</div>
                  <div className={styles.cardVal}>{c.val}</div>
                </div>
              </div>
            )
          ))}
        </div>

        <div className={`${styles.imgWrap} r r3`}>
          <div className={styles.imgInner}>
            <Image
              src="/images/product6.jpg"
              alt="Dhurata për bebë - Baby Gifts Albania Tiranë"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
