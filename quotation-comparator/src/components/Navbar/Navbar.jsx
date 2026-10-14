import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import bidzLogo from '../../assets/images/bidz_logo.png';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
      <div className={styles.navInner}>
        {/* Logo — Exact image rendered in crisp branded white container */}
        <Link to="/" className={styles.logoLink} title="bidz.ai — Autonomous Quotation Intelligence">
          <div className={styles.logoBadge}>
            <img src={bidzLogo} alt="bidz.ai" className={styles.logoImg} />
          </div>
        </Link>

        {/* Right side navigation actions (New Comparison & Vault removed from Navbar to keep in one place) */}
        <div className={styles.navRight}>
          {location.pathname !== '/' && (
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              <ArrowBackIcon sx={{ fontSize: 17 }} />
              <span>Back</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
