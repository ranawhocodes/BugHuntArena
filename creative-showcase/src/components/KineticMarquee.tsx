import React from 'react';
import './KineticMarquee.css';

const MARQUEE_ITEMS_1 = [
  'COMPUTATIONAL PHYSICS',
  '✦',
  'BESPOKE WEBGL & THREE.JS',
  '✦',
  'REACT 19 SYSTEMS',
  '✦',
  'KINETIC TYPOGRAPHY',
  '✦',
  'GENERATIVE ALGORITHMS',
  '✦',
  'SPATIAL DESIGN SYSTEMS',
  '✦',
];

const MARQUEE_ITEMS_2 = [
  'HIGH-FREQUENCY INTERACTION',
  '—',
  'ZERO-RUNTIME CSS TOKENS',
  '—',
  'AWWWARDS SOTD NOMINEE',
  '—',
  'FWA OF THE DAY',
  '—',
  'MATHEMATICAL PRECISION',
  '—',
  'FULL-STACK CREATIVE DEV',
  '—',
];

export const KineticMarquee: React.FC = () => {
  return (
    <section className="kinetic-marquee-section" aria-label="Capabilities Marquee">
      {/* Track 1: Leftward */}
      <div className="marquee-track-wrap">
        <div className="marquee-track marquee-track--left">
          {[...MARQUEE_ITEMS_1, ...MARQUEE_ITEMS_1].map((item, index) => (
            <span
              key={`track1-${index}`}
              className={`marquee-item ${item === '✦' ? 'marquee-item--glyph' : ''}`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Track 2: Rightward (Inverted) */}
      <div className="marquee-track-wrap marquee-track-wrap--secondary">
        <div className="marquee-track marquee-track--right">
          {[...MARQUEE_ITEMS_2, ...MARQUEE_ITEMS_2].map((item, index) => (
            <span
              key={`track2-${index}`}
              className={`marquee-item marquee-item--subtle ${item === '—' ? 'marquee-item--glyph' : ''}`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
