import React, { useState, useCallback } from 'react';
import styles from './ZipperToggle.module.css';

/**
 * ZipperToggle — A bottom-left zip/zipper button that:
 * 1. On click, animates a diagonal wipe from bottom-left → top-right via clip-path
 * 2. Gradually transitions the entire page between dark and light themes
 * 3. Shows a moving zipper pull icon along the wipe diagonal
 */
export default function ZipperToggle({ isDark, onToggle }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle | unzipping | done

  const handleClick = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPhase('unzipping');

    // Trigger the actual theme switch midway through the animation
    const switchTimeout = setTimeout(() => {
      onToggle();
    }, 420);

    // End animation
    const endTimeout = setTimeout(() => {
      setIsAnimating(false);
      setPhase('idle');
    }, 900);

    return () => {
      clearTimeout(switchTimeout);
      clearTimeout(endTimeout);
    };
  }, [isAnimating, onToggle]);

  return (
    <>
      {/* The animated diagonal overlay wipe */}
      <div
        className={`${styles.zipWipeOverlay} ${phase === 'unzipping' ? styles.zipWipeActive : ''} ${
          isDark ? styles.wipeToLight : styles.wipeToDark
        }`}
        aria-hidden="true"
      />

      {/* Zipper pull button */}
      <button
        type="button"
        className={`${styles.zipBtn} ${isAnimating ? styles.zipBtnAnimating : ''}`}
        onClick={handleClick}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {/* Zipper teeth track */}
        <div className={styles.zipTrack} aria-hidden="true">
          <span className={styles.zipTooth} />
          <span className={styles.zipTooth} />
          <span className={styles.zipTooth} />
          <span className={styles.zipTooth} />
          <span className={styles.zipTooth} />
        </div>

        {/* The pull tab */}
        <div className={`${styles.zipPull} ${isAnimating ? styles.zipPullRun : ''}`}>
          <div className={styles.zipPullIcon}>
            {isDark ? (
              /* Sun icon for dark mode (clicking switches to light) */
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <circle cx="12" cy="12" r="4.5" fill="#FCD34D" />
                <line x1="12" y1="2" x2="12" y2="5" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="19" x2="12" y2="22" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
                <line x1="2" y1="12" x2="5" y2="12" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
                <line x1="19" y1="12" x2="22" y2="12" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
                <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
                <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
                <line x1="19.07" y1="4.93" x2="16.95" y2="7.05" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
                <line x1="7.05" y1="16.95" x2="4.93" y2="19.07" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              /* Moon icon for light mode (clicking switches to dark) */
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
                  fill="#6366F1"
                  stroke="#6366F1"
                  strokeWidth="1"
                />
              </svg>
            )}
          </div>
          <div className={styles.zipPullLabel}>
            {isDark ? 'Light' : 'Dark'}
          </div>
        </div>

        {/* Glow ring */}
        <div className={styles.zipGlow} aria-hidden="true" />
      </button>
    </>
  );
}
