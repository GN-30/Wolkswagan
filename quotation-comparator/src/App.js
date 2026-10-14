import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './pages/LandingPage/LandingPage';
import ComparisonsListPage from './pages/ComparisonsListPage/ComparisonsListPage';
import ComparisonDetailPage from './pages/ComparisonDetailPage/ComparisonDetailPage';
import ComparisonPage from './pages/ComparisonPage/ComparisonPage';
import BrandBar from './components/BrandBar/BrandBar';
import ZipperToggle from './components/ZipperToggle/ZipperToggle';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('bidz-theme');
      return saved ? saved === 'dark' : true;
    } catch {
      return true;
    }
  });

  // Apply theme to the root element, body, and storage
  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.body.dataset.theme = theme;
    document.body.style.backgroundColor = isDark ? '#080B14' : '#F8FAFC';
    document.body.style.color = isDark ? '#F8FAFC' : '#0F172A';
    try { localStorage.setItem('bidz-theme', theme); } catch { /* noop */ }
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
          primary: {
            main: isDark ? '#6366F1' : '#4F46E5',
            light: isDark ? '#818CF8' : '#6366F1',
            dark: isDark ? '#4F46E5' : '#3730A3',
          },
          secondary: {
            main: isDark ? '#8B5CF6' : '#7C3AED',
            light: isDark ? '#A78BFA' : '#8B5CF6',
            dark: isDark ? '#7C3AED' : '#5B21B6',
          },
          background: {
            default: isDark ? '#080B14' : '#F8FAFC',
            paper: isDark ? '#0D1120' : '#FFFFFF',
          },
          success: { main: isDark ? '#10B981' : '#059669' },
          warning: { main: isDark ? '#F59E0B' : '#D97706' },
          error: { main: isDark ? '#EF4444' : '#DC2626' },
          text: {
            primary: isDark ? '#F1F5F9' : '#0F172A',
            secondary: isDark ? '#94A3B8' : '#475569',
          },
        },
        typography: {
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          h1: { fontWeight: 900 },
          h2: { fontWeight: 800 },
          h3: { fontWeight: 700 },
          h4: { fontWeight: 700 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
        },
        shape: { borderRadius: 16 },
        components: {
          MuiButton: {
            styleOverrides: { root: { textTransform: 'none', fontWeight: 700, borderRadius: 12 } },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 20,
                background: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                boxShadow: isDark ? 'none' : '0 4px 16px rgba(0, 0, 0, 0.04)',
              },
            },
          },
        },
      }),
    [isDark]
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        {/* Brand bar and zipper toggle are global — present on all pages */}
        <BrandBar />
        <ZipperToggle isDark={isDark} onToggle={toggleTheme} />

        <Routes>
          <Route path="/" element={<LandingPage isDark={isDark} />} />
          <Route path="/comparisons" element={<ComparisonsListPage isDark={isDark} />} />
          <Route path="/comparison/:id" element={<ComparisonDetailPage isDark={isDark} />} />
          <Route path="/compare" element={<ComparisonPage isDark={isDark} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
