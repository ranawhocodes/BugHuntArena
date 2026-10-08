import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sun, Moon, Radio } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';
import './FloatingDashboard.css';

interface FloatingDashboardProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const FloatingDashboard: React.FC<FloatingDashboardProps> = ({
  onNavigate,
  activeSection,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [fps, setFps] = useState(60);
  const [scrolled, setScrolled] = useState(false);

  // Time ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop() || 'UTC';
      setTimeStr(`${time} [${tz}]`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll detection & FPS counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const calcFps = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(calcFps);
    };

    animId = requestAnimationFrame(calcFps);

    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const toggleSound = () => {
    const active = audioEngine.toggleMute();
    setIsPlayingAudio(active);
  };

  const toggleTheme = () => {
    const newTheme = !isLightMode;
    setIsLightMode(newTheme);
    document.body.classList.toggle('theme-light', newTheme);
    document.body.classList.toggle('theme-dark', !newTheme);
    audioEngine.playClick(1020);
  };

  return (
    <header className={`floating-dash ${scrolled ? 'floating-dash--scrolled' : ''}`}>
      <div className="floating-dash__inner">
        {/* Left: Brand Identity */}
        <div className="floating-dash__brand">
          <button
            type="button"
            className="brand-link"
            onClick={() => onNavigate('hero')}
            data-cursor="hover"
          >
            <span className="brand-glyph">✦</span>
            <span className="brand-name">ALEX VANCE</span>
            <span className="brand-tag">DIR. TECHNOLOGIST</span>
          </button>
        </div>

        {/* Center: Quick Navigation */}
        <nav className="floating-dash__nav" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-item ${activeSection === 'work' ? 'nav-item--active' : ''}`}
            onClick={() => onNavigate('work')}
            data-cursor="hover"
          >
            01. WORK
          </button>
          <button
            type="button"
            className={`nav-item ${activeSection === 'spatial' ? 'nav-item--active' : ''}`}
            onClick={() => onNavigate('spatial')}
            data-cursor="explore"
            data-cursor-label="SPHERE"
          >
            02. SPATIAL
          </button>
          <button
            type="button"
            className={`nav-item ${activeSection === 'lab' ? 'nav-item--active' : ''}`}
            onClick={() => onNavigate('lab')}
            data-cursor="play"
            data-cursor-label="LAB"
          >
            03. LAB
          </button>
          <button
            type="button"
            className={`nav-item ${activeSection === 'story' ? 'nav-item--active' : ''}`}
            onClick={() => onNavigate('story')}
            data-cursor="hover"
          >
            04. DOSSIER
          </button>
          <button
            type="button"
            className={`nav-item ${activeSection === 'contact' ? 'nav-item--active' : ''}`}
            onClick={() => onNavigate('contact')}
            data-cursor="hover"
          >
            05. CONTACT
          </button>
        </nav>

        {/* Right: Real-time telemetry & widgets */}
        <div className="floating-dash__telemetry">
          {/* Availability Pill */}
          <div className="telemetry-pill telemetry-pill--avail" title="Commission Availability Status">
            <Radio className="telemetry-pill__pulse" size={10} />
            <span className="telemetry-pill__text">AVAILABLE Q3/Q4</span>
          </div>

          {/* Time & FPS */}
          <div className="telemetry-pill telemetry-pill--mono" title="Local System Time and Renderer FPS">
            <span className="time-val">{timeStr}</span>
            <span className="fps-val">{fps} FPS</span>
          </div>

          {/* Audio Synthesizer Toggle */}
          <button
            type="button"
            className={`telemetry-btn ${isPlayingAudio ? 'telemetry-btn--active' : ''}`}
            onClick={toggleSound}
            title={isPlayingAudio ? 'Mute Ambient Audio Drone' : 'Unmute Generative Ambient Audio'}
            data-cursor="hover"
            aria-label="Toggle Generative Ambient Audio"
          >
            {isPlayingAudio ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span className="telemetry-btn__label">{isPlayingAudio ? 'AUDIO ON' : 'MUTE'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            className="telemetry-btn telemetry-btn--icon-only"
            onClick={toggleTheme}
            title="Toggle Light/Dark Theme"
            data-cursor="hover"
            aria-label="Toggle Theme"
          >
            {isLightMode ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
};
