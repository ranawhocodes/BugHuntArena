import React, { useState } from 'react';
import { ArrowUpRight, Copy, Check, Sparkles } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { audioEngine } from '../utils/AudioEngine';
import './CinematicFooter.css';

export const CinematicFooter: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = 'alex.vance@studio-kinesis.dev';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    audioEngine.playTactileChime();
    setTimeout(() => setCopied(false), 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    audioEngine.playClick(1000);
  };

  return (
    <footer className="cinematic-footer" id="contact">
      {/* Huge CTA Billboard */}
      <div className="footer-cta-hero container-wide">
        <div className="footer-cta-eyebrow">
          <Sparkles size={14} className="cta-icon" />
          <span>START A CONVERSATION // COMMISSION ARCHITECTURE</span>
        </div>

        <h2 className="footer-cta-title">
          HAVE A VISION THAT REFUSES TO BE ORDINARY?
        </h2>

        <div className="footer-cta-actions">
          <MagneticButton
            variant="primary"
            onClick={copyEmail}
            cursorLabel="COPY"
            className="footer-primary-btn"
          >
            <span>{copied ? 'EMAIL ADDRESS COPIED' : 'COPY COMMISSIONS EMAIL'}</span>
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </MagneticButton>

          <a
            href={`mailto:${email}?subject=Commission%20Inquiry%20%E2%80%94%20Design%20Technologist`}
            className="direct-mail-link"
            data-cursor="hover"
          >
            <span>OR LAUNCH DIRECT EMAIL</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      {/* Architectural Bottom Grid */}
      <div className="footer-bottom-grid container-wide">
        {/* Col 1: Identity */}
        <div className="footer-col">
          <div className="footer-brand">
            <span className="brand-dot">✦</span>
            <span className="brand-title">ALEX VANCE</span>
          </div>
          <p className="footer-tagline">
            Principal Design Technologist & Creative Interaction Engineer. Bridging computational shaders, bespoke typography, and high-velocity digital experiences.
          </p>
          <div className="footer-coords">
            <span>37.7749° N, 122.4194° W</span>
            <span className="sep">·</span>
            <span>PACIFIC STANDARD TIME</span>
          </div>
        </div>

        {/* Col 2: Navigation map */}
        <div className="footer-col">
          <h4 className="footer-col-heading">INDEX</h4>
          <ul className="footer-links-list">
            <li><a href="#hero" data-cursor="hover">01 // TOP ARCHIVE</a></li>
            <li><a href="#work" data-cursor="hover">02 // COMMISSIONS</a></li>
            <li><a href="#spatial" data-cursor="hover">03 // 3D SPHERE MATRIX</a></li>
            <li><a href="#lab" data-cursor="hover">04 // GENERATIVE LAB</a></li>
            <li><a href="#story" data-cursor="hover">05 // CASE STUDY DOSSIER</a></li>
            <li><a href="#process" data-cursor="hover">06 // METHODOLOGY</a></li>
          </ul>
        </div>

        {/* Col 3: Channels */}
        <div className="footer-col">
          <h4 className="footer-col-heading">EXTERNAL CHANNELS</h4>
          <ul className="footer-links-list">
            <li>
              <a href="https://github.com/ranawhocodes/BugHuntArena" target="_blank" rel="noopener noreferrer" data-cursor="hover">
                GITHUB REPOSITORY <ArrowUpRight size={12} />
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" data-cursor="hover">
                LINKEDIN NETWORK <ArrowUpRight size={12} />
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" data-cursor="hover">
                X / TWITTER INTERACTION LAB <ArrowUpRight size={12} />
              </a>
            </li>
            <li>
              <a href="https://awwwards.com" target="_blank" rel="noopener noreferrer" data-cursor="hover">
                AWWWARDS PROFILE <ArrowUpRight size={12} />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Back to top & Specs */}
        <div className="footer-col footer-col--end">
          <button
            type="button"
            className="back-to-top-btn"
            onClick={scrollToTop}
            data-cursor="hover"
          >
            <span>BACK TO TOP</span>
            <ArrowUpRight size={16} />
          </button>
          <div className="footer-specs">
            <span>BUILT WITH REACT 19 & COMPUTATIONAL PHYSICS</span>
            <span>ZERO RUNTIME CSS BLOAT · WCAG AA COMPLIANT</span>
            <span>© 2026 ALEX VANCE. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
