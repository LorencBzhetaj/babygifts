import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function ProductModal({ product, onClose }) {
  const [activeImg, setActiveImg] = useState(0)

  const images = [
    ...new Set([product?.mainImage, ...(product?.images || [])].filter(Boolean))
  ]

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  if (!product) return null

  const waMsg = encodeURIComponent(
    `Dua të porosit: ${product.name} - ${product.price} Lekë`
  )

  return (
    <>
      <style>{`

.pm-overlay{
position:fixed;
inset:0;
background:rgba(42,26,30,0.72);
backdrop-filter:blur(10px);
z-index:1000;
display:flex;
align-items:flex-end;
justify-content:center;
padding:0.5rem;
}

.pm-box{
background:#fff;
border-radius:1.2rem 1.2rem 0 0;
width:100%;
max-width:880px;
max-height:100vh;
overflow-y:auto;
position:relative;
box-shadow:0 32px 80px rgba(42,26,30,0.22);
}

.pm-close{
position:absolute;
top:1rem;
right:1rem;
width:34px;
height:34px;
border-radius:50%;
background:#f5dede;
border:none;
cursor:pointer;
font-size:0.85rem;
color:#9e5a6a;
display:flex;
align-items:center;
justify-content:center;
z-index:10;
}

.pm-grid{
display:grid;
grid-template-columns:1fr;
}

.pm-left{
display:flex;
flex-direction:column;
}

.pm-img-box{
 display: flex;
  align-items: center;
  justify-content: center;
}

.pm-img-mobile{
width:100%;
height:auto;
object-fit:contain;
display:block;
}

.pm-img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.pm-thumbs{
display:flex;
gap:0.4rem;
flex-wrap:wrap;
padding:0.5rem 1rem;
}

.pm-thumb{
width:64px;
height:52px;
border-radius:0.5rem;
overflow:hidden;
cursor:pointer;
border:none;
padding:0;
background:none;
flex-shrink:0;
outline:2px solid transparent;
outline-offset:2px;
transition:outline-color .2s;
}

.pm-thumb.active{
outline:2px solid #9e5a6a;
}

.pm-thumb img{
width:100%;
height:100%;
object-fit:cover;
}

.pm-right{
padding:1.2rem 1rem 1.5rem;
display:flex;
flex-direction:column;
}

.pm-badge{
display:inline-block;
background:#c4963c;
color:white;
padding:0.25rem 0.8rem;
border-radius:50px;
font-size:0.6rem;
letter-spacing:.1em;
text-transform:uppercase;
margin-bottom:.9rem;
font-family:Jost,sans-serif;
}

.pm-title{
font-family:'Cormorant Garamond',serif;
font-size:1.6rem;
color:#2a1a1e;
margin:0 0 .4rem;
line-height:1.2;
}

.pm-price{
font-family:'Cormorant Garamond',serif;
font-size:1.35rem;
color:#9e5a6a;
margin-bottom:.5rem;
}

.pm-divider{
height:1px;
background:#f4ece2;
margin:.8rem 0;
}

.pm-desc{
font-size:.85rem;
line-height:1.7;
color:#7a5a5a;
font-family:Jost,sans-serif;
}

.pm-includes-box{
background:#faf5ef;
border-radius:.8rem;
padding:.8rem 1rem;
}

.pm-includes-label{
font-size:.6rem;
letter-spacing:.18em;
text-transform:uppercase;
color:#c4963c;
margin-bottom:.5rem;
font-family:Jost,sans-serif;
}

.pm-includes-list{
list-style:none;
padding:0;
margin:0;
display:flex;
flex-direction:column;
gap:.3rem;
}

.pm-includes-item{
font-size:.8rem;
color:#7a5a5a;
display:flex;
gap:.4rem;
font-family:Jost,sans-serif;
}

.pm-dot{
color:#c9909a;
font-size:.45rem;
}

.pm-actions{
display:flex;
flex-direction:column;
gap:.6rem;
margin-top:1rem;
}

.pm-wa-btn{
background:#9e5a6a;
color:white;
padding:.75rem 1rem;
border-radius:50px;
font-size:.8rem;
font-family:Jost,sans-serif;
text-decoration:none;
display:flex;
align-items:center;
justify-content:space-between;
}

.pm-ig-btn{
background:#f5dede;
color:#9e5a6a;
padding:.75rem 1rem;
border-radius:50px;
font-size:.8rem;
font-family:Jost,sans-serif;
text-decoration:none;
display:flex;
align-items:center;
justify-content:space-between;
}

@media (min-width:640px){

.pm-overlay{
padding:1.5rem;
align-items:center;
}

.pm-box{
border-radius:1.8rem;
max-height:90vh;
}

.pm-grid{
grid-template-columns:1fr 1fr;
}

.pm-img-box{
border-radius:1.8rem 0 0 1.8rem;
position:relative;
min-height:460px;
}

.pm-img-mobile{
display:none;
}

.pm-img-desktop{
display:block;
position:absolute;
inset:0;
width:100%;
height:100%;
object-fit:cover;
}

.pm-right{
padding:2rem 2rem 2rem 1.5rem;
}

}

`}</style>

      <div
        className="pm-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="pm-box">
          <button className="pm-close" onClick={onClose}>
            ✕
          </button>

          <div className="pm-grid">

            <div className="pm-left">
              <div className="pm-img-box">
                <Image
  className="pm-img"
  src={images[activeImg]}
  alt={product.name}
  width={800}
  height={600}
  priority
/>
              </div>

              {images.length > 1 && (
                <div className="pm-thumbs">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      className={`pm-thumb ${i === activeImg ? 'active' : ''}`}
                      onClick={() => setActiveImg(i)}
                    >
                      <Image
                        src={src}
                        alt={`${product.name} foto ${i + 1}`}
                        width={64}
                        height={52}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pm-right">

              {product.badge && (
                <span className="pm-badge">{product.badge}</span>
              )}

              <h2 className="pm-title">{product.name}</h2>

              {product.price && (
                <div className="pm-price">
                  {product.price?.toLocaleString('sq-AL')} Lekë
                </div>
              )}

              {product.description && (
                <>
                  <div className="pm-divider" />
                  <p className="pm-desc">{product.description}</p>
                </>
              )}

              {product.includes?.length > 0 && (
                <>
                  <div className="pm-divider" />

                  <div className="pm-includes-box">
                    <p className="pm-includes-label">Çfarë Përfshihet</p>

                    <ul className="pm-includes-list">
                      {product.includes.map((item, i) => (
                        <li key={i} className="pm-includes-item">
                          <span className="pm-dot">✦</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <div className="pm-divider" />

              <div className="pm-actions">

                <a
                  href={`https://wa.me/355697536334?text=${waMsg}`}
                  className="pm-wa-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>💬 Porosit në WhatsApp</span>
                  <span>→</span>
                </a>

                

              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}