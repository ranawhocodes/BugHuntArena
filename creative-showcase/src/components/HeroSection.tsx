import React, { useEffect, useRef } from 'react';
import { ArrowDownRight, Sparkles } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import './HeroSection.css';

interface HeroSectionProps {
  onExploreWork: () => void;
  onExploreSpatial: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreWork,
  onExploreSpatial,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generative fluid particle mesh reacting to pointer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', onResize);

    // Particle nodes
    const nodeCount = Math.min(Math.floor((width * height) / 18000), 75);
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseX: number;
      baseY: number;
    }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        baseX: 0,
        baseY: 0,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', onMouseMove);

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render connectors
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Render nodes & mouse repulsion
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Mouse displacement
        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (1 - dist / 150) * 2.5;
          node.x -= (dx / dist) * force;
          node.y -= (dy / dist) * force;
        }

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = i % 4 === 0 ? 'rgba(255, 64, 43, 0.7)' : 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <section className="hero-section" id="hero">
      <canvas ref={canvasRef} className="hero-canvas" />

      <div className="hero-container container-wide">
        {/* Architectural Eyebrow Strip */}
        <div className="hero-eyebrow">
          <div className="eyebrow-cell">
            <span className="eyebrow-label">DISCIPLINE</span>
            <span className="eyebrow-val">DESIGN TECHNOLOGIST / CREATIVE DEV</span>
          </div>
          <div className="eyebrow-cell">
            <span className="eyebrow-label">LOCATION</span>
            <span className="eyebrow-val">37.7749° N, 122.4194° W · SF / GLOBAL</span>
          </div>
          <div className="eyebrow-cell">
            <span className="eyebrow-label">SPECIALTY</span>
            <span className="eyebrow-val">SPATIAL UI · SHADER PHYSICS · KINETIC TYPE</span>
          </div>
        </div>

        {/* Massive Headline Breakdown */}
        <div className="hero-display-wrap">
          <div className="hero-line hero-line--top">
            <span className="hero-word hero-word--outline">CRAFTING</span>
            <span className="hero-separator">/</span>
            <span className="hero-word">THE</span>
            <span className="hero-badge">
              <Sparkles size={14} className="hero-badge__icon" />
              <span>AWARD-WINNING INTERACTION</span>
            </span>
          </div>

          <div className="hero-line hero-line--massive">
            <h1 className="hero-main-title">
              UNREAL DIGITAL
            </h1>
          </div>

          <div className="hero-line hero-line--bottom">
            <span className="hero-word hero-word--accent">EXPERIENCES</span>
            <span className="hero-statement">
              Bridging computational physics, bespoke typography, and high-frequency digital architectures for brands that refuse the ordinary.
            </span>
          </div>
        </div>

        {/* Hero Bottom Meta & CTAs */}
        <div className="hero-footer-bar">
          <div className="hero-actions">
            <MagneticButton
              variant="primary"
              onClick={onExploreWork}
              cursorLabel="DISCOVER"
            >
              <span>EXPLORE SELECTED WORK</span>
              <ArrowDownRight size={18} />
            </MagneticButton>

            <MagneticButton
              variant="secondary"
              onClick={onExploreSpatial}
              cursorLabel="CANVAS"
            >
              <span>3D SPATIAL ARCHIVE</span>
            </MagneticButton>
          </div>

          <div className="hero-scroll-cue">
            <div className="scroll-indicator-mouse">
              <div className="scroll-indicator-wheel" />
            </div>
            <span className="scroll-indicator-text">SCROLL TO DISCOVER</span>
          </div>
        </div>
      </div>
    </section>
  );
};
