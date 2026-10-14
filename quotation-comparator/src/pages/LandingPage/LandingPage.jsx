import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './LandingPage.module.css';
import { dummyComparisons } from '../../data/dummyData';
import BackgroundGraphs from '../../components/BackgroundGraphs/BackgroundGraphs';

import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GridViewIcon from '@mui/icons-material/GridView';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VerifiedIcon from '@mui/icons-material/Verified';

import procurementAnalyticsImg from '../../assets/images/procurement_analytics.jpg';
import procurementLogisticsImg from '../../assets/images/procurement_logistics.jpg';
import procurementContractImg from '../../assets/images/procurement_contract.jpg';
import procurementSavingsImg from '../../assets/images/procurement_savings.jpg';

export default function LandingPage({ isDark }) {
  const navigate = useNavigate();

  return (
    <div className={`${styles.screenContainer} ${isDark ? styles.darkTheme : styles.lightTheme}`}>
      <BackgroundGraphs />

      <main className={styles.heroStage}>
        {/* Left column */}
        <div className={styles.sideColumn}>
          <div className={`${styles.procureCard} ${styles.procureCard1}`}>
            <div className={styles.cardImageContainer}>
              <img src={procurementAnalyticsImg} alt="Smart quote analytics dashboard" className={styles.cardImage} />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardInfoTitle}>Smart Quote Analytics</div>
              <div className={styles.cardInfoSub}>98.4% Match Accuracy · OCR Normalised</div>
            </div>
          </div>

          <div className={`${styles.procureCard} ${styles.procureCard2}`}>
            <div className={styles.cardImageContainer}>
              <img src={procurementLogisticsImg} alt="Global supply chain logistics" className={styles.cardImage} loading="lazy" />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardInfoTitle}>Global Supply Chain</div>
              <div className={styles.cardInfoSub}>Turnaround SLAs &amp; Freight Tracking</div>
            </div>
          </div>
        </div>

        {/* Center hero */}
        <div className={styles.centerColumn}>
          <div className={styles.heroBadge}>
            <span className={styles.badgePulse} />
            <span>POWERED BY bidz.ai · AUTONOMOUS PROCUREMENT ENGINE</span>
          </div>

          <h1 className={styles.heroTitle}>
            Compare Vendor Quotes.{' '}
            <span className={styles.heroTitleAccent}>Save Millions.</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Transform chaotic multi-vendor RFPs into clear side-by-side decisions in seconds.
            Uncover hidden markups, normalize line items, and audit proposals with AI.
          </p>

          <div className={styles.heroActions}>
            <button type="button" className={styles.primaryBtn} onClick={() => navigate('/compare')}>
              <AddIcon sx={{ fontSize: 18 }} />
              <span>Add New Comparison</span>
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={() => navigate('/comparisons')}>
              <GridViewIcon sx={{ fontSize: 17 }} />
              <span>Comparisons Vault ({dummyComparisons.length})</span>
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </button>
          </div>

          {/* Analytics console */}
          <div className={`${styles.graphConsole} ${styles.graphConsoleFloating}`}>
            <div className={styles.consoleHeader}>
              <div className={styles.consoleDots} aria-hidden="true">
                <span className={styles.dotRed} />
                <span className={styles.dotYellow} />
                <span className={styles.dotGreen} />
              </div>
              <div className={styles.consoleTitle}>bidz.ai — Multi-Vendor Price &amp; Variance Engine</div>
            </div>

            <div className={styles.consoleBody}>
              <div className={styles.consoleWidget}>
                <div className={styles.widgetMeta}>
                  <span className={styles.widgetMetaLabel}>COST REDUCTION TRAJECTORY</span>
                  <span className={styles.widgetMetaBadge}>-24.8% REALIZED</span>
                </div>

                <div className={styles.animatedSpendChartWrap}>
                  <svg className={styles.spendCurveSvg} viewBox="0 0 240 85" fill="none" role="img" aria-label="Illustrative procurement cost reduction curve">
                    <defs>
                      <linearGradient id="spendAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="budgetGuideGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    <line x1="10" y1="18" x2="230" y2="18" stroke="url(#budgetGuideGrad)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.65" />
                    <text x="12" y="14" fill="#94A3B8" fontSize="8" fontFamily="'Space Grotesk', monospace" fontWeight="600">RFP Benchmark: ₹5,40,000</text>
                    <path d="M 15 32 Q 65 48, 120 54 T 225 66 L 225 78 L 15 78 Z" fill="url(#spendAreaGrad)" />
                    <path d="M 15 32 Q 65 48, 120 54 T 225 66" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" className={styles.pulsingPolyline} />
                    <circle cx="15" cy="32" r="3.5" fill="#EF4444" stroke="#080B14" strokeWidth="1.5" />
                    <circle cx="120" cy="54" r="3.5" fill="#6366F1" stroke="#080B14" strokeWidth="1.5" />
                    <circle cx="225" cy="66" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                    <rect x="145" y="52" width="75" height="16" rx="4" fill="rgba(16, 185, 129, 0.25)" stroke="rgba(16, 185, 129, 0.6)" />
                    <text x="150" y="63" fill="#34D399" fontSize="8.5" fontFamily="'Space Grotesk', monospace" fontWeight="700">Best ₹4,15,500</text>
                  </svg>
                </div>

                <div className={styles.savingsCallout}>
                  <TrendingDownIcon sx={{ fontSize: 13, color: '#34D399' }} />
                  <span>Target Savings: ₹1,24,500</span>
                </div>
              </div>

              <div className={styles.consoleWidget}>
                <div className={styles.widgetMeta}>
                  <span className={styles.widgetMetaLabel}>VENDOR BID COMPARISON</span>
                  <span className={styles.winnerTag}>
                    <VerifiedIcon sx={{ fontSize: 12, mr: 0.3 }} />
                    BuildPro Winner
                  </span>
                </div>

                <div className={styles.animatedSvgWrap}>
                  <svg className={styles.animatedVarianceSvg} viewBox="0 0 240 85" fill="none" role="img" aria-label="Illustrative vendor bid comparison across four categories">
                    <line x1="0" y1="20" x2="240" y2="20" stroke="rgba(128,140,165,0.22)" strokeDasharray="3 3" />
                    <line x1="0" y1="46" x2="240" y2="46" stroke="rgba(128,140,165,0.22)" strokeDasharray="3 3" />
                    <line x1="0" y1="70" x2="240" y2="70" stroke="rgba(128,140,165,0.22)" strokeDasharray="3 3" />
                    <rect x="14" y="32" width="10" height="38" rx="2" fill="#6366F1" className={styles.animBar1} />
                    <rect x="27" y="22" width="10" height="48" rx="2" fill="#EF4444" opacity="0.85" className={styles.animBar2} />
                    <rect x="40" y="10" width="10" height="60" rx="2" fill="#10B981" className={styles.animBar3} />
                    <rect x="74" y="36" width="10" height="34" rx="2" fill="#6366F1" className={styles.animBar4} />
                    <rect x="87" y="44" width="10" height="26" rx="2" fill="#EF4444" opacity="0.85" className={styles.animBar5} />
                    <rect x="100" y="14" width="10" height="56" rx="2" fill="#10B981" className={styles.animBar6} />
                    <rect x="134" y="42" width="10" height="28" rx="2" fill="#6366F1" className={styles.animBar7} />
                    <rect x="147" y="28" width="10" height="42" rx="2" fill="#EF4444" opacity="0.85" className={styles.animBar8} />
                    <rect x="160" y="8" width="10" height="62" rx="2" fill="#10B981" className={styles.animBar9} />
                    <rect x="194" y="34" width="10" height="36" rx="2" fill="#6366F1" className={styles.animBar10} />
                    <rect x="207" y="52" width="10" height="18" rx="2" fill="#EF4444" opacity="0.85" className={styles.animBar11} />
                    <rect x="220" y="6" width="10" height="64" rx="2" fill="#10B981" className={styles.animBar12} />
                    <text x="21" y="80" textAnchor="middle" fill="#7B849B" fontSize="6.8" fontFamily="'Space Grotesk', monospace">Material</text>
                    <text x="92" y="80" textAnchor="middle" fill="#7B849B" fontSize="6.8" fontFamily="'Space Grotesk', monospace">Assembly</text>
                    <text x="152" y="80" textAnchor="middle" fill="#7B849B" fontSize="6.8" fontFamily="'Space Grotesk', monospace">Freight</text>
                    <text x="212" y="80" textAnchor="middle" fill="#7B849B" fontSize="6.8" fontFamily="'Space Grotesk', monospace">Warranty</text>
                  </svg>
                </div>

                <div className={styles.legendRow}>
                  <span className={styles.legGreen}>● BuildPro</span>
                  <span className={styles.legIndigo}>● UrbanFit</span>
                  <span className={styles.legRed}>● MetroConstruct</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className={styles.sideColumn}>
          <div className={`${styles.procureCard} ${styles.procureCard3}`}>
            <div className={styles.cardImageContainer}>
              <img src={procurementContractImg} alt="Verified deals and contracts" className={styles.cardImage} loading="lazy" />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardInfoTitle}>Verified Contracts</div>
              <div className={styles.cardInfoSub}>Audit Trails &amp; Term Risk Analysis</div>
            </div>
          </div>

          <div className={`${styles.procureCard} ${styles.procureCard4}`}>
            <div className={styles.cardImageContainer}>
              <img src={procurementSavingsImg} alt="Cost optimization and procurement savings" className={styles.cardImage} loading="lazy" />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardInfoTitle}>Cost Optimization</div>
              <div className={styles.cardInfoSub}>+24.5% Avg Net Procurement Savings</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
