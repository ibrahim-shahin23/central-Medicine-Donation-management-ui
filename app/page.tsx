import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Save Lives Through
            <span className={styles.gradient}> Medicine Donation</span>
          </h1>
          <p className={styles.heroDescription}>
            Connect donors with hospitals in need. Our intelligent system ensures medicine reaches those who need it most, efficiently and safely.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/donor" className="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Donate Medicine
            </Link>
            <Link href="/hospital" className="btn btn-outline">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/>
                <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/>
              </svg>
              Request Medicine
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.heroCard}>
            <div className={styles.cardIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M12 8v8M8 12h8"/>
              </svg>
            </div>
            <div className={styles.cardStats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>1,250+</div>
                <div className={styles.statLabel}>Donations</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>850+</div>
                <div className={styles.statLabel}>Fulfilled Requests</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <h3>Verified Donations</h3>
            <p>All donations are validated for safety, expiration dates, and storage conditions.</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h3>Fast Processing</h3>
            <p>Intelligent priority system ensures emergency requests are handled first.</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3>Location-Based</h3>
            <p>Matches donations with nearby hospitals to minimize delivery time.</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18"/>
                <path d="M18 17V9M13 17V5M8 17v-3"/>
              </svg>
            </div>
            <h3>Real-time Tracking</h3>
            <p>Monitor stock levels and request status with comprehensive dashboards.</p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaCard}>
          <h2>Ready to Make a Difference?</h2>
          <p>Join our community of donors and healthcare providers working together to save lives.</p>
          <Link href="/donor" className="btn btn-primary">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}