import React, { useEffect } from 'react';
import { X, Terminal } from 'lucide-react';
import type { SpatialProject } from './SpatialSphereCanvas';
import { audioEngine } from '../utils/AudioEngine';
import './ProjectModal.css';

interface ProjectModalProps {
  project: SpatialProject | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        audioEngine.playClick(650);
        onClose();
      }
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => { audioEngine.playClick(650); onClose(); }}
          data-cursor="hover"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="modal-badge-row">
            <span className="modal-year-pill" style={{ borderColor: project.color, color: project.color }}>
              {project.year}
            </span>
            <span className="modal-cat-tag">{project.category}</span>
          </div>
          <h2 id="modal-title" className="modal-title">{project.title}</h2>
          <p className="modal-metric" style={{ color: project.color }}>{project.metric}</p>
        </div>

        <div className="modal-body">
          <div className="modal-section-block">
            <h4 className="modal-block-title">ARCHITECTURAL OVERVIEW</h4>
            <p className="modal-block-text">
              Commissioned as a flagship demonstration of next-generation frontend engineering. Designed without off-the-shelf templates, employing strict mathematical motion damping, custom CSS variables, and zero runtime bloat.
            </p>
          </div>

          <div className="modal-specs-grid">
            <div className="spec-item">
              <span className="spec-label">CORE PARADIGM</span>
              <span className="spec-val">Component Physics &amp; WebGL</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">FRAME RATE</span>
              <span className="spec-val">Locked 120 FPS Native</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">AUDIT SCORE</span>
              <span className="spec-val">100 / 100 Lighthouse</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">COMPLIANCE</span>
              <span className="spec-val">WCAG AA Accessible</span>
            </div>
          </div>

          {project.id === 'bug-arena' && (
            <div className="modal-highlight-box">
              <div className="highlight-icon"><Terminal size={20} /></div>
              <div className="highlight-text">
                <strong>Live In Workspace:</strong> The full playable Bug Hunt Arena game is deployed alongside this showcase!
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="modal-action-btn"
            onClick={onClose}
            data-cursor="hover"
          >
            DISMISS INSPECTOR
          </button>
        </div>
      </div>
    </div>
  );
};
