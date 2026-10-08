import React, { useState } from 'react';
import { Compass, Cpu, GitBranch, Rocket, Plus, Minus } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';
import './ProcessTimeline.css';

const PHASES = [
  {
    num: 'PHASE 01',
    title: 'COMPUTATIONAL DISCOVERY',
    subtitle: 'Formulation of mathematical constraints & interactive hypotheses.',
    icon: <Compass size={22} />,
    details: 'Every project begins by deconstructing the core paradox. We don’t reach for off-the-shelf templates; we develop algorithmic prototypes, test canvas frame rates under stress, and sculpt custom easing curves.',
    deliverables: ['Mathematical Model', 'Interaction Prototypes', 'Performance Budget'],
  },
  {
    num: 'PHASE 02',
    title: 'SPATIAL PROTOTYPING',
    subtitle: 'Choreographing kinetic typography, custom shaders & Web Audio.',
    icon: <Cpu size={22} />,
    details: 'We build tactile prototypes in the browser. Sound designers synchronize Web Audio harmonic pads with mouse velocity. Inertial momentum is tuned to feel weighted and physical rather than floaty.',
    deliverables: ['Context-Aware Cursor', 'Shader Sandbox', 'Web Audio Matrix'],
  },
  {
    num: 'PHASE 03',
    title: 'SYSTEMIC ARCHITECTURE',
    subtitle: 'Pure CSS tokenization, strict TypeScript, and zero runtime waste.',
    icon: <GitBranch size={22} />,
    details: 'Production code is structured with mathematical discipline. Zero Tailwind runtime overhead, modular component architectures, 100% type safety, and defensive error boundaries protecting against hostile states.',
    deliverables: ['Tokens Specification', 'Unit & Engine Test Suite', 'Defensive Storage Engine'],
  },
  {
    num: 'PHASE 04',
    title: 'TELEMETRIC DEPLOYMENT',
    subtitle: 'Automated presubmit quality gates & sub-second global edge delivery.',
    icon: <Rocket size={22} />,
    details: 'Before shipping, automated CI gates perform deep secret scans, bundle size enforcement (< 8 MB limit), and cross-viewport responsive audits at 360px, 768px, and 1280px via automated headless browsers.',
    deliverables: ['Vercel Edge Deployment', 'Presubmit Gate Pass', 'Cross-Device QA Audit'],
  },
];

export const ProcessTimeline: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const togglePhase = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
    audioEngine.playClick(850);
  };

  return (
    <section className="process-section" id="process">
      <div className="container-wide">
        <div className="process-header">
          <span className="process-eyebrow">METHODOLOGY & DISCIPLINE</span>
          <h2 className="process-title">HOW ARCHITECTURAL WORK GETS BUILT</h2>
          <p className="process-subtitle">
            A battle-tested four-phase lifecycle combining experimental creative engineering with enterprise-grade stability.
          </p>
        </div>

        <div className="process-accordion-list">
          {PHASES.map((phase, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={phase.num}
                className={`process-item ${isOpen ? 'process-item--open' : ''}`}
              >
                <button
                  type="button"
                  className="process-item__trigger"
                  onClick={() => togglePhase(idx)}
                  data-cursor="hover"
                  aria-expanded={isOpen}
                >
                  <div className="trigger-left">
                    <span className="trigger-num">{phase.num}</span>
                    <span className="trigger-icon">{phase.icon}</span>
                    <div className="trigger-titles">
                      <h3 className="trigger-title">{phase.title}</h3>
                      <span className="trigger-subtitle">{phase.subtitle}</span>
                    </div>
                  </div>
                  <div className="trigger-right">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="process-item__drawer">
                    <p className="drawer-details">{phase.details}</p>
                    <div className="drawer-deliverables">
                      <span className="deliverables-tag">KEY DELIVERABLES:</span>
                      <div className="deliverables-list">
                        {phase.deliverables.map((item) => (
                          <span key={item} className="deliverable-badge">{item}</span>
                        ))}
                      </div>
                    </div>
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
