import React from 'react';
import './StatsGrid.css';

const STATS = [
  {
    num: '01',
    metric: '120+',
    label: 'DIGITAL SYSTEMS SHIPPED',
    desc: 'Interactive platforms, WebGL experiences, and high-frequency production applications across fintech, edtech, and generative media.',
  },
  {
    num: '02',
    metric: '99.98%',
    label: 'RUNTIME RELIABILITY',
    desc: 'Battle-hardened client resilience with defensive error boundaries and zero-dependency deterministic storage engines.',
  },
  {
    num: '03',
    metric: '0.11 MB',
    label: 'ZERO-BLOAT BUNDLE',
    desc: 'Strict performance budget discipline. No redundant runtimes, pure CSS design tokens, and sub-100ms cold boots.',
  },
  {
    num: '04',
    metric: '06 HONORS',
    label: 'STUDIO RECOGNITION',
    desc: 'Awwwards Site of the Day, FWA of the Day, and Webby Award nominations for technical excellence in interactive craft.',
  },
];

export const StatsGrid: React.FC = () => {
  return (
    <section className="stats-section" aria-label="Key Performance Metrics">
      <div className="container-wide">
        <div className="stats-eyebrow">
          <span className="stats-kicker">VERIFIED OUTCOMES</span>
          <span className="stats-divider">/</span>
          <span className="stats-source">SYSTEM METRICS · 2024–2026</span>
        </div>

        <div className="stats-grid">
          {STATS.map((item) => (
            <div key={item.num} className="stat-card" data-cursor="hover">
              <div className="stat-card__index">{item.num}</div>
              <div className="stat-card__metric">{item.metric}</div>
              <div className="stat-card__label">{item.label}</div>
              <p className="stat-card__desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
