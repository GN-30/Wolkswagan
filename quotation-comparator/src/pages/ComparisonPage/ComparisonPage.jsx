
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ComparisonPage.module.css';

import { dummyComparisons } from '../../data/dummyData';
import BackgroundGraphs from '../../components/BackgroundGraphs/BackgroundGraphs';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import BalanceIcon from '@mui/icons-material/Balance';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PROCESS_STEPS = [
  { id: 1, label: 'Parsing uploaded quotation documents' },
  { id: 2, label: 'Extracting line items, prices & delivery SLAs' },
  { id: 3, label: 'Normalising multi-vendor data schema' },
  { id: 4, label: 'Running AI cost & variance radar' },
  { id: 5, label: 'Synthesizing benchmark report & recommendations' },
];

function getFileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();

  if (ext === 'pdf') {
    return { icon: '📄', cls: styles.fileIconPdf };
  }

  if (['xls', 'xlsx'].includes(ext)) {
    return { icon: '📊', cls: styles.fileIconExcel };
  }

  if (['doc', 'docx'].includes(ext)) {
    return { icon: '📝', cls: styles.fileIconWord };
  }

  return { icon: '📁', cls: styles.fileIconDefault };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ComparisonPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState([]);
  const [done, setDone] = useState(false);

  // Comparison number entered by the user.
  const [compTitle, setCompTitle] = useState('');
  const [comparisonError, setComparisonError] = useState('');

  const addFiles = useCallback((newFiles) => {
    const arr = Array.from(newFiles);

    setFiles((prev) => {
      const existing = new Set(
        prev.map((file) => `${file.name}_${file.size}`)
      );

      return [
        ...prev,
        ...arr.filter(
          (file) => !existing.has(`${file.name}_${file.size}`)
        ),
      ];
    });

    // A changed file selection invalidates the previous result.
    setDone(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleFileInput = (e) => {
    addFiles(e.target.files);

    // Allows the same file to be selected again later.
    e.target.value = '';
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setDone(false);
  };

  // Validate all required inputs before starting comparison.
  const handleCompare = async () => {
    // Prevent processing if the comparison number is empty
    // or contains only whitespace.
    const comparisonNumber = compTitle.trim();

    if (!comparisonNumber) {
      setComparisonError('Please enter a comparison number before comparing quotations.');
      setDone(false);
      return;
    }

    // At least two quotation files are required.
    if (files.length < 2) {
      setComparisonError('Please upload at least two quotation files.');
      setDone(false);
      return;
    }

    // Prevent duplicate submissions.
    if (processing) {
      return;
    }

    // Store the normalized value in the input state.
    setCompTitle(comparisonNumber);
    setComparisonError('');
    setDone(false);
    setProcessing(true);
    setProgress(0);
    setActiveStep(0);
    setDoneSteps([]);

    try {
      // Existing simulated processing workflow.
      for (let i = 0; i < PROCESS_STEPS.length; i++) {
        setActiveStep(i);

        await new Promise((resolve) =>
          setTimeout(resolve, 700 + Math.random() * 300)
        );

        setDoneSteps((prev) => [...prev, i]);

        setProgress(
          Math.round(((i + 1) / PROCESS_STEPS.length) * 100)
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 400));

      setDone(true);
    } catch (error) {
      console.error('Comparison failed:', error);
      setComparisonError(
        'Something went wrong while processing the quotations. Please try again.'
      );
      setDone(false);
    } finally {
      setProcessing(false);
    }
  };

  const handleClear = () => {
    setFiles([]);
    setDone(false);
    setProcessing(false);
    setProgress(0);
    setDoneSteps([]);
    setActiveStep(0);
    setCompTitle('');
    setComparisonError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleComparisonNumberChange = (e) => {
    const value = e.target.value;

    setCompTitle(value);
    setComparisonError('');

    // Never show a previous result under a changed number.
    setDone(false);
  };

  const comparisonNumberValid = compTitle.trim().length > 0;

  const compareButtonDisabled =
    !comparisonNumberValid || files.length < 2 || processing;

  return (
    <div className={styles.page}>
      <BackgroundGraphs />

      {/* Processing overlay */}
      {processing && (
        <div className={styles.processingOverlay}>
          <div className={styles.processingContent}>
            <div className={styles.processingSpinner}>
              <div className={styles.spinnerRing} />
              <div className={styles.spinnerCenter}>⚡</div>
            </div>

            <div className={styles.processingTitle}>
              Analysing Quotations…
            </div>

            <div className={styles.processingSubtext}>
              Processing {files.length} vendor quotation files for
              comparison number {compTitle}.
            </div>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className={styles.progressLabel}>
              {progress}% complete
            </div>
          </div>

          <div className={styles.processingSteps}>
            {PROCESS_STEPS.map((step, idx) => {
              const isDone = doneSteps.includes(idx);
              const isActive = activeStep === idx && !isDone;

              return (
                <div
                  key={step.id}
                  className={
                    styles.processingStep +
                    (isDone ? ` ${styles.processingStepDone}` : '') +
                    (isActive ? ` ${styles.processingStepActive}` : '')
                  }
                >
                  <div
                    className={
                      `${styles.stepIndicator} ` +
                      (isDone
                        ? styles.stepIndicatorDone
                        : isActive
                        ? styles.stepIndicatorActive
                        : styles.stepIndicatorPending)
                    }
                  >
                    {isDone ? '✓' : isActive ? '◉' : '○'}
                  </div>

                  {step.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <main className={styles.main}>
        {/* Header */}
        <div className={styles.topHeader}>
          <div className={styles.topActionRow}>
            <div className={styles.headerBadge}>
              <span className={styles.badgeDot} />
              AUTONOMOUS PROCUREMENT ENGINE
            </div>

            <button
              className={styles.backButton}
              onClick={() => navigate('/')}
              disabled={processing}
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
              Back
            </button>
          </div>

          <h1 className={styles.heroTitle}>
            Upload &amp; Compare{' '}
            <span className={styles.accentText}>
              Vendor Quotations
            </span>
          </h1>

          <p className={styles.heroSubtitle}>
            Add quotation files from multiple vendors. Our procurement
            engine normalises line items, identifies discrepancies, and
            highlights the best deal.
          </p>
        </div>

        {/* Mandatory comparison number */}
        <div className={styles.compNumberCard}>
          <div className={styles.compNumberMeta}>
            <label
              htmlFor="comparison-number"
              className={styles.compNumberLabel}
            >
              Comparison Number *
            </label>

            <span className={styles.compNumberHelp}>
              Enter a unique reference number before comparing quotations.
            </span>
          </div>

          <div className={styles.compNumberInputWrapper}>
            <input
              id="comparison-number"
              type="text"
              placeholder="e.g. CMP-2026-001 or 1042"
              value={compTitle}
              onChange={handleComparisonNumberChange}
              className={styles.compNumberInput}
              required
              disabled={processing}
              aria-invalid={Boolean(comparisonError)}
              aria-describedby={
                comparisonError ? 'comparison-number-error' : undefined
              }
              autoComplete="off"
            />
          </div>

          {comparisonError && (
            <p
              id="comparison-number-error"
              role="alert"
              style={{
                color: '#dc2626',
                marginTop: '8px',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {comparisonError}
            </p>
          )}
        </div>

        {/* Main two-column layout */}
        <div className={styles.mainLayout}>
          {/* Left column: upload panel */}
          <div className={styles.uploadPanel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelIconBox}>
                <CloudUploadIcon sx={{ fontSize: 22 }} />
              </div>

              <div>
                <div className={styles.panelTitle}>
                  Quotation Documents
                </div>

                <div className={styles.panelSubtitle}>
                  {files.length === 0
                    ? 'Upload at least 2 vendor quotes to compare.'
                    : `${files.length} file${
                        files.length > 1 ? 's' : ''
                      } added ${
                        files.length >= 2
                          ? '· Ready for comparison'
                          : '· Add 1 more'
                      }`}
                </div>
              </div>
            </div>

            <div className={styles.panelBody}>
              {/* Drag and drop zone */}
              <div
                className={`${styles.dropZone} ${
                  dragging ? styles.dropZoneActive : ''
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className={styles.dropZoneIcon}>
                  <CloudUploadIcon sx={{ fontSize: 36 }} />
                </div>

                <div className={styles.dropZoneTitle}>
                  {dragging
                    ? 'Drop Quotation Files Here!'
                    : 'Drag & Drop Vendor Quotes Here'}
                </div>

                <div className={styles.dropZoneSubtext}>
                  Supports PDF, Excel (.xlsx, .xls), Word (.docx),
                  and CSV formats.
                </div>

                <div className={styles.dropZoneAccept}>
                  {['PDF', 'XLSX', 'XLS', 'DOCX', 'CSV'].map((ext) => (
                    <span key={ext} className={styles.acceptChip}>
                      .{ext}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  className={styles.browseBtn}
                  disabled={processing}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 16 }} />
                  Browse Files
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.xlsx,.xls,.docx,.doc,.csv"
                  className={styles.hiddenInput}
                  onChange={handleFileInput}
                  disabled={processing}
                />
              </div>

              {/* Uploaded files */}
              {files.length > 0 && (
                <div className={styles.fileList}>
                  <div className={styles.fileListHeader}>
                    <span>Uploaded Files ({files.length})</span>
                    <span>Status</span>
                  </div>

                  {files.map((file, idx) => {
                    const { icon, cls } = getFileIcon(file.name);

                    return (
                      <div
                        key={`${file.name}_${file.size}_${idx}`}
                        className={styles.fileItem}
                      >
                        <div className={`${styles.fileIcon} ${cls}`}>
                          {icon}
                        </div>

                        <div className={styles.fileInfo}>
                          <div className={styles.fileName}>
                            {file.name}
                          </div>

                          <div className={styles.fileSize}>
                            {formatBytes(file.size)}
                          </div>
                        </div>

                        <span className={styles.fileStatusTag}>
                          <CheckCircleIcon sx={{ fontSize: 14 }} />
                          Auto-Detect Vendor
                        </span>

                        <button
                          type="button"
                          className={styles.removeBtn}
                          title="Remove file"
                          disabled={processing}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                        >
                          <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className={styles.actionBar}>
              <button
                type="button"
                className={styles.compareBtn}
                disabled={compareButtonDisabled}
                onClick={handleCompare}
                title={
                  !comparisonNumberValid
                    ? 'Enter a comparison number first'
                    : files.length < 2
                    ? 'Upload at least two quotation files'
                    : 'Start quotation comparison'
                }
              >
                <BalanceIcon sx={{ fontSize: 20 }} />

                {!comparisonNumberValid
                  ? 'Enter Comparison Number to Continue'
                  : files.length < 2
                  ? `Upload ${2 - files.length} more file${
                      files.length === 1 ? '' : 's'
                    } to compare`
                  : processing
                  ? 'Comparing Quotations...'
                  : `Compare ${files.length} Quotations with AI`}
              </button>

              {files.length > 0 && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={handleClear}
                  disabled={processing}
                >
                  <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                  Clear All
                </button>
              )}
            </div>

            
          </div>

          {/* Right column: information and tips */}
          <div className={styles.sidePanel}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardTitle}>
                <LightbulbIcon
                  sx={{ fontSize: 18, color: '#F59E0B' }}
                />
                How It Works
              </div>

              <div className={styles.stepList}>
                {[
                  {
                    title: 'Enter Comparison Number',
                    desc: 'Provide a unique identifier for this quotation comparison.',
                  },
                  {
                    title: 'Upload Quotations',
                    desc: 'Add at least two proposals for the same project or RFP.',
                  },
                  {
                    title: 'Compare Vendor Quotes',
                    desc: 'Review pricing, delivery terms, and other differences.',
                  },
                ].map((step, i) => (
                  <div key={i} className={styles.step}>
                    <div className={styles.stepNum}>{i + 1}</div>

                    <div className={styles.stepText}>
                      <div className={styles.stepTitle}>
                        {step.title}
                      </div>
                      {step.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoCardTitle}>
                <AutoAwesomeIcon
                  sx={{ fontSize: 18, color: '#818CF8' }}
                />
                Tips for Best Results
              </div>

              <div className={styles.stepList}>
                {[
                  'Ensure quote line items correspond to a similar scope.',
                  'Use clear, readable quotation documents.',
                  'Check that all item quantities and prices are visible.',
                  'Ensure delivery timelines and tax terms are included.',
                ].map((tip, i) => (
                  <div key={i} className={styles.step}>
                    <CheckCircleIcon
                      sx={{
                        fontSize: 16,
                        color: '#34D399',
                        mt: '3px',
                        flexShrink: 0,
                      }}
                    />

                    <div className={styles.stepText}>{tip}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results are displayed only after valid submission */}
        {done && compTitle.trim() !== '' && (
          <div className={styles.dummyResultsSection}>
            <div className={styles.resultsCard}>
              {/* Result header */}
              <div className={styles.resultsTopBar}>
                <div>
                  <div className={styles.resultsTag}>
                    ✨ AI AUDIT COMPLETE
                  </div>

                  <h2 className={styles.resultsHeading}>
                    Comparison Output: {compTitle.trim()}
                  </h2>

                  <p className={styles.resultsDesc}>
                    Evaluated {files.length} uploaded vendor proposals.
                    Review the comparison details below.
                  </p>
                </div>

                <button
                  type="button"
                  className={styles.viewDetailedAuditBtn}
                  onClick={() => navigate('/comparison/1')}
                >
                  View Full Detailed Audit →
                </button>
              </div>

              {/* Winner highlight */}
              <div className={styles.winnerHighlightBox}>
                <div className={styles.winnerTrophy}>🏆</div>

                <div className={styles.winnerInfo}>
                  <div className={styles.winnerBadge}>
                    RECOMMENDED VENDOR
                  </div>

                  <div className={styles.winnerTitle}>
                    BuildPro Solutions
                  </div>

                  <div className={styles.winnerSpecs}>
                    <span>
                      Overall Score: <strong>94.2 / 100</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Delivery SLA: <strong>14 Days</strong>
                    </span>
                    <span>·</span>
                    <span>
                      Warranty: <strong>24 Mo On-Site</strong>
                    </span>
                  </div>
                </div>

                <div className={styles.winnerSavingsBox}>
                  <div className={styles.savingsLabel}>
                    ESTIMATED SAVINGS
                  </div>

                  <div className={styles.savingsValue}>
                    ₹1,24,500
                  </div>

                  <div className={styles.savingsSub}>
                    -23.1% vs highest quote
                  </div>
                </div>
              </div>

              {/* Vendor comparison table */}
              <div className={styles.tableScroll}>
                <table className={styles.previewTable}>
                  <thead>
                    <tr>
                      <th>Vendor Name</th>
                      <th>Total Quoted Cost</th>
                      <th>AI Quality Score</th>
                      <th>Delivery Timeline</th>
                      <th>Warranty</th>
                      <th>Recommendation Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className={styles.winnerRow}>
                      <td>
                        <strong>BuildPro Solutions</strong>
                        <span className={styles.bestTag}>
                          Recommended Winner
                        </span>
                      </td>

                      <td className={styles.priceColBest}>
                        ₹4,15,500
                      </td>

                      <td>
                        <span className={styles.scoreGreen}>
                          94.2
                        </span>
                      </td>

                      <td>14 Business Days</td>
                      <td>24 Months</td>

                      <td>
                        <span className={styles.statusSuccess}>
                          Selected Winner
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <strong>UrbanFit Logistics</strong>
                      </td>

                      <td className={styles.priceCol}>
                        ₹4,85,000
                      </td>

                      <td>
                        <span className={styles.scoreNeutral}>
                          82.5
                        </span>
                      </td>

                      <td>21 Business Days</td>
                      <td>12 Months</td>

                      <td>
                        <span className={styles.statusRunnerUp}>
                          Runner Up
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <strong>MetroConstruct Corp</strong>
                      </td>

                      <td className={styles.priceCol}>
                        ₹5,40,000
                      </td>

                      <td>
                        <span className={styles.scoreWarning}>
                          76.8
                        </span>
                      </td>

                      <td>28 Business Days</td>
                      <td>12 Months</td>

                      <td>
                        <span className={styles.statusVariance}>
                          High Variance
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer actions */}
              <div className={styles.resultsActionFooter}>
                <span className={styles.resultsFooterNote}>
                  Line items normalized across pricing, logistics,
                  and compliance specifications.
                </span>

                <div className={styles.resultsFooterBtns}>
                  <button
                    type="button"
                    className={styles.resetCompareBtn}
                    onClick={handleClear}
                  >
                    Compare Another Quotation
                  </button>

                  <button
                    type="button"
                    className={styles.vaultLinkBtn}
                    onClick={() => navigate('/comparisons')}
                  >
                    Comparisons Vault ({dummyComparisons.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
