import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from './login.module.css';
import { verifySessionToken } from '../../lib/auth';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        const data = await res.json();
        setError(data.error || 'Fjalëkalim i gabuar');
      }
    } catch {
      setError('Gabim lidhje. Provo përsëri.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin – Baby Gifts Albania</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.logo}>🎀</div>
          <h1 className={styles.title}>Paneli Admin</h1>
          <p className={styles.sub}>Baby Gifts Albania</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="password">Fjalëkalimi</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Fut fjalëkalimin..."
                required
                autoFocus
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Duke u kyçur...' : 'Hyr në Panel'}
            </button>
          </form>

          <a href="/" className={styles.back}>← Kthehu në faqe</a>
        </div>
      </div>
    </>
  );
}
