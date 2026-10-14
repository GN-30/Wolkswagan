import React from 'react';
import styles from './QuoteCard.module.css';
import { categoryColors } from '../../data/dummyData';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function QuoteCard({ comparison, onViewComparison, animDelay = 0 }) {
  const { title, date, status, vendors, totalItems, winner, savings, summary } = comparison;
  const colorConfig = categoryColors[title] || { bg: '#F1F5F9', accent: '#475569', icon: '📄' };

  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const bestScore =
    summary && Object.keys(summary).length > 0
      ? Math.max(...Object.values(summary).map((s) => s?.overallScore || 0))
      : null;

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${animDelay}ms` }}
      onClick={() => status === 'Completed' && onViewComparison(comparison)}
    >
      {/* Animated glowing border on hover */}
      <div className={styles.cardAnimatedBorder} />
      <div className={styles.cardTopBar} />

      {/* Header */}
      <div className={styles.cardHeader}>
        <div
          className={styles.cardIconWrapper}
          style={{ background: colorConfig.bg }}
        >
          {colorConfig.icon}
        </div>
        <div className={styles.cardHeaderText}>
          <div className={styles.cardTitle}>{title}</div>
          <div className={styles.cardMeta}>
            <span className={styles.cardDate}>
              <CalendarTodayIcon sx={{ fontSize: 11 }} />
              {formattedDate}
            </span>
            <span
              className={
                styles.statusBadge +
                ' ' +
                (status === 'Completed' ? styles.statusCompleted : styles.statusInProgress)
              }
            >
              <span
                className={
                  styles.statusDot +
                  ' ' +
                  (status === 'Completed'
                    ? styles.statusDotCompleted
                    : styles.statusDotInProgress)
                }
              />
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        {/* Metrics */}
        <div className={styles.metricsRow}>
          <div className={styles.metricBox}>
            <div className={styles.metricValue}>{vendors.length}</div>
            <div className={styles.metricLabel}>Vendors</div>
          </div>
          <div className={styles.metricBox}>
            <div className={styles.metricValue}>{totalItems}</div>
            <div className={styles.metricLabel}>Items</div>
          </div>
          <div className={styles.metricBox}>
            <div className={styles.metricValue} style={{ color: colorConfig.accent }}>
              {bestScore ? `${bestScore}%` : '—'}
            </div>
            <div className={styles.metricLabel}>Best Score</div>
          </div>
        </div>

        {/* Vendors */}
        <div className={styles.vendorsSection}>
          <div className={styles.vendorsSectionLabel}>Vendors</div>
          <div className={styles.vendorsList}>
            {vendors.map((v) => (
              <span
                key={v}
                className={
                  styles.vendorChip + (v === winner ? ' ' + styles.vendorChipWinner : '')
                }
              >
                {v === winner && <span className={styles.winnerCrown}>👑 </span>}
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* Savings banner */}
        {savings && (
          <div className={styles.savingsBanner}>
            <span className={styles.savingsLabel}>
              <TrendingDownIcon sx={{ fontSize: 13, mr: 0.5, verticalAlign: 'middle' }} />
              Potential Savings
            </span>
            <span className={styles.savingsAmount}>{savings}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.cardFooter}>
        {status === 'Completed' ? (
          <button
            className={styles.viewBtn}
            onClick={(e) => {
              e.stopPropagation();
              onViewComparison(comparison);
            }}
          >
            <VisibilityIcon sx={{ fontSize: 16 }} />
            View Comparison
          </button>
        ) : (
          <button className={styles.pendingBtn} disabled>
            <HourglassEmptyIcon sx={{ fontSize: 16 }} />
            Analysis In Progress...
          </button>
        )}
      </div>
    </div>
  );
}
