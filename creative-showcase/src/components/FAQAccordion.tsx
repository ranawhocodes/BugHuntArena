import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';
import './FAQAccordion.css';

const FAQ_ITEMS = [
  {
    q: 'How does your tech stack compare to generic Webflow or CMS solutions?',
    a: 'Every digital experience is custom-engineered using modern React/TypeScript frameworks, zero-bloat CSS token systems, and mathematical canvas shaders. This delivers 10x higher frame rates (120Hz), sub-second loading speeds, and bespoke interaction physics impossible with off-the-shelf site builders.',
  },
  {
    q: 'What is your philosophy on web accessibility and reduced motion?',
    a: 'High-end motion and accessibility are not opposites. We strictly implement WCAG AA contrast, keyboard roving tabindex, semantic ARIA landmarks, and respect prefers-reduced-motion by substituting elaborate kinetic translations with elegant instantaneous transitions.',
  },
  {
    q: 'Can you work with our existing engineering and design teams?',
    a: 'Yes. We frequently embed as Principal Design Technologists or Interaction Architecture Leads, translating high-fidelity Figma concepts into production-grade React components, custom Web Audio synthesis, and GLSL shaders.',
  },
  {
    q: 'What are your typical project timelines and engagement structures?',
    a: 'Full bespoke interactive experiences typically run 4 to 8 weeks from computational discovery to telemetric edge deployment. We also offer 2-week architectural sprints for existing apps requiring performance optimization and motion design overhauls.',
  },
];

export const FAQAccordion: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
    audioEngine.playClick(900);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="faq-header">
          <div className="faq-eyebrow">
            <HelpCircle size={14} className="faq-icon" />
            <span>REFERENCE 01 — SUBSCRR RESTRAINED FAQ ARCHITECTURE</span>
          </div>
          <h2 className="faq-title">FREQUENTLY ASKED INQUIRIES</h2>
          <p className="faq-subtitle">
            Direct answers on technical standards, collaboration models, and production delivery.
          </p>
        </div>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className={`faq-row ${isOpen ? 'faq-row--open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggle(idx)}
                  data-cursor="hover"
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-text">{item.q}</span>
                  <ChevronDown className={`faq-arrow ${isOpen ? 'faq-arrow--rotated' : ''}`} size={18} />
                </button>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
