import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

export default function ProductModal({ product, onClose }) {
  const [activeImg, setActiveImg] = useState(0);
  const [view, setView] = useState('main');

  const images = [...new Set([
    product?.mainImage,
    ...(product?.images || [])
  ].filter(Boolean))];

  const next = useCallback(() =>
    setActiveImg(i => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() =>
    setActiveImg(i => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') view === 'gallery' ? setView('main') : onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [view, next, prev, onClose]);

  if (!product) return null;

  const waMsg = encodeURIComponent(`Dua të porosit: ${product.name} - ${product.price} Lekë`);

  // ── GALLERY VIEW ──
  if (view === 'gallery') {
    return (
      <div style={s.overlay} onClick={e => e.target === e.currentTarget && setView('main')}>
        <div style={s.galleryBox}>
          <div style={s.galleryHeader}>
            <button style={s.backBtn} onClick={() => setView('main')}>← Kthehu</button>
            <span style={s.galleryHeading}>
              {product.name}
              <small style={{ fontFamily:'Jost,sans-serif', fontSize:'0.75rem', color:'#a08888', fontStyle:'normal', marginLeft:'0.6rem' }}>
                {images.length} foto
              </small>
            </span>
            <button style={s.xBtn} onClick={onClose}>✕</button>
          </div>

          <div style={s.galleryGrid}>
            {images.map((img, i) => (
              <div
                key={i}
                style={{ ...s.galleryCard, ...(i === activeImg ? s.galleryCardActive : {}) }}
                onClick={() => { setActiveImg(i); setView('main'); }}
              >
                <div style={s.galleryImgWrap}>
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill
                    style={{ objectFit:'cover' }} sizes="220px" />
                </div>
                {i === activeImg && <div style={s.galleryStar}>★ Kryesorja</div>}
                <div style={s.galleryNum}>{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN DETAIL VIEW ──
  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modalBox}>
        <button style={s.xBtnFixed} onClick={onClose}>✕</button>

        <div style={s.grid}>

          {/* LEFT: imazhet */}
          <div style={s.left}>
            <div style={s.mainImgBox}>
              <Image key={activeImg} src={images[activeImg]} alt={product.name}
                fill priority style={{ objectFit:'cover', borderRadius:'1.1rem' }} sizes="420px" />

              {images.length > 1 && (
                <>
                  <button style={{ ...s.navArrow, left:'0.75rem' }} onClick={prev}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 3L5 8L10 13" stroke="#9e5a6a" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button style={{ ...s.navArrow, right:'0.75rem' }} onClick={next}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="#9e5a6a" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div style={s.counter}>{activeImg + 1} / {images.length}</div>
                </>
              )}
            </div>

            {/* Dot indicators */}
            {images.length > 1 && images.length <= 8 && (
              <div style={s.dots}>
                {images.map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{ ...s.dot, ...(i === activeImg ? s.dotActive : {}) }} />
                ))}
              </div>
            )}

            {/* Thumbnails + butoni "të gjitha" */}
            {images.length > 1 && (
              <div style={s.thumbRow}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{ ...s.thumb, ...(i === activeImg ? s.thumbActive : {}) }}>
                    <Image src={img} alt="" fill
                      style={{ objectFit:'cover', borderRadius:'0.45rem' }} sizes="60px" />
                  </button>
                ))}
                <button style={s.allBtn} onClick={() => setView('gallery')}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginBottom:'2px' }}>
                    <rect x="1" y="1" width="5" height="5" rx="1" stroke="#9e5a6a" strokeWidth="1.5"/>
                    <rect x="8" y="1" width="5" height="5" rx="1" stroke="#9e5a6a" strokeWidth="1.5"/>
                    <rect x="1" y="8" width="5" height="5" rx="1" stroke="#9e5a6a" strokeWidth="1.5"/>
                    <rect x="8" y="8" width="5" height="5" rx="1" stroke="#9e5a6a" strokeWidth="1.5"/>
                  </svg>
                  Të gjitha
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: info */}
          <div style={s.right}>
            <span style={s.badge}>{product.badge}</span>
            <h2 style={s.title}>{product.name}</h2>
            <div style={s.price}>{product.price?.toLocaleString('sq-AL')} Lekë</div>
            <p style={s.desc}>{product.description}</p>

            {product.includes?.length > 0 && (
              <div style={s.includesBox}>
                <p style={s.includesLabel}>Çfarë Përfshihet</p>
                <ul style={s.includesList}>
                  {product.includes.map((item, i) => (
                    <li key={i} style={s.includesItem}>
                      <span style={s.dot2}>✦</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a href={`https://wa.me/355697536334?text=${waMsg}`}
              style={s.waBtn} target="_blank" rel="noopener noreferrer">
                
              Porosit via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position:'fixed', inset:0,
    background:'rgba(42,26,30,0.72)', backdropFilter:'blur(10px)',
    zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center',
    padding:'1.5rem',
  },
  modalBox: {
    background:'#fff', borderRadius:'1.8rem',
    width:'100%', maxWidth:'880px', maxHeight:'90vh', overflowY:'auto',
    position:'relative', boxShadow:'0 32px 80px rgba(42,26,30,0.22)',
  },
  xBtnFixed: {
    position:'sticky', top:'1rem', float:'right', margin:'1rem 1rem 0 0',
    width:'34px', height:'34px', borderRadius:'50%',
    background:'#f5dede', border:'none', cursor:'pointer',
    fontSize:'0.85rem', color:'#9e5a6a', zIndex:10,
    display:'flex', alignItems:'center', justifyContent:'center',
  },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', clear:'both' },
  left: { padding:'1.5rem', display:'flex', flexDirection:'column', gap:'0.75rem' },
  mainImgBox: {
    width:'100%', height:'310px', borderRadius:'1.1rem',
    overflow:'hidden', position:'relative', background:'#f5dede', flexShrink:0,
  },
  navArrow: {
    position:'absolute', top:'50%', transform:'translateY(-50%)',
    width:'34px', height:'34px',
    background:'rgba(255,255,255,0.92)', backdropFilter:'blur(4px)',
    border:'1px solid rgba(201,144,154,0.25)', borderRadius:'50%',
    cursor:'pointer', zIndex:2,
    display:'flex', alignItems:'center', justifyContent:'center',
    boxShadow:'0 2px 8px rgba(42,26,30,0.12)', transition:'all 0.2s',
  },
  counter: {
    position:'absolute', bottom:'0.65rem', right:'0.65rem',
    background:'rgba(255,255,255,0.88)', backdropFilter:'blur(4px)',
    padding:'0.18rem 0.65rem', borderRadius:'50px',
    fontSize:'0.62rem', color:'#7a5a5a', fontFamily:'Jost,sans-serif',
  },
  dots: { display:'flex', justifyContent:'center', gap:'6px', marginTop:'-0.2rem' },
  dot: {
    width:'6px', height:'6px', borderRadius:'50%',
    background:'#e8c4c4', border:'none', cursor:'pointer',
    padding:0, transition:'all 0.2s',
  },
  dotActive: { background:'#9e5a6a', width:'18px', borderRadius:'3px' },
  thumbRow: { display:'flex', gap:'0.45rem', flexWrap:'wrap', alignItems:'center' },
  thumb: {
    width:'58px', height:'58px', borderRadius:'0.5rem',
    overflow:'hidden', position:'relative', cursor:'pointer',
    flexShrink:0, border:'2px solid transparent',
    background:'#f5dede', padding:0, transition:'border-color 0.2s',
  },
  thumbActive: { borderColor:'#9e5a6a' },
  allBtn: {
    width:'58px', height:'58px', borderRadius:'0.5rem',
    border:'1.5px dashed #e8c4c4', background:'transparent',
    cursor:'pointer', display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center', gap:'2px',
    fontSize:'0.55rem', color:'#9e5a6a', fontFamily:'Jost,sans-serif',
    transition:'all 0.2s', flexShrink:0,
  },
  right: { padding:'2.2rem 2rem 2rem 1.2rem', display:'flex', flexDirection:'column' },
  badge: {
    display:'inline-block', background:'#c4963c', color:'white',
    padding:'0.22rem 0.8rem', borderRadius:'50px',
    fontSize:'0.6rem', letterSpacing:'0.1em', textTransform:'uppercase',
    marginBottom:'0.9rem', fontWeight:400, width:'fit-content',
    fontFamily:'Jost,sans-serif',
  },
  title: {
    fontFamily:'Cormorant Garamond,serif', fontSize:'1.65rem',
    fontWeight:400, color:'#2a1a1e', marginBottom:'0.35rem', lineHeight:1.15,
  },
  price: {
    fontFamily:'Cormorant Garamond,serif', fontSize:'1.45rem',
    color:'#9e5a6a', marginBottom:'1rem',
  },
  desc: {
    fontSize:'0.86rem', lineHeight:1.85, color:'#7a5a5a',
    marginBottom:'1.2rem', fontFamily:'Jost,sans-serif',
  },
  includesBox: {
    background:'#faf5ef', borderRadius:'0.8rem',
    padding:'0.85rem 1rem', marginBottom:'1.4rem',
  },
  includesLabel: {
    fontSize:'0.6rem', letterSpacing:'0.18em', textTransform:'uppercase',
    color:'#c4963c', marginBottom:'0.55rem', fontWeight:400,
    fontFamily:'Jost,sans-serif',
  },
  includesList: { listStyle:'none', display:'flex', flexDirection:'column', gap:'0.28rem' },
  includesItem: {
    fontSize:'0.8rem', color:'#7a5a5a',
    display:'flex', alignItems:'center', gap:'0.45rem',
    fontFamily:'Jost,sans-serif',
  },
  dot2: { color:'#c9909a', fontSize:'0.45rem', flexShrink:0 },
  waBtn: {
    background:'#9e5a6a', color:'white', padding:'0.88rem',
    borderRadius:'50px', fontSize:'0.84rem', fontWeight:400,
    textDecoration:'none', textAlign:'center', display:'block',
    marginTop:'auto', fontFamily:'Jost,sans-serif',
  },
  galleryBox: {
    background:'#fff', borderRadius:'1.8rem',
    width:'100%', maxWidth:'860px', maxHeight:'90vh', overflowY:'auto',
    padding:'1.8rem', boxShadow:'0 32px 80px rgba(42,26,30,0.22)',
  },
  galleryHeader: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    marginBottom:'1.5rem', paddingBottom:'1rem', borderBottom:'1px solid #f4ece2',
  },
  backBtn: {
    background:'#f5dede', border:'none', padding:'0.45rem 1rem',
    borderRadius:'50px', fontSize:'0.76rem', color:'#9e5a6a',
    cursor:'pointer', fontFamily:'Jost,sans-serif',
  },
  galleryHeading: {
    fontFamily:'Cormorant Garamond,serif', fontSize:'1.15rem',
    color:'#2a1a1e', fontWeight:400, fontStyle:'italic',
  },
  xBtn: {
    background:'#f5dede', border:'none', width:'32px', height:'32px',
    borderRadius:'50%', fontSize:'0.8rem', color:'#9e5a6a',
    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
  },
  galleryGrid: {
    display:'grid',
    gridTemplateColumns:'repeat(auto-fill, minmax(175px, 1fr))',
    gap:'0.9rem',
  },
  galleryCard: {
    borderRadius:'0.9rem', overflow:'hidden', position:'relative',
    cursor:'pointer', border:'2px solid transparent',
    transition:'all 0.22s', background:'#f5dede',
  },
  galleryCardActive: { border:'2px solid #9e5a6a' },
  galleryImgWrap: { width:'100%', height:'175px', position:'relative' },
  galleryStar: {
    position:'absolute', bottom:'0.5rem', left:'0.5rem',
    background:'#9e5a6a', color:'white', fontSize:'0.58rem',
    padding:'0.18rem 0.6rem', borderRadius:'50px', fontFamily:'Jost,sans-serif',
  },
  galleryNum: {
    position:'absolute', top:'0.5rem', right:'0.5rem',
    background:'rgba(255,255,255,0.88)', fontSize:'0.6rem', color:'#7a5a5a',
    width:'22px', height:'22px', borderRadius:'50%',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontFamily:'Jost,sans-serif',
  },
};