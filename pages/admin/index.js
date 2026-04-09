import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import styles from './index.module.css';
import { parse } from 'cookie';

export async function getServerSideProps({ req }) {
  const cookies = parse(req.headers.cookie || '');
  const isAuth = cookies['admin_session'] === 
    (process.env.ADMIN_PASSWORD || 'babygifts2025admin');

  if (!isAuth) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
}

const EMPTY_FORM = {
  name: '',
  badge: '',
  price: '',
  description: '',
  includes: '',
  category: 'neutral',
  featured: false,
  mainImage: '',
  images: [],
};

export default function AdminPanel() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploadingImgs, setUploadingImgs] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const fileRef = useRef(null);

  // ── Auth check ──
  useEffect(() => {
    fetch('/api/products')
      .then(r => { if (r.status === 401) router.push('/admin/login'); return r.json(); })
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { router.push('/admin/login'); });
  }, [router]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Load products ──
  const loadProducts = async () => {
    const r = await fetch('/api/products');
    const data = await r.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  // ── Open form for new product ──
  const openNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setView('form');
    window.scrollTo(0, 0);
  };

  // ── Open form for existing product ──
  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || '',
      badge: product.badge || '',
      price: product.price || '',
      description: product.description || '',
      includes: (product.includes || []).join('\n'),
      category: product.category || 'neutral',
      featured: product.featured || false,
      mainImage: product.mainImage || '',
      images: product.images || [],
    });
    setView('form');
    window.scrollTo(0, 0);
  };

  // ── Handle image upload ──
  const handleImgUpload = async (files) => {
    if (!files?.length) return;
    setUploadingImgs(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach(f => fd.append('file', f));
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (!r.ok) throw new Error();
      const { urls } = await r.json();
      setForm(prev => {
        const newImages = [...(prev.images || []), ...urls];
        return {
          ...prev,
          images: newImages,
          mainImage: prev.mainImage || newImages[0] || '',
        };
      });
      showToast(`${urls.length} foto u ngarkua me sukses!`);
    } catch {
      showToast('Ngarkimi i fotografive dështoi.', 'error');
    } finally {
      setUploadingImgs(false);
    }
  };

  // ── Set main image ──
  const setMainImage = (url) => {
    setForm(prev => ({ ...prev, mainImage: url }));
  };

  // ── Remove image ──
  const removeImage = (url) => {
    setForm(prev => {
      const newImages = prev.images.filter(i => i !== url);
      return {
        ...prev,
        images: newImages,
        mainImage: prev.mainImage === url ? (newImages[0] || '') : prev.mainImage,
      };
    });
  };

  // ── Save product ──
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      showToast('Emri dhe çmimi janë të detyrueshëm.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        includes: form.includes
          ? form.includes.split('\n').map(s => s.trim()).filter(Boolean)
          : [],
        images: form.images || [],
        mainImage: form.mainImage || form.images?.[0] || '',
      };

      const url = editingId ? `/api/products?id=${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!r.ok) throw new Error();
      await loadProducts();
      setView('list');
      showToast(editingId ? 'Produkti u përditësua!' : 'Produkti u shtua!');
    } catch {
      showToast('Ruajtja dështoi. Provo përsëri.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete product ──
  const handleDelete = async (id) => {
    try {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      await loadProducts();
      setConfirmDelete(null);
      showToast('Produkti u fshi!');
    } catch {
      showToast('Fshirja dështoi.', 'error');
    }
  };

  // ── Logout ──
  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner}></div>
        <p>Duke ngarkuar...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Panel – Baby Gifts Albania</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : styles.toastSuccess}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <div className={styles.confirmIcon}>🗑️</div>
            <h3>Fshi Produktin</h3>
            <p>A jeni i sigurt që dëshironi të fshini <strong>{confirmDelete.name}</strong>? Ky veprim nuk mund të kthehet prapa.</p>
            <div className={styles.confirmActions}>
              <button className={styles.btnCancel} onClick={() => setConfirmDelete(null)}>Anulo</button>
              <button className={styles.btnDeleteConfirm} onClick={() => handleDelete(confirmDelete.id)}>Po, Fshi</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLogo}>
            <span>🎀</span>
            <div>
              <strong>Baby Gifts</strong>
              <small>Admin Panel</small>
            </div>
          </div>
          <nav className={styles.sideNav}>
            <button
              className={`${styles.navItem} ${view === 'list' ? styles.navActive : ''}`}
              onClick={() => setView('list')}
            >
              📦 Produktet ({products.length})
            </button>
            <button
              className={`${styles.navItem} ${view === 'form' && !editingId ? styles.navActive : ''}`}
              onClick={openNew}
            >
              ➕ Produkt i Ri
            </button>
            <a href="/" target="_blank" className={styles.navItem}>
              🌐 Shiko Faqen
            </a>
          </nav>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            ← Dil
          </button>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          {/* ── PRODUCT LIST ── */}
          {view === 'list' && (
            <div>
              <div className={styles.pageHeader}>
                <div>
                  <h1 className={styles.pageTitle}>Produktet</h1>
                  <p className={styles.pageSub}>{products.length} produkte në total</p>
                </div>
                <button className={styles.btnAdd} onClick={openNew}>+ Shto Produkt</button>
              </div>

              {products.length === 0 ? (
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>📦</div>
                  <p>Nuk ka produkte akoma.</p>
                  <button className={styles.btnAdd} onClick={openNew}>Shto Produktin e Parë</button>
                </div>
              ) : (
                <div className={styles.productList}>
                  {products.map(p => (
                    <div key={p.id} className={styles.productRow}>
                      <div className={styles.productRowImg}>
                        {(p.mainImage || p.images?.[0]) ? (
                          <Image
                            src={p.mainImage || p.images[0]}
                            alt={p.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="80px"
                          />
                        ) : (
                          <span className={styles.noImgIcon}>🎁</span>
                        )}
                      </div>
                      <div className={styles.productRowInfo}>
                        <div className={styles.productRowName}>{p.name}</div>
                        <div className={styles.productRowMeta}>
                          <span className={styles.pill}>{p.badge}</span>
                          <span className={styles.pill}>{p.category}</span>
                          {p.featured && <span className={`${styles.pill} ${styles.pillGold}`}>⭐ Featured</span>}
                          <span className={styles.pillImages}>🖼 {(p.images?.length || 0)} foto</span>
                        </div>
                        <div className={styles.productRowDesc}>{p.description?.substring(0, 90)}...</div>
                      </div>
                      <div className={styles.productRowPrice}>
                        {Number(p.price).toLocaleString('sq-AL')} L
                      </div>
                      <div className={styles.productRowActions}>
                        <button className={styles.btnEdit} onClick={() => openEdit(p)}>✏️ Edito</button>
                        <button className={styles.btnDelete} onClick={() => setConfirmDelete(p)}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PRODUCT FORM ── */}
          {view === 'form' && (
            <div>
              <div className={styles.pageHeader}>
                <div>
                  <h1 className={styles.pageTitle}>
                    {editingId ? '✏️ Edito Produktin' : '➕ Produkt i Ri'}
                  </h1>
                  <p className={styles.pageSub}>
                    {editingId ? 'Përditëso informacionin e produktit' : 'Shto një produkt të ri në koleksion'}
                  </p>
                </div>
                <button className={styles.btnSecondary} onClick={() => setView('list')}>
                  ← Kthehu
                </button>
              </div>

              <form onSubmit={handleSave} className={styles.form}>
                <div className={styles.formGrid}>
                  {/* Left Column */}
                  <div className={styles.formCol}>
                    {/* Images Section */}
                    <div className={styles.formSection}>
                      <h2 className={styles.sectionTitle}>📸 Fotografitë e Produktit</h2>

                      {/* Upload Zone */}
                      <div
                        className={styles.uploadZone}
                        onClick={() => fileRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add(styles.dragOver); }}
                        onDragLeave={e => e.currentTarget.classList.remove(styles.dragOver)}
                        onDrop={e => {
                          e.preventDefault();
                          e.currentTarget.classList.remove(styles.dragOver);
                          handleImgUpload(e.dataTransfer.files);
                        }}
                      >
                        {uploadingImgs ? (
                          <div className={styles.uploadLoading}>
                            <div className={styles.spinner}></div>
                            <span>Duke ngarkuar...</span>
                          </div>
                        ) : (
                          <>
                            <div className={styles.uploadIcon}>📷</div>
                            <p>Klikoni ose tërhiqni foto këtu</p>
                            <small>PNG, JPG, WEBP · Maks 5MB secila</small>
                          </>
                        )}
                      </div>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={e => handleImgUpload(e.target.files)}
                      />

                      {/* Image Gallery */}
                      {form.images?.length > 0 && (
                        <div className={styles.imgGallery}>
                          {form.images.map((url, i) => (
                            <div key={i} className={`${styles.imgThumb} ${url === form.mainImage ? styles.imgThumbMain : ''}`}>
                              <div className={styles.imgThumbInner}>
                                <Image src={url} alt="" fill style={{ objectFit: 'cover' }} sizes="100px" />
                              </div>
                              <div className={styles.imgThumbActions}>
                                {url !== form.mainImage && (
                                  <button
                                    type="button"
                                    className={styles.imgBtnMain}
                                    onClick={() => setMainImage(url)}
                                    title="Vendos si kryesore"
                                  >⭐</button>
                                )}
                                {url === form.mainImage && (
                                  <span className={styles.imgMainBadge}>Kryesorja</span>
                                )}
                                <button
                                  type="button"
                                  className={styles.imgBtnRemove}
                                  onClick={() => removeImage(url)}
                                  title="Hiq fotografinë"
                                >✕</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Manual URL input */}
                      <div className={styles.formField}>
                        <label>Ose shto URL fotografie (opsionale)</label>
                        <div className={styles.urlRow}>
                          <input
                            type="text"
                            placeholder="/images/products/foto.jpg"
                            id="urlInput"
                          />
                          <button
                            type="button"
                            className={styles.btnSmall}
                            onClick={() => {
                              const val = document.getElementById('urlInput').value.trim();
                              if (val) {
                                setForm(prev => ({
                                  ...prev,
                                  images: [...(prev.images || []), val],
                                  mainImage: prev.mainImage || val,
                                }));
                                document.getElementById('urlInput').value = '';
                              }
                            }}
                          >Shto</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className={styles.formCol}>
                    <div className={styles.formSection}>
                      <h2 className={styles.sectionTitle}>📝 Informacioni</h2>

                      <div className={styles.formField}>
                        <label>Emri i Produktit *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="p.sh. Shportë Rozë & Ari"
                          required
                        />
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formField}>
                          <label>Çmimi (Lekë) *</label>
                          <input
                            type="number"
                            value={form.price}
                            onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                            placeholder="5000"
                            min="0"
                            required
                          />
                        </div>
                        <div className={styles.formField}>
                          <label>Kategoria</label>
                          <select
                            value={form.category}
                            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                          >
                            <option value="neutral">🤍 Neutral</option>
                            <option value="vajza">💗 Për Vajzën</option>
                            <option value="djem">💙 Për Djalin</option>
                            <option value="personalizuar">✨ Personalizuar</option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.formField}>
                        <label>Badge / Etiketa</label>
                        <input
                          type="text"
                          value={form.badge}
                          onChange={e => setForm(p => ({ ...p, badge: e.target.value }))}
                          placeholder="p.sh. 💗 Për Vajzën"
                        />
                      </div>

                      <div className={styles.formField}>
                        <label>Përshkrimi</label>
                        <textarea
                          value={form.description}
                          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                          placeholder="Përshkruani produktin në detaje..."
                          rows={4}
                        />
                      </div>

                      <div className={styles.formField}>
                        <label>Çfarë Përfshihet (një rresht = një artikull)</label>
                        <textarea
                          value={form.includes}
                          onChange={e => setForm(p => ({ ...p, includes: e.target.value }))}
                          placeholder={`Veshje organike\nArushe Teddy\nFurçë natyrale\nKartë personalizuar`}
                          rows={5}
                        />
                      </div>

                      <div className={styles.formField}>
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                          />
                          <span>⭐ Shfaq si produkt i veçantë (featured)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form actions */}
                <div className={styles.formActions}>
                  <button type="button" className={styles.btnSecondary} onClick={() => setView('list')}>
                    Anulo
                  </button>
                  <button type="submit" className={styles.btnSave} disabled={saving}>
                    {saving ? 'Duke ruajtur...' : editingId ? '✓ Përditëso' : '✓ Shto Produktin'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
