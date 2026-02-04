'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
          </div>
          <span className={styles.logoText}>MediDonate</span>
        </Link>

        <nav className={styles.nav}>
          <Link 
            href="/" 
            className={pathname === '/' ? styles.active : ''}
          >
            Home
          </Link>
          <Link 
            href="/donor" 
            className={pathname?.startsWith('/donor') ? styles.active : ''}
          >
            Donor Portal
          </Link>
          <Link 
            href="/hospital" 
            className={pathname?.startsWith('/hospital') ? styles.active : ''}
          >
            Hospital Portal
          </Link>
          <Link 
            href="/admin" 
            className={pathname?.startsWith('/admin') ? styles.active : ''}
          >
            Admin Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}