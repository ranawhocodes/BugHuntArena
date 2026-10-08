import React, { useEffect, useRef, useState } from 'react';
import { Sliders, RefreshCw, Copy, Check, Zap } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';
import './InteractiveCodeLab.css';

export const InteractiveCodeLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particleCount, setParticleCount] = useState(160);
  const [gravity, setGravity] = useState(1.4);
  const [turbulence, setTurbulence] = useState(0.8);
  const [colorScheme, setColorScheme] = useState<'vermilion' | 'cyan' | 'lime'>('vermilion');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    window.addEventListener('resize', onResize);

    // Particles array
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];

    const spawnParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * turbulence * 2,
      vy: (Math.random() - 0.5) * turbulence * 2,
      radius: Math.random() * 2.5 + 1,
      life: 0,
      maxLife: Math.random() * 200 + 100,
    });

    for (let i = 0; i < particleCount; i++) {
      particles.push(spawnParticle());
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * window.devicePixelRatio;
      mouseY = (e.clientY - rect.top) * window.devicePixelRatio;
    };

    canvas.addEventListener('mousemove', onMouseMove);

    let animId: number;

    const render = () => {
      // Semi-transparent fade for kinetic motion trails
      ctx.fillStyle = 'rgba(10, 12, 17, 0.2)';
      ctx.fillRect(0, 0, width, height);

      const colorMap = {
        vermilion: ['#ff402b', '#ff7842', '#ffffff'],
        cyan: ['#00e5ff', '#3ddcff', '#ffffff'],
        lime: ['#b5ff2b', '#8ae600', '#ffffff'],
      };

      const activeColors = colorMap[colorScheme];

      // Update & render particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gravitational pull toward mouse / attractor
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 10) {
          const force = (gravity * 180) / (dist * dist + 100);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Apply friction
        p.vx *= 0.96;
        p.vy *= 0.96;

        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = activeColors[i % activeColors.length];
        ctx.shadowColor = activeColors[0];
        ctx.shadowBlur = p.radius * 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMouseMove);
    };
  }, [particleCount, gravity, turbulence, colorScheme]);

  const handleRandomize = () => {
    setGravity(parseFloat((Math.random() * 2.5 + 0.5).toFixed(1)));
    setTurbulence(parseFloat((Math.random() * 1.8 + 0.2).toFixed(1)));
    setParticleCount(Math.floor(Math.random() * 200 + 80));
    audioEngine.playTactileChime();
  };

  const copyConfig = () => {
    const configStr = `// Generative Kinetic Engine Config\nconst engineParams = {\n  particles: ${particleCount},\n  gravityCoeff: ${gravity},\n  turbulenceFrequency: ${turbulence},\n  spectralTheme: '${colorScheme}'\n};`;
    navigator.clipboard.writeText(configStr);
    setCopied(true);
    audioEngine.playClick(1000);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="lab-section" id="lab">
      <div className="container-wide">
        {/* Header */}
        <div className="lab-header">
          <div className="lab-header__eyebrow">
            <Zap size={14} className="lab-icon" />
            <span>REFERENCE 05 — ELENA GONCI INTERACTIVE WORKSPACE</span>
          </div>
          <h2 className="lab-title">KINETIC GENERATIVE LAB</h2>
          <p className="lab-subtitle">
            Directly manipulate physics constants of our client-side particle engine. Move your pointer across the canvas to observe real-time vector field attraction.
          </p>
        </div>

        {/* Studio Lab Matrix Layout */}
        <div className="lab-studio-grid">
          {/* Canvas Viewport */}
          <div className="lab-canvas-viewport" data-cursor="play" data-cursor-label="GRAVITY">
            <canvas ref={canvasRef} className="lab-canvas" />
            <div className="lab-canvas-overlay-tag">
              <span className="rec-dot" />
              <span>LIVE RENDER · 120HZ COMPUTE</span>
            </div>
          </div>

          {/* Controls Dashboard Rack */}
          <div className="lab-control-rack">
            <div className="rack-header">
              <Sliders size={16} />
              <span>PHYSICS TELEMETRY PANEL</span>
            </div>

            {/* Parameter: Particles */}
            <div className="control-slider-group">
              <div className="slider-label-row">
                <span>ACTIVE PARTICLES</span>
                <span className="slider-val">{particleCount}</span>
              </div>
              <input
                type="range"
                min="60"
                max="320"
                value={particleCount}
                onChange={(e) => setParticleCount(Number(e.target.value))}
                className="lab-range-input"
              />
            </div>

            {/* Parameter: Gravity */}
            <div className="control-slider-group">
              <div className="slider-label-row">
                <span>ATTRACTION INTENSITY</span>
                <span className="slider-val">{gravity} G</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={gravity}
                onChange={(e) => setGravity(Number(e.target.value))}
                className="lab-range-input"
              />
            </div>

            {/* Parameter: Turbulence */}
            <div className="control-slider-group">
              <div className="slider-label-row">
                <span>VECTOR TURBULENCE</span>
                <span className="slider-val">{turbulence} λ</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.5"
                step="0.1"
                value={turbulence}
                onChange={(e) => setTurbulence(Number(e.target.value))}
                className="lab-range-input"
              />
            </div>

            {/* Spectral Scheme Selector */}
            <div className="control-slider-group">
              <div className="slider-label-row">
                <span>SPECTRAL THEME</span>
                <span className="slider-val">{colorScheme.toUpperCase()}</span>
              </div>
              <div className="palette-switchers">
                <button
                  type="button"
                  className={`palette-btn ${colorScheme === 'vermilion' ? 'palette-btn--active' : ''}`}
                  onClick={() => { setColorScheme('vermilion'); audioEngine.playClick(700); }}
                >
                  <span className="color-swatch" style={{ background: '#ff402b' }} />
                  <span>VERMILION</span>
                </button>
                <button
                  type="button"
                  className={`palette-btn ${colorScheme === 'cyan' ? 'palette-btn--active' : ''}`}
                  onClick={() => { setColorScheme('cyan'); audioEngine.playClick(900); }}
                >
                  <span className="color-swatch" style={{ background: '#00e5ff' }} />
                  <span>CYBER CYAN</span>
                </button>
                <button
                  type="button"
                  className={`palette-btn ${colorScheme === 'lime' ? 'palette-btn--active' : ''}`}
                  onClick={() => { setColorScheme('lime'); audioEngine.playClick(1100); }}
                >
                  <span className="color-swatch" style={{ background: '#b5ff2b' }} />
                  <span>ACID LIME</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="rack-actions">
              <button
                type="button"
                className="lab-action-btn"
                onClick={handleRandomize}
                data-cursor="hover"
              >
                <RefreshCw size={14} />
                <span>RANDOMIZE SEED</span>
              </button>

              <button
                type="button"
                className="lab-action-btn lab-action-btn--primary"
                onClick={copyConfig}
                data-cursor="hover"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'CONFIG COPIED' : 'EXPORT PARAMS'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
