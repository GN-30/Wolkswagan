import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BrandBar.module.css';
import bidzLogo from '../../assets/images/bidz_logo.png';

/**
 * BrandBar — Minimal top bar showing only the bidz.ai icon with 5px border radius.
 */
export default function BrandBar() {
  return (
    <header className={styles.brandBar}>
      <Link to="/" className={styles.brandLink} title="bidz.ai — Home">
        <div className={styles.logoBadge}>
          <img src={bidzLogo} alt="bidz.ai logo" className={styles.logoImg} />
        </div>
      </Link>
    </header>
  );
}
