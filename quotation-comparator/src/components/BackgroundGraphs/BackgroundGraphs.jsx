import React, { useEffect, useRef } from 'react';
import styles from './BackgroundGraphs.module.css';

export default function BackgroundGraphs() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const pointsCount = 48;
    let timeStep = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      timeStep += 0.009;
      const isLight = document.documentElement.dataset.theme === 'light';

      // ── 1. SUBTLE TECHNICAL GRID LINES (Lower 50% of viewport) ──
      const bottomStart = height * 0.45;
      const gridSpacingY = (height - bottomStart) / 4;
      ctx.lineWidth = 1;
      ctx.strokeStyle = isLight ? 'rgba(79, 70, 229, 0.07)' : 'rgba(255, 255, 255, 0.035)';

      for (let y = bottomStart; y < height; y += gridSpacingY) {
        ctx.beginPath();
        ctx.setLineDash([4, 8]);
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        // Soft price coordinate tags on right margin
        ctx.setLineDash([]);
        ctx.fillStyle = isLight ? 'rgba(71, 85, 105, 0.5)' : 'rgba(148, 163, 184, 0.18)';
        ctx.font = '600 10px "Space Grotesk", monospace';
        const priceLabel = `₹${Math.round((height - y) * 90 + 15000).toLocaleString('en-IN')}`;
        ctx.fillText(priceLabel, width - 70, y - 6);
      }
      ctx.setLineDash([]);

      // ── 2. BOLD NEON GRAPH 1: CYAN MARKET BENCHMARK SPLINE ──
      const stepX = width / (pointsCount - 1);
      const points1 = [];

      for (let i = 0; i < pointsCount; i++) {
        const x = i * stepX;
        const norm = i / pointsCount;
        const y =
          height * 0.72 +
          Math.sin(norm * 5 + timeStep) * 35 +
          Math.cos(norm * 9 - timeStep * 0.8) * 25 +
          Math.sin(norm * 2 + timeStep * 0.5) * 40;
        points1.push({ x, y });
      }

      // Spline 1 Gradient Area Fill
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(points1[0].x, points1[0].y);
      for (let i = 1; i < points1.length; i++) {
        const xc = (points1[i - 1].x + points1[i].x) / 2;
        const yc = (points1[i - 1].y + points1[i].y) / 2;
        ctx.quadraticCurveTo(points1[i - 1].x, points1[i - 1].y, xc, yc);
      }
      ctx.lineTo(points1[points1.length - 1].x, points1[points1.length - 1].y);
      ctx.lineTo(width, height);
      ctx.closePath();

      const grad1 = ctx.createLinearGradient(0, height * 0.65, 0, height);
      grad1.addColorStop(0, isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(6, 182, 212, 0.12)');
      grad1.addColorStop(0.5, isLight ? 'rgba(2, 132, 199, 0.02)' : 'rgba(6, 182, 212, 0.03)');
      grad1.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
      ctx.fillStyle = grad1;
      ctx.fill();

      // Spline 1 Bold Stroke
      ctx.beginPath();
      ctx.moveTo(points1[0].x, points1[0].y);
      for (let i = 1; i < points1.length; i++) {
        const xc = (points1[i - 1].x + points1[i].x) / 2;
        const yc = (points1[i - 1].y + points1[i].y) / 2;
        ctx.quadraticCurveTo(points1[i - 1].x, points1[i - 1].y, xc, yc);
      }
      ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.75)' : 'rgba(6, 182, 212, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = isLight ? '#0284C7' : '#06B6D4';
      ctx.shadowBlur = isLight ? 6 : 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // ── 3. BOLD NEON GRAPH 2: EMERALD NEGOTIATED QUOTE CURVE ──
      const points2 = [];
      for (let i = 0; i < pointsCount; i++) {
        const x = i * stepX;
        const norm = i / pointsCount;
        const y =
          height * 0.82 +
          Math.sin(norm * 4 - timeStep * 1.2) * 40 +
          Math.cos(norm * 8 + timeStep * 0.7) * 25 +
          Math.sin(norm * 12 - timeStep) * 15;
        points2.push({ x, y });
      }

      // Spline 2 Gradient Area Fill
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(points2[0].x, points2[0].y);
      for (let i = 1; i < points2.length; i++) {
        const xc = (points2[i - 1].x + points2[i].x) / 2;
        const yc = (points2[i - 1].y + points2[i].y) / 2;
        ctx.quadraticCurveTo(points2[i - 1].x, points2[i - 1].y, xc, yc);
      }
      ctx.lineTo(points2[points2.length - 1].x, points2[points2.length - 1].y);
      ctx.lineTo(width, height);
      ctx.closePath();

      const grad2 = ctx.createLinearGradient(0, height * 0.75, 0, height);
      grad2.addColorStop(0, isLight ? 'rgba(5, 150, 105, 0.10)' : 'rgba(16, 185, 129, 0.15)');
      grad2.addColorStop(0.6, isLight ? 'rgba(5, 150, 105, 0.02)' : 'rgba(16, 185, 129, 0.04)');
      grad2.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
      ctx.fillStyle = grad2;
      ctx.fill();

      // Spline 2 Bold Stroke
      ctx.beginPath();
      ctx.moveTo(points2[0].x, points2[0].y);
      for (let i = 1; i < points2.length; i++) {
        const xc = (points2[i - 1].x + points2[i].x) / 2;
        const yc = (points2[i - 1].y + points2[i].y) / 2;
        ctx.quadraticCurveTo(points2[i - 1].x, points2[i - 1].y, xc, yc);
      }
      ctx.strokeStyle = isLight ? 'rgba(5, 150, 105, 0.8)' : 'rgba(16, 185, 129, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = isLight ? '#059669' : '#10B981';
      ctx.shadowBlur = isLight ? 6 : 14;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // ── 4. SUBTLE VIOLET VOLATILITY BAND (Bottom) ──
      ctx.beginPath();
      ctx.moveTo(0, height * 0.88);
      for (let x = 0; x <= width; x += 30) {
        const y =
          height * 0.9 +
          Math.sin(x * 0.003 + timeStep * 0.5) * 20 +
          Math.cos(x * 0.006 - timeStep) * 15;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = isLight ? 'rgba(124, 58, 237, 0.35)' : 'rgba(139, 92, 246, 0.35)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // ── 5. PULSING FOCAL DATA NODES ALONG THE EMERALD CURVE ──
      [0.2, 0.5, 0.85].forEach((ratio) => {
        const idx = Math.floor(ratio * pointsCount);
        const p = points2[idx];
        if (!p) return;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? '#059669' : '#FFFFFF';
        ctx.shadowColor = isLight ? '#059669' : '#10B981';
        ctx.shadowBlur = isLight ? 6 : 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 8 + Math.sin(timeStep * 3) * 2, 0, Math.PI * 2);
        ctx.strokeStyle = isLight ? 'rgba(5, 150, 105, 0.4)' : 'rgba(16, 185, 129, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={styles.container} aria-hidden="true">
      {/* Ambient Radial Lights */}
      <div className={styles.ambientGlowTopRight} />
      <div className={styles.ambientGlowBottomLeft} />
      <div className={styles.ambientGlowCenter} />

      {/* Digital Grid Pattern */}
      <div className={styles.gridOverlay} />

      {/* Real-time HTML5 Canvas */}
      <canvas ref={canvasRef} className={styles.graphCanvas} />

      {/* Radial Vignette */}
      <div className={styles.readabilityVignette} />
    </div>
  );
}
