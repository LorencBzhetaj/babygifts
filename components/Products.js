import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ProductModal from './ProductModal';
import styles from './Products.module.css';

export default function Products({ products }) {
  const ref = useRef(null);
  const [selected, setSelected] = useState(null);

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
    <>
      <section id="products" className={styles.products} ref={ref}>
        <div className={`${styles.header} r`}>
          <div>
            <span className="sTag">✦ Koleksioni</span>
            <h2 className="serifH2">
              Dhurata <em>të Veçanta</em><br />
              për Bebën Tuaj
            </h2>
          </div>
          <a
            href="https://wa.me/355 69 288 1903"
            className="btnPrimary"
            style={{ whiteSpace: 'nowrap' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Porosit Tani →
          </a>
        </div>

        <div className={styles.grid}>
          {products.map((product, i) => {
            const delay = i % 3;
            return (
              <div
                key={product.id}
                className={`${styles.card} r ${delay === 1 ? 'r2' : delay === 2 ? 'r3' : ''}`}
              >
                <div className={styles.imgWrap}>
                  <div className={styles.imgInner}>
                    <Image
                      src={product.mainImage || product.images?.[0] || '/images/hero-bg.jpg'}
                      alt={`${product.name} - Baby Gifts Albania`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <span className={styles.badge}>{product.badge}</span>
                </div>
                <div className={styles.body}>
                  <div className={styles.name}>{product.name}</div>
                  <p className={styles.desc}>{product.description?.substring(0, 100)}...</p>
                  <div className={styles.price}>{product.price?.toLocaleString('sq-AL')} Lekë</div>
                  <div className={styles.actions}>
                    <a
                      href={`https://wa.me/355692881903?text=${encodeURIComponent('Dua të porosit: ' + product.name)}`}
                      className={styles.btnWa}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      💛 Porosit
                    </a>
                    <button
                      className={styles.btnDetails}
                      onClick={() => setSelected(product)}
                    >
                      🔍 Detaje
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
