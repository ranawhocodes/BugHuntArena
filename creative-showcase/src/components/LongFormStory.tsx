import React, { useState } from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import './LongFormStory.css';

interface Chapter {
  id: string;
  number: string;
  title: string;
  headline: string;
  body: string;
  stats: { label: string; value: string }[];
  highlightCode: string;
  callout: string;
}

const DOSSIER_CHAPTERS: Chapter[] = [
  {
    id: 'ch-1',
    number: 'CHAPTER 01',
    title: 'THE CORE PARADOX',
    headline: 'Traditional coding tutorials test memorization. The Arena tests diagnostic intuition.',
    body: 'Most programming platforms provide blank textboxes that overwhelm novices or multiple-choice questions that encourage random guessing. Bug Hunt Arena reframed learning through active code dissection: presenting real, running buggy code with immediate terminal discrepancy logs, forcing learners to isolate failure points before selecting surgical fixes.',
    stats: [
      { label: 'DIAGNOSTIC VELOCITY', value: '3.8x Faster' },
      { label: 'STUDENT RETENTION', value: '89.4%' },
    ],
    highlightCode: `// The Two-Phase Diagnostic Paradigm
const stage = evaluateHunterAction(playerSubmission);
if (stage === 'LOCATE_LINE') {
  requirePinpointTargetLine();
} else if (stage === 'DEPLOY_FIX') {
  validateSemanticPatchAgainstAST();
}`,
    callout: 'Pinpoint the broken line first. Only then deploy the surgical fix.',
  },
  {
    id: 'ch-2',
    number: 'CHAPTER 02',
    title: 'DETERMINISTIC KINETICS',
    headline: 'Zero server dependencies for daily challenges. Pure mathematical pseudo-random seeds.',
    body: 'Using the Mulberry32 deterministic PRNG seeded to the UTC calendar timestamp, every learner worldwide encounters the identical daily puzzle trio without database round-trips. Offline fallbacks guarantee zero downtime even during hostile network dropouts.',
    stats: [
      { label: 'DAILY CHALLENGES SEED', value: 'Mulberry32 PRNG' },
      { label: 'NETWORK OVERHEAD', value: '0 ms Cached' },
    ],
    highlightCode: `export function mulberry32(seed: number): () => number {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}`,
    callout: '100% deterministic global challenges with zero server sync latency.',
  },
  {
    id: 'ch-3',
    number: 'CHAPTER 03',
    title: 'PARAMETRIC COMPANIONS',
    headline: 'Inline procedural vector avatars that react emotionally to runtime execution.',
    body: 'Rather than bulky sprite sheets or heavy video loops, companion pets (Sparky the Fire Beetle, Glitch Fox, Byte Badger) are rendered as lightweight parametric SVG paths. They evolve across four distinct stages based on solved puzzle categories and react live to keyboard shortcuts.',
    stats: [
      { label: 'COMPANION ASSET SIZE', value: '< 2.4 KB Inline SVG' },
      { label: 'EVOLUTION STAGES', value: '4 Dynamic Metamorphoses' },
    ],
    highlightCode: `<svg viewBox="0 0 100 100" className="pet-companion">
  <path d={calculateAntennaSweep(mood, happiness)} />
  <circle cx="50" cy="50" r={evolutionStage * 8 + 20} fill="url(#fireGradient)" />
  <g className={isPetting ? 'haptic-wobble' : ''}>...</g>
</svg>`,
    callout: 'Procedural emotion vectors reacting at 120 frames per second.',
  },
];

export const LongFormStory: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const chapter = DOSSIER_CHAPTERS[activeTab];

  return (
    <section className="story-section" id="story">
      <div className="container-wide">
        {/* Section Header */}
        <div className="story-header">
          <div className="story-eyebrow">
            <BookOpen size={14} className="story-icon" />
            <span>REFERENCE 01 & 04 — SUBSCRR & FMI LONG-FORM DOSSIER</span>
          </div>
          <h2 className="story-title">ENGINEERING DOSSIER: BUG HUNT ARENA</h2>
          <p className="story-subtitle">
            An in-depth architectural breakdown examining how we transformed introductory debugging education into an award-winning gamified web experience.
          </p>
        </div>

        {/* Chapter Selection Tab Bar */}
        <div className="story-tabs-bar" role="tablist">
          {DOSSIER_CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              role="tab"
              aria-selected={activeTab === idx}
              className={`story-tab-btn ${activeTab === idx ? 'story-tab-btn--active' : ''}`}
              onClick={() => setActiveTab(idx)}
              data-cursor="hover"
            >
              <span className="tab-num">{ch.number}</span>
              <span className="tab-title">{ch.title}</span>
            </button>
          ))}
        </div>

        {/* Active Chapter Long-Form Presentation */}
        <div className="story-dossier-card">
          <div className="story-dossier-content">
            <div className="dossier-badge-row">
              <span className="dossier-chap-badge">{chapter.number}</span>
              <span className="dossier-tag">SYSTEMS ARCHITECTURE</span>
            </div>

            <h3 className="dossier-headline">{chapter.headline}</h3>
            <p className="dossier-body">{chapter.body}</p>

            {/* Impact stats pill row */}
            <div className="dossier-stats-grid">
              {chapter.stats.map((stat, i) => (
                <div key={i} className="dossier-stat-tile">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-val">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="dossier-callout">
              <CheckCircle2 size={18} className="callout-icon" />
              <span>{chapter.callout}</span>
            </div>
          </div>

          {/* Interactive Code / Architecture Frame */}
          <div className="story-dossier-terminal">
            <div className="terminal-topbar">
              <div className="term-dots">
                <span className="term-dot term-dot--red" />
                <span className="term-dot term-dot--yellow" />
                <span className="term-dot term-dot--green" />
              </div>
              <span className="term-title">engine/{chapter.id}-core.ts</span>
              <span className="term-lang">TYPESCRIPT</span>
            </div>
            <pre className="terminal-code-block">
              <code>{chapter.highlightCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
