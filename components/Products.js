import { useState } from 'react';
import Image from 'next/image';
import ProductModal from './ProductModal';
import styles from './Products.module.css';

function catalogImage(product) {
  const original = product.mainImage || product.images?.[0] || '/images/hero-bg.jpg';
  const match = original.match(/^\/images\/product([1-6])\.jpg$/);
  return match ? '/images/catalog/product' + match[1] + '.webp' : original;
}

export default function Products({ products }) {
  const [selected, setSelected] = useState(null);
  return <>
      <section id="products" className={styles.products}>
        <div className={styles.header}>
          <h2 className="serifH2">Dhurata <em>të Veçanta</em><br />për Bebën Tuaj</h2>
          <a href="https://wa.me/355692881903" className="btnPrimary" target="_blank" rel="noopener noreferrer">Porosit Tani →</a>
        </div>
        <div className={styles.grid}>
          {products.map(product => <article className={styles.product} key={product.id}>
            <button className={styles.productLink} onClick={() => setSelected(product)} aria-label={'Shiko detajet: ' + product.name}>
              <div className={styles.image}><Image src={catalogImage(product)} alt={product.name + ' - Baby Gifts Albania'} width={1000} height={1000} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /></div>
              <h3>{product.name}</h3>
            </button>
              <p className={styles.description}>{product.description?.substring(0, 100)}...</p>
              <p className={styles.price}>{String(product.price).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} <span>Lekë</span></p>
              <div className={styles.actions}>
                <a className={styles.orderButton} href={`https://wa.me/355692881903?text=${encodeURIComponent('Dua të porosit: ' + product.name)}`} target="_blank" rel="noopener noreferrer">Porosit</a>
                <button className={styles.detailsButton} onClick={() => setSelected(product)}>Detaje</button>
              </div>
          </article>)}
        </div>
      </section>

    {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
  </>;
}
