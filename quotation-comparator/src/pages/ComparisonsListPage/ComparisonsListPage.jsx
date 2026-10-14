import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ComparisonsListPage.module.css';
import { dummyComparisons } from '../../data/dummyData';
import QuoteCard from '../../components/QuoteCard/QuoteCard';

import BackgroundGraphs from '../../components/BackgroundGraphs/BackgroundGraphs';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import SavingsIcon from '@mui/icons-material/Savings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FILTERS = ['All', 'Completed', 'In Progress'];

export default function ComparisonsListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const filteredComparisons = dummyComparisons.filter((c) => {
    const matchesFilter = selectedFilter === 'All' || c.status === selectedFilter;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.vendors.some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'items') return b.totalItems - a.totalItems;
    return 0;
  });

  const handleViewComparison = (comparison) => {
    navigate(`/comparison/${comparison.id}`);
  };

  const completedCount = dummyComparisons.filter((c) => c.status === 'Completed').length;
  const inProgressCount = dummyComparisons.filter((c) => c.status === 'In Progress').length;
  const totalSavings = dummyComparisons
    .filter((c) => c.savings)
    .reduce((acc, c) => {
      const num = parseInt(c.savings.replace(/[₹,]/g, ''), 10);
      return acc + (isNaN(num) ? 0 : num);
    }, 0);

  return (
    <div className={styles.page}>
      {/* Enhanced Animated Background Elements */}
      <BackgroundGraphs />
      <div className={styles.enhancedAmbientGlow1} />
      <div className={styles.enhancedAmbientGlow2} />
      <div className={styles.enhancedDataGridOverlay} />


      {/* Main Container */}
      <main className={styles.main}>
        {/* Top Header & Breadcrumb */}
        <div className={styles.topHeader}>
          <div className={styles.topActionRow}>
            <div className={styles.heroBadge}>
              <span className={styles.badgePulse} />
              bidz.ai INTELLIGENCE REPOSITORY
            </div>

            <button className={styles.backButton} onClick={() => navigate('/')}>
              <ArrowBackIcon sx={{ fontSize: 16 }} />
              Back
            </button>
          </div>
          
          <div className={styles.heroFlex}>
            <div>
              <h1 className={styles.heroTitle}>
                All Quotation <span className={styles.gradientText}>Comparisons</span>
              </h1>
              <p className={styles.heroDesc}>
                Explore, benchmark, and audit all multi-vendor procurement proposals with deep AI analytics and automated cost variance detection.
              </p>
            </div>

            <button className={styles.newCompareBtn} onClick={() => navigate('/compare')}>
              <AddIcon sx={{ fontSize: 20 }} />
              Add New Comparison
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIconBox} ${styles.statIconIndigo}`}>
              <TrendingUpIcon />
            </div>
            <div>
              <div className={styles.statValue}>{dummyComparisons.length}</div>
              <div className={styles.statLabel}>Total Comparisons</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIconBox} ${styles.statIconGreen}`}>
              <CheckCircleIcon />
            </div>
            <div>
              <div className={styles.statValue}>{completedCount}</div>
              <div className={styles.statLabel}>Completed & Analyzed</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIconBox} ${styles.statIconAmber}`}>
              <AutorenewIcon />
            </div>
            <div>
              <div className={styles.statValue}>{inProgressCount}</div>
              <div className={styles.statLabel}>In Processing</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIconBox} ${styles.statIconCyan}`}>
              <SavingsIcon />
            </div>
            <div>
              <div className={styles.statValue}>₹{totalSavings.toLocaleString('en-IN')}</div>
              <div className={styles.statLabel}>Total Cost Saved</div>
            </div>
          </div>
        </div>

        {/* Controls Bar: Search, Filters, Sorting */}
        <div className={styles.controlsBar}>
          {/* Search Box */}
          <div className={styles.searchBox}>
            <SearchIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
            <input
              type="text"
              placeholder="Search by title, project, or vendor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button className={styles.clearSearchBtn} onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className={styles.filtersGroup}>
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`${styles.filterPill} ${selectedFilter === f ? styles.filterPillActive : ''}`}
                onClick={() => setSelectedFilter(f)}
              >
                {f}
                {f === 'All' && <span className={styles.pillCount}>{dummyComparisons.length}</span>}
                {f === 'Completed' && <span className={styles.pillCount}>{completedCount}</span>}
                {f === 'In Progress' && <span className={styles.pillCount}>{inProgressCount}</span>}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className={styles.sortWrapper}>
            <TuneIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="items">Sort: Most Line Items</option>
            </select>
          </div>
        </div>

        {/* Comparisons Grid */}
        {filteredComparisons.length > 0 ? (
          <div className={styles.cardsGrid}>
            {filteredComparisons.map((c, idx) => (
              <QuoteCard
                key={c.id}
                comparison={c}
                onViewComparison={handleViewComparison}
                animDelay={idx * 60}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3 className={styles.emptyTitle}>No Comparisons Found</h3>
            <p className={styles.emptySubtitle}>
              We couldn't find any comparisons matching "{searchQuery}". Try a different keyword or reset filters.
            </p>
            <button
              className={styles.resetBtn}
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('All');
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}