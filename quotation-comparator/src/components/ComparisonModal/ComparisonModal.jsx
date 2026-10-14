  import React, { useEffect, useState } from 'react';
  import ReactDOM from 'react-dom';
  import { useNavigate } from 'react-router-dom';
  import styles from './ComparisonModal.module.css';
  import CloseIcon from '@mui/icons-material/Close';
  import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
  import VerifiedIcon from '@mui/icons-material/Verified';
  import LocalShippingIcon from '@mui/icons-material/LocalShipping';
  import StarIcon from '@mui/icons-material/Star';
  import FileDownloadIcon from '@mui/icons-material/FileDownload';
  import PrintIcon from '@mui/icons-material/Print';
  import CheckCircleIcon from '@mui/icons-material/CheckCircle';
  import OpenInNewIcon from '@mui/icons-material/OpenInNew';

  export default function ComparisonModal({ open, onClose, comparison }) {
    const navigate = useNavigate();
    const [exportSuccess, setExportSuccess] = useState(false);

    // Close on Escape key
    useEffect(() => {
      if (!open) return;
      const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    // Prevent body scroll
    useEffect(() => {
      document.body.style.overflow = open ? 'hidden' : '';
      return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!open || !comparison) return null;

    const { title, date, vendors, totalItems, winner, savings, items, summary } = comparison;

    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    const vendorKeys = Object.keys(summary || {});
    const maxScore = vendorKeys.length > 0
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

    // ── CSV Export Functionality ──
    const handleExportCSV = () => {
      try {
        const rows = [];
        rows.push(['bidz.ai — QUOTATION COMPARISON REPORT']);
        rows.push(['Project Title', `"${title}"`]);
        rows.push(['Generated Date', `"${formattedDate}"`]);
        rows.push(['Recommended Vendor', `"${winner || 'N/A'}"`]);
        rows.push(['Estimated Savings', `"${savings || 'N/A'}"`]);
        rows.push(['Total Line Items', totalItems]);
        rows.push([]);

        // Vendor summary
        rows.push(['VENDOR PERFORMANCE BENCHMARK']);
        rows.push(['Vendor Name', 'Overall Score', 'Average Delivery Timeline']);
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

        // Item breakdown
        rows.push(['ITEM-WISE PRICE & TERMS BREAKDOWN']);
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
        headerCols.push('Best Value Vendor');
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
        const downloadLink = document.createElement('a');
        const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_bidz_ai_comparison.csv`;
        downloadLink.setAttribute('href', encodedUri);
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3500);
      } catch (err) {
        console.error('Export error:', err);
      }
    };

    const handlePrintPDF = () => {
      window.print();
    };

    const modal = (
      <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className={styles.modal}>

          {/* ── Header ── */}
          <div className={styles.modalHeader}>
            <div className={styles.modalHeaderTop}>
              <div className={styles.modalTitleGroup}>
                <div className={styles.modalEyebrow}>
                  <EmojiEventsIcon sx={{ fontSize: 13 }} />
                  bidz.ai COMPARISON AUDIT
                </div>
                <div className={styles.modalTitle}>{title}</div>
              </div>

              {/* Header Action Buttons (Full Page & Close) */}
              <div className={styles.headerActions}>
                <button
                  className={styles.fullPageBtn}
                  onClick={() => {
                    onClose();
                    navigate(`/comparison/${comparison.id}`);
                  }}
                  title="Open in full dedicated page"
                >
                  <OpenInNewIcon sx={{ fontSize: 16 }} />
                  <span>Full Page View</span>
                </button>
                <button
                  className={styles.closeBtn}
                  onClick={onClose}
                  title="Close modal"
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </button>
              </div>
            </div>

            {/* Export Success Notification Banner */}
            {exportSuccess && (
              <div className={styles.exportSuccessBanner}>
                <CheckCircleIcon sx={{ fontSize: 16 }} />
                <span>Report exported successfully as CSV! File downloaded.</span>
              </div>
            )}

            <div className={styles.headerPills}>
              <span className={styles.headerPill + ' ' + styles.pillBlue}>
                📅 {formattedDate}
              </span>
              <span className={styles.headerPill + ' ' + styles.pillBlue}>
                🏢 {vendors.length} Vendors
              </span>
              <span className={styles.headerPill + ' ' + styles.pillPurple}>
                📦 {totalItems} Items Compared
              </span>
              {savings && (
                <span className={styles.headerPill + ' ' + styles.pillGreen}>
                  💰 Savings: {savings}
                </span>
              )}
            </div>
          </div>

          {/* ── Body ── */}
          <div className={styles.modalBody}>

            {/* Winner Banner */}
            {winner && (
              <div className={styles.winnerBanner}>
                <div className={styles.winnerIcon}>🏆</div>
                <div className={styles.winnerText}>
                  <div className={styles.winnerLabel}>Recommended Vendor</div>
                  <div className={styles.winnerName}>{winner}</div>
                  <div className={styles.winnerSubtext}>
                    Best overall score · Most cost-effective · Faster delivery SLA · 100% item parity
                  </div>
                </div>
                {savings && (
                  <div className={styles.winnerSavings}>
                    <div className={styles.winnerSavingsLabel}>Potential Savings</div>
                    <div className={styles.winnerSavingsAmount}>{savings}</div>
                  </div>
                )}
              </div>
            )}

            {/* Score Cards */}
            {vendorKeys.length > 0 && (
              <div className={styles.scoresSection}>
                <div className={styles.sectionLabel}>Overall Vendor Performance Scores</div>
                <div className={styles.scoreCards}>
                  {vendorKeys.map((key) => {
                    const s = summary[key];
                    const isWinner = s?.overallScore === maxScore;
                    return (
                      <div
                        key={key}
                        className={styles.scoreCard + (isWinner ? ' ' + styles.scoreCardWinner : '')}
                      >
                        <div className={styles.scoreVendor}>
                          {isWinner && <StarIcon sx={{ fontSize: 14, color: '#F59E0B' }} />}
                          {vendors.find(
                            (v) =>
                              v.toLowerCase().replace(/[\s.]/g, '') === key ||
                              v.toLowerCase().split(' ')[0] === key
                          ) || key}
                        </div>
                        <div className={styles.scoreBarWrap}>
                          <div
                            className={styles.scoreBar + ' ' + (isWinner ? styles.scoreBarBest : styles.scoreBarOther)}
                            style={{ width: `${s?.overallScore || 0}%` }}
                          />
                        </div>
                        <span className={styles.scoreNumber}>{s?.overallScore || 0}</span>
                        <span className={styles.scoreUnit}>/100</span>
                        <div className={styles.scoreDelivery}>
                          <LocalShippingIcon sx={{ fontSize: 12, mr: 0.4, verticalAlign: 'middle' }} />
                          Avg. {s?.avgDelivery}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Item Comparison Table */}
            {items && items.length > 0 && (
              <div className={styles.tableSection}>
                <div className={styles.sectionLabel}>Line-Item Price &amp; Specification Comparison</div>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Line Item Name</th>
                        {getVendorPriceKeys(items[0]).map((key) => (
                          <th key={key}>
                            {vendors.find(
                              (v) =>
                                v.toLowerCase().replace(/[\s.]/g, '') === key ||
                                v.toLowerCase().split(' ')[0] === key
                            ) || key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => {
                        const priceKeys = getVendorPriceKeys(item);
                        const bestVendorKey = getBestPriceVendor(item);
                        return (
                          <tr key={idx}>
                            <td>
                              <span className={styles.itemName}>{item.name}</span>
                            </td>
                            {priceKeys.map((k) => {
                              const isBest = k === bestVendorKey;
                              return (
                                <td key={k}>
                                  <div className={styles.priceCell + (isBest ? ' ' + styles.priceBest : '')}>
                                    ₹{item[k]?.price?.toLocaleString('en-IN')}
                                    {isBest && (
                                      <span className={styles.bestTag}>
                                        <VerifiedIcon sx={{ fontSize: 10 }} /> Best Price
                                      </span>
                                    )}
                                  </div>
                                  <div className={styles.deliveryCell}>
                                    📦 {item[k]?.delivery}
                                  </div>
                                  <div className={styles.warrantyCell}>
                                    🛡️ {item[k]?.warranty}
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
            )}

          </div>

          {/* ── Footer ── */}
          <div className={styles.modalFooter}>
            <div className={styles.footerLeft}>
              <button className={styles.footerExportBtn} onClick={handleExportCSV}>
                <FileDownloadIcon sx={{ fontSize: 18 }} />
                Export to CSV
              </button>
              <button className={styles.footerPrintBtn} onClick={handlePrintPDF}>
                <PrintIcon sx={{ fontSize: 18 }} />
                Print / Save PDF
              </button>
            </div>
            <button className={styles.footerCloseBtn} onClick={onClose}>
              Close Report
            </button>
          </div>

        </div>
      </div>
    );

    return ReactDOM.createPortal(modal, document.body);
  }
