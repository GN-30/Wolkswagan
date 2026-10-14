import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ComparisonDetailPage.module.css';
import { dummyComparisons } from '../../data/dummyData';

import BackgroundGraphs from '../../components/BackgroundGraphs/BackgroundGraphs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function ComparisonDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exportSuccess, setExportSuccess] = useState(false);

  // Find comparison by ID, or fallback to first
  const comparison =
    dummyComparisons.find((c) => String(c.id) === String(id)) || dummyComparisons[0];

  const { title, date, vendors, totalItems, winner, savings, items, summary } = comparison;

  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const vendorKeys = Object.keys(summary || {});
  const maxScore =
    vendorKeys.length > 0
      ? Math.max(...vendorKeys.map((k) => summary[k]?.overallScore || 0))
      : 0;

  const getVendorPriceKeys = (item) => {
    return Object.keys(item).filter((k) => k !== 'name');
  };

  const getBestPriceVendor = (item) => {
    const keys = getVendorPriceKeys(item);
    let bestKey = null;
    let bestPrice = Infinity;
    keys.forEach((k) => {
      if (item[k]?.price < bestPrice) {
        bestPrice = item[k].price;
        bestKey = k;
      }
    });
    return bestKey;
  };

  const handleExportCSV = () => {
    try {
      const rows = [];
      rows.push(['bidz.ai — FULL QUOTATION COMPARISON & AUDIT REPORT']);
      rows.push(['Project Title', `"${title}"`]);
      rows.push(['Report Date', `"${formattedDate}"`]);
      rows.push(['Recommended Winner', `"${winner || 'N/A'}"`]);
      rows.push(['Total Potential Savings', `"${savings || 'N/A'}"`]);
      rows.push(['Line Items Evaluated', totalItems]);
      rows.push([]);

      rows.push(['VENDOR PERFORMANCE SUMMARY']);
      rows.push(['Vendor Name', 'Overall Score', 'Delivery Timeline']);
      vendorKeys.forEach((key) => {
        const s = summary[key];
        const vName =
          vendors.find(
            (v) =>
              v.toLowerCase().replace(/[\s.]/g, '') === key ||
              v.toLowerCase().split(' ')[0] === key
          ) || key;
        rows.push([`"${vName}"`, `${s?.overallScore || 0}/100`, `"${s?.avgDelivery || 'N/A'}"`]);
      });
      rows.push([]);

      rows.push(['ITEM-WISE PRICE BREAKDOWN & TERMS']);
      const priceKeys = items && items.length > 0 ? getVendorPriceKeys(items[0]) : [];
      const headerCols = ['Item Name'];
      priceKeys.forEach((k) => {
        const vName =
          vendors.find(
            (v) =>
              v.toLowerCase().replace(/[\s.]/g, '') === k ||
              v.toLowerCase().split(' ')[0] === k
          ) || k;
        headerCols.push(`"${vName} Price (INR)"`);
        headerCols.push(`"${vName} Delivery"`);
        headerCols.push(`"${vName} Warranty"`);
      });
      headerCols.push('Best Price Vendor');
      rows.push(headerCols);

      if (items && items.length > 0) {
        items.forEach((item) => {
          const bestK = getBestPriceVendor(item);
          const bestVendorName =
            vendors.find(
              (v) =>
                v.toLowerCase().replace(/[\s.]/g, '') === bestK ||
                v.toLowerCase().split(' ')[0] === bestK
            ) || bestK;
          const row = [`"${item.name}"`];
          priceKeys.forEach((k) => {
            row.push(item[k]?.price ?? 'N/A');
            row.push(`"${item[k]?.delivery ?? 'N/A'}"`);
            row.push(`"${item[k]?.warranty ?? 'N/A'}"`);
          });
          row.push(`"${bestVendorName}"`);
          rows.push(row);
        });
      }

      const csvContent =
        'data:text/csv;charset=utf-8,\uFEFF' +
        rows.map((r) => r.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${title.replace(/[^a-zA-Z0-9]/g, '_')}_bidz_ai_full_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3500);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.page}>
      {/* Background Animated Splines */}
      <BackgroundGraphs />


      <main className={styles.main}>
        {/* Top Action & Navigation Bar */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <span className={styles.repoTag}>bidz.ai · DETAILED QUOTATION AUDIT</span>
          </div>

          <div className={styles.topActionGroup}>
            <button className={styles.exportBtn} onClick={handleExportCSV}>
              <FileDownloadIcon sx={{ fontSize: 17 }} />
              Export CSV
            </button>
            <button className={styles.exportPdfBtn} onClick={handlePrint}>
              <PictureAsPdfIcon sx={{ fontSize: 17 }} />
              Export PDF
            </button>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              <ArrowBackIcon sx={{ fontSize: 17 }} />
              Back
            </button>
          </div>
        </div>

        {/* Export Success Toast */}
        {exportSuccess && (
          <div className={styles.exportSuccessBanner}>
            <CheckCircleIcon sx={{ fontSize: 18 }} />
            <span>Full quotation comparison report exported successfully as CSV!</span>
          </div>
        )}

        {/* Hero Header */}
        <div className={styles.pageHero}>
          
          <h1 className={styles.heroTitle}>{title}</h1>
          <div className={styles.heroPills}>
            <span className={styles.heroPill}>📅 Evaluated: {formattedDate}</span>
            <span className={styles.heroPill}>🏢 {vendors.length} Vendors Compared</span>
            <span className={styles.heroPill}>📦 {totalItems} Line Items Indexed</span>
            {savings && (
              <span className={`${styles.heroPill} ${styles.heroPillSavings}`}>
                💰 Net Savings: {savings}
              </span>
            )}
          </div>
        </div>

        {/* ── RECOMMENDED VENDOR WINNER BANNER (EXPANSIVE) ── */}
        {winner && (
          <div className={styles.winnerBanner}>
            <div className={styles.winnerLeft}>
              <div className={styles.winnerTrophyBox}>🏆</div>
              <div>
                <div className={styles.winnerBadge}>RECOMMENDED BEST-VALUE BID</div>
                <div className={styles.winnerName}>{winner}</div>
                <div className={styles.winnerSub}>
                  Highest composite score across price, SLA delivery, warranty, and contract compliance.
                </div>
              </div>
            </div>

            {savings && (
              <div className={styles.winnerSavingsBox}>
                <div className={styles.savingsLabel}>
                  <TrendingDownIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
                  Potential Savings
                </div>
                <div className={styles.savingsAmount}>{savings}</div>
                <div className={styles.savingsSub}>vs. Highest Competitor Quote</div>
              </div>
            )}
          </div>
        )}

        {/* ── VENDOR PERFORMANCE SCORECARDS (EXPANSIVE) ── */}
        {vendorKeys.length > 0 && (
          <div className={styles.scorecardsSection}>
            <div className={styles.sectionHeaderRow}>
              <h2 className={styles.sectionTitle}>Vendor Performance Benchmarks</h2>
              <span className={styles.sectionBadge}>NORMALIZED SCORING</span>
            </div>

            <div className={styles.scorecardsGrid}>
              {vendorKeys.map((key) => {
                const s = summary[key];
                const isWinner = s?.overallScore === maxScore;
                const vName =
                  vendors.find(
                    (v) =>
                      v.toLowerCase().replace(/[\s.]/g, '') === key ||
                      v.toLowerCase().split(' ')[0] === key
                  ) || key;

                return (
                  <div
                    key={key}
                    className={`${styles.scorecard} ${isWinner ? styles.scorecardWinner : ''}`}
                  >
                    <div className={styles.scorecardTop}>
                      <div>
                        <div className={styles.scorecardVendorName}>
                          {isWinner && <StarIcon sx={{ fontSize: 16, color: '#F59E0B' }} />}
                          {vName}
                        </div>
                        <div className={styles.scorecardDelivery}>
                          <LocalShippingIcon sx={{ fontSize: 13, mr: 0.5, verticalAlign: 'middle' }} />
                          Avg Delivery: {s?.avgDelivery}
                        </div>
                      </div>
                      <div className={styles.scoreBox}>
                        <span className={styles.scoreBig}>{s?.overallScore || 0}</span>
                        <span className={styles.scoreMax}>/100</span>
                      </div>
                    </div>

                    <div className={styles.progressBarWrap}>
                      <div
                        className={`${styles.progressBarFill} ${
                          isWinner ? styles.progressFillWinner : styles.progressFillOther
                        }`}
                        style={{ width: `${s?.overallScore || 0}%` }}
                      />
                    </div>

                    <div className={styles.scorecardFooter}>
                      <span className={styles.costTotalText}>
                        Total Quote: ₹{s?.total?.toLocaleString('en-IN') || '—'}
                      </span>
                      {isWinner ? (
                        <span className={styles.winnerPill}>Best Deal</span>
                      ) : (
                        <span className={styles.standardPill}>Evaluated</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── EXPANSIVE FULL-WIDTH ITEM PRICE & TERMS TABLE ── */}
        {items && items.length > 0 && (
          <div className={styles.tableSection}>
            <div className={styles.sectionHeaderRow}>
              <div>
                <h2 className={styles.sectionTitle}>Line-Item Price &amp; Specification Comparison</h2>
                <p className={styles.sectionSubtitle}>
                  Side-by-side granular breakdown of unit costs, delivery timelines, and warranty terms.
                </p>
              </div>
            </div>

            <div className={styles.tableCard}>
              <div className={styles.tableScroll}>
                <table className={styles.compTable}>
                  <thead>
                    <tr>
                      <th className={styles.thItem}>Line Item Description</th>
                      {getVendorPriceKeys(items[0]).map((key) => {
                        const vName =
                          vendors.find(
                            (v) =>
                              v.toLowerCase().replace(/[\s.]/g, '') === key ||
                              v.toLowerCase().split(' ')[0] === key
                          ) || key;
                        return (
                          <th key={key} className={styles.thVendor}>
                            {vName}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => {
                      const priceKeys = getVendorPriceKeys(item);
                      const bestVendorKey = getBestPriceVendor(item);
                      return (
                        <tr key={idx} className={styles.tableRow}>
                          <td className={styles.tdItem}>
                            <div className={styles.itemNameText}>{item.name}</div>
                            <div className={styles.itemIndexText}>Item #{idx + 1}</div>
                          </td>
                          {priceKeys.map((k) => {
                            const isBest = k === bestVendorKey;
                            return (
                              <td
                                key={k}
                                className={`${styles.tdVendor} ${
                                  isBest ? styles.tdBestVendor : ''
                                }`}
                              >
                                <div className={styles.priceLine}>
                                  <span className={`${styles.priceNumber} ${isBest ? styles.priceBestGreen : ''}`}>
                                    ₹{item[k]?.price?.toLocaleString('en-IN')}
                                  </span>
                                  {isBest && (
                                    <span className={styles.bestTag}>
                                      <VerifiedIcon sx={{ fontSize: 11 }} />
                                      Best Price
                                    </span>
                                  )}
                                </div>
                                <div className={styles.metaRow}>
                                  <span className={styles.metaBadge}>
                                    📦 {item[k]?.delivery || 'N/A'}
                                  </span>
                                  <span className={styles.metaBadge}>
                                    🛡️ {item[k]?.warranty || 'N/A'}
                                  </span>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── BOTTOM ACTIONS ── */}
        <div className={styles.bottomBar}>
          <button className={styles.backButton} onClick={() => navigate('/comparisons')}>
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            View All Saved Comparisons
          </button>
        </div>
      </main>
    </div>
  );
}
