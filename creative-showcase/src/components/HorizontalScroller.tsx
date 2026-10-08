import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Cpu, Code2, Terminal } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import './HorizontalScroller.css';

interface ShowcaseItem {
  id: string;
  number: string;
  title: string;
  client: string;
  year: string;
  role: string;
  stack: string[];
  description: string;
  impact: string;
  accent: string;
  icon: React.ReactNode;
}

const FEATURED_PROJECTS: ShowcaseItem[] = [
  {
    id: 'bug-hunt-arena',
    number: '01',
    title: 'Bug Hunt Arena',
    client: 'Self-Initiated / Open Engineering',
    year: '2026',
    role: 'Lead Architect & Motion Designer',
    stack: ['React 19', 'TypeScript', 'Pure CSS Tokens', 'Gemini AI', 'Vitest'],
    description: 'A gamified debugging battleground where generative AI synthesizes code traps for aspiring engineers. Features deterministic daily runs and evolutionary companion pets.',
    impact: '98.2% test coverage · 0.11 MB zero-bloat runtime · 24 verified puzzles',
    accent: '#3ddcff',
    icon: <Terminal size={28} />,
  },
  {
    id: 'subscrr-spec',
    number: '02',
    title: 'Subscrr Architectural Spec',
    client: 'Subscrr Global',
    year: '2025',
    role: 'Design Technologist & Interaction Lead',
    stack: ['WebGL', 'Micro-Interactions', 'CSS Grid', 'Web Audio'],
    description: 'Re-imagined the subscription intelligence app from conventional SaaS grids into an immersive, long-form editorial journey with chapter-based device storytelling.',
    impact: '+140% Conversion Velocity · Awwwards Site of the Day',
    accent: '#b5ff2b',
    icon: <ShieldCheck size={28} />,
  },
  {
    id: 'aura-sound-lab',
    number: '03',
    title: 'Aura Generative Synthetics',
    client: 'SoundLab Collective',
    year: '2025',
    role: 'Creative Developer & Sound Designer',
    stack: ['Web Audio API', 'Canvas 2D', 'Biquad Filters', 'Complex Oscillators'],
    description: 'Synthesizing real-time ambient drones, harmonic arpeggios, and physics-driven acoustics entirely in the browser without loading heavy audio files.',
    impact: '100% Client-Side Generative · 0 KB MP3 overhead · 60 FPS',
    accent: '#ff402b',
    icon: <Cpu size={28} />,
  },
  {
    id: 'synapse-visualizer',
    number: '04',
    title: 'Synapse Graph AI Engine',
    client: 'Neural Systems Inc.',
    year: '2026',
    role: 'Systems UI Engineer',
    stack: ['Three.js', 'Force-Directed Graph', 'SIMD WebAssembly', 'GLSL'],
    description: 'Real-time spatial visualization of multi-modal AI reasoning chains and vector cluster connections across ten thousand multidimensional nodes.',
    impact: '120Hz Hardware-Accelerated Rendering · Sub-millisecond latency',
    accent: '#8e55ff',
    icon: <Code2 size={28} />,
  },
];

export const HorizontalScroller: React.FC<{
  onInspectProject: (id: string) => void;
}> = ({ onInspectProject }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !trackRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calculate progress through container
      const totalScrollable = containerHeight - windowHeight;
      const currentScroll = -rect.top;

      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      setScrollProgress(progress);

      // Translate track horizontally on desktop
      if (window.innerWidth > 900) {
        const trackWidth = trackRef.current.scrollWidth;
        const maxTranslate = trackWidth - window.innerWidth + 80;
        trackRef.current.style.transform = `translate3d(${-progress * maxTranslate}px, 0, 0)`;
      } else {
        trackRef.current.style.transform = 'none';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section ref={containerRef} className="horizontal-section" id="work">
      <div className="horizontal-sticky-wrapper">
        {/* Section Header */}
        <div className="horizontal-header container-wide">
          <div className="horizontal-header__left">
            <span className="horizontal-kicker">FEATURED COMMISSIONS</span>
            <h2 className="horizontal-title">ARCHITECTURAL WORK ARCHIVE</h2>
          </div>

          <div className="horizontal-progress-wrap">
            <span className="progress-label">HORIZONTAL SEQUENCE</span>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="progress-pct">{Math.round(scrollProgress * 100)}%</span>
          </div>
        </div>

        {/* Horizontal Track of Cards */}
        <div className="horizontal-track-container" data-cursor="drag" data-cursor-label="SCROLL">
          <div ref={trackRef} className="horizontal-track">
            {FEATURED_PROJECTS.map((project) => (
              <article
                key={project.id}
                className="project-h-card"
                style={{ '--card-accent': project.accent } as React.CSSProperties}
                data-cursor="view"
                data-cursor-label="VIEW"
              >
                {/* Top Architectural Meta */}
                <div className="project-h-card__top">
                  <div className="project-number-badge">
                    <span className="num-prefix">PROJECT</span>
                    <span className="num-val">{project.number}</span>
                  </div>
                  <div className="project-meta-pills">
                    <span className="meta-pill">{project.year}</span>
                    <span className="meta-pill meta-pill--accent">{project.role}</span>
                  </div>
                </div>

                {/* Media Artwork Window */}
                <div className="project-h-card__media">
                  <div className="media-visual-frame" style={{ borderColor: project.accent }}>
                    <div className="visual-icon-glow" style={{ color: project.accent }}>
                      {project.icon}
                    </div>
                    <div className="visual-code-preview">
                      <div className="code-line"><span className="code-fn">initSystem</span>({project.id})</div>
                      <div className="code-line"><span className="code-ret">return</span> <span className="code-str">"{project.impact}"</span></div>
                    </div>
                  </div>
                </div>

                {/* Content & Details */}
                <div className="project-h-card__body">
                  <div className="project-client">{project.client}</div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>

                  <div className="project-stack">
                    {project.stack.map((tech) => (
                      <span key={tech} className="tech-badge">{tech}</span>
                    ))}
                  </div>

                  <div className="project-impact-box">
                    <span className="impact-label">MEASURED OUTCOME</span>
                    <span className="impact-val">{project.impact}</span>
                  </div>

                  <div className="project-card-actions">
                    <MagneticButton
                      variant="primary"
                      onClick={() => onInspectProject(project.id)}
                      cursorLabel="OPEN"
                    >
                      <span>INSPECT CASE STUDY</span>
                      <ArrowRight size={16} />
                    </MagneticButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
