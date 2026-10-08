import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw, Play, Pause, Layers } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';
import './SpatialSphereCanvas.css';

export interface SpatialProject {
  id: string;
  title: string;
  category: string;
  year: string;
  metric: string;
  color: string;
}

export const SPATIAL_PROJECTS: SpatialProject[] = [
  {
    id: 'bug-arena',
    title: 'Bug Hunt Arena',
    category: 'Gamified EdTech Engine',
    year: '2026',
    metric: '24 Puzzles / AI Dynamic Generator',
    color: '#3ddcff',
  },
  {
    id: 'kinetic-audio',
    title: 'Aura Synthetics',
    category: 'Spatial Sound & Shader Engine',
    year: '2025',
    metric: '60 FPS Web Audio Matrix',
    color: '#ff402b',
  },
  {
    id: 'subscrr-redesign',
    title: 'Subscrr Spec Design',
    category: 'Fintech Experience Architecture',
    year: '2025',
    metric: '+140% Conversion Flow',
    color: '#b5ff2b',
  },
  {
    id: 'neural-canvas',
    title: 'Synapse Graph UI',
    category: 'AI Knowledge Visualizer',
    year: '2026',
    metric: '10,000 Nodes at 120Hz',
    color: '#8e55ff',
  },
  {
    id: 'fmi-editorial',
    title: 'FMI Material Systems',
    category: 'Swiss Corporate Architecture',
    year: '2024',
    metric: 'Awwwards Site of the Day',
    color: '#00e5ff',
  },
  {
    id: 'swsh-kinetic',
    title: 'SWSH Kinetic Ticker',
    category: 'High-Frequency Motion System',
    year: '2025',
    metric: 'Variable Physics Easing',
    color: '#ff9142',
  },
];

interface Point3D {
  x: number;
  y: number;
  z: number;
  project: SpatialProject;
}

export const SpatialSphereCanvas: React.FC<{
  onSelectProject: (project: SpatialProject) => void;
}> = ({ onSelectProject }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeProject, setActiveProject] = useState<SpatialProject | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  // Rotation angles & momentum
  const rotX = useRef(0.2);
  const rotY = useRef(0.3);
  const velX = useRef(0.003);
  const velY = useRef(0.004);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const pointsRef = useRef<Point3D[]>([]);

  // Initialize spherical distribution using Fibonacci sphere algorithm
  const initPoints = useCallback(() => {
    const points: Point3D[] = [];
    const count = SPATIAL_PROJECTS.length;
    const radius = 230;

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      points.push({
        x,
        y,
        z,
        project: SPATIAL_PROJECTS[i],
      });
    }
    pointsRef.current = points;
  }, []);

  useEffect(() => {
    initPoints();
  }, [initPoints]);

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

    let hoveredPoint: Point3D | null = null;
    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const scaleBase = Math.min(width, height) / 600;

      // Update rotation
      if (isRotating && !isDragging.current) {
        rotX.current += velX.current;
        rotY.current += velY.current;
      }

      // Draw faint spherical reference rings
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 230 * scaleBase, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 230 * scaleBase, 80 * scaleBase, rotY.current, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Transform and project 3D points
      const cosX = Math.cos(rotX.current);
      const sinX = Math.sin(rotX.current);
      const cosY = Math.cos(rotY.current);
      const sinY = Math.sin(rotY.current);

      const projected = pointsRef.current.map((pt) => {
        // Rotate around Y
        const x1 = pt.x * cosY + pt.z * sinY;
        const z1 = -pt.x * sinY + pt.z * cosY;

        // Rotate around X
        const y2 = pt.y * cosX - z1 * sinX;
        const z2 = pt.y * sinX + z1 * cosX;

        // Perspective projection
        const fov = 650;
        const scale = (fov / (fov + z2)) * scaleBase;
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;

        return {
          ...pt,
          projX,
          projY,
          projZ: z2,
          scale,
        };
      });

      // Sort by depth (back to front)
      projected.sort((a, b) => b.projZ - a.projZ);

      // Render connectors to center core
      for (const pt of projected) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(pt.projX, pt.projY);
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.02, (pt.projZ + 250) / 1800)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Render nodes
      for (const pt of projected) {
        const isHovered = hoveredPoint?.project.id === pt.project.id;
        const depthAlpha = Math.max(0.3, Math.min(1, (pt.projZ + 240) / 480));
        const nodeRadius = (isHovered ? 26 : 18) * pt.scale;

        // Outer glow
        if (isHovered || pt.projZ > 80) {
          ctx.beginPath();
          ctx.arc(pt.projX, pt.projY, nodeRadius * 2, 0, Math.PI * 2);
          ctx.fillStyle = pt.project.color;
          ctx.globalAlpha = isHovered ? 0.35 : 0.08 * depthAlpha;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }

        // Inner circle
        ctx.beginPath();
        ctx.arc(pt.projX, pt.projY, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#ffffff' : pt.project.color;
        ctx.globalAlpha = depthAlpha;
        ctx.fill();

        // White border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isHovered ? 3 : 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Project label: only render if in front half of sphere or hovered to avoid text overlaps
        if (isHovered || pt.projZ > 40) {
          ctx.save();
          const textAlpha = isHovered ? 1.0 : Math.min(1.0, (pt.projZ - 40) / 80);
          ctx.globalAlpha = textAlpha;
          ctx.font = `${Math.round(11 * pt.scale * window.devicePixelRatio)}px 'Space Grotesk', sans-serif`;
          ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.85)';
          ctx.fillText(pt.project.title, pt.projX + nodeRadius + 8, pt.projY + 4);

          ctx.font = `${Math.round(9 * pt.scale * window.devicePixelRatio)}px 'JetBrains Mono', monospace`;
          ctx.fillStyle = pt.project.color;
          ctx.fillText(pt.project.category.toUpperCase(), pt.projX + nodeRadius + 8, pt.projY + 16);
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // Mouse interactions
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseCanvasX = (e.clientX - rect.left) * window.devicePixelRatio;
      const mouseCanvasY = (e.clientY - rect.top) * window.devicePixelRatio;

      if (isDragging.current) {
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;

        rotY.current += deltaX * 0.006;
        rotX.current -= deltaY * 0.006;

        velY.current = deltaX * 0.001;
        velX.current = -deltaY * 0.001;

        lastMousePos.current = { x: e.clientX, y: e.clientY };
      } else {
        // Check hover on nodes
        let foundHover: Point3D | null = null;
        for (const pt of pointsRef.current) {
          const cosX = Math.cos(rotX.current);
          const sinX = Math.sin(rotX.current);
          const cosY = Math.cos(rotY.current);
          const sinY = Math.sin(rotY.current);

          const x1 = pt.x * cosY + pt.z * sinY;
          const z1 = -pt.x * sinY + pt.z * cosY;
          const y2 = pt.y * cosX - z1 * sinX;
          const z2 = pt.y * sinX + z1 * cosX;

          const fov = 650;
          const scaleBase = Math.min(width, height) / 600;
          const scale = (fov / (fov + z2)) * scaleBase;
          const projX = width / 2 + x1 * scale;
          const projY = height / 2 + y2 * scale;

          const dist = Math.hypot(mouseCanvasX - projX, mouseCanvasY - projY);
          if (dist < 32 * scale) {
            foundHover = pt;
            break;
          }
        }

        if (foundHover !== hoveredPoint) {
          hoveredPoint = foundHover;
          setActiveProject(foundHover?.project || null);
          if (foundHover) {
            audioEngine.playClick(1200);
          }
        }
      }
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onClick = () => {
      if (hoveredPoint) {
        audioEngine.playTactileChime();
        onSelectProject(hoveredPoint.project);
      }
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('click', onClick);
    };
  }, [isRotating, onSelectProject]);

  const resetRotation = () => {
    rotX.current = 0.2;
    rotY.current = 0.3;
    velX.current = 0.003;
    velY.current = 0.004;
    audioEngine.playClick(800);
  };

  return (
    <section className="spatial-section" id="spatial">
      <div className="spatial-header container">
        <div className="spatial-eyebrow">
          <Layers size={14} className="spatial-icon" />
          <span>REFERENCE 03 — DUDA LIMA SPATIAL DISCOVERY</span>
        </div>
        <h2 className="spatial-title">SPATIAL PROJECT MATRIX</h2>
        <p className="spatial-subtitle">
          Explore experimental works mapped as a 3D orbital sphere. Click and drag to spin with momentum, or hover any node to inspect project specs.
        </p>
      </div>

      <div
        className="spatial-canvas-container"
        data-cursor="drag"
        data-cursor-label="SPIN"
      >
        <canvas ref={canvasRef} className="spatial-canvas" />

        {/* Floating Active Project Dossier Tag */}
        {activeProject && (
          <div className="spatial-floating-card">
            <div className="floating-card__badge" style={{ backgroundColor: activeProject.color }}>
              <span>{activeProject.year}</span>
            </div>
            <div className="floating-card__content">
              <h4 className="floating-card__title">{activeProject.title}</h4>
              <p className="floating-card__cat">{activeProject.category}</p>
              <p className="floating-card__metric">{activeProject.metric}</p>
            </div>
            <button
              type="button"
              className="floating-card__cta"
              onClick={() => onSelectProject(activeProject)}
              data-cursor="hover"
            >
              INSPECT DOSSIER →
            </button>
          </div>
        )}

        {/* Canvas Toolbar Controls */}
        <div className="spatial-controls">
          <button
            type="button"
            className="spatial-ctrl-btn"
            onClick={() => setIsRotating(!isRotating)}
            title={isRotating ? 'Pause Orbital Auto-Spin' : 'Resume Orbital Auto-Spin'}
            data-cursor="hover"
          >
            {isRotating ? <Pause size={14} /> : <Play size={14} />}
            <span>{isRotating ? 'PAUSE ROTATION' : 'RESUME'}</span>
          </button>
          <button
            type="button"
            className="spatial-ctrl-btn"
            onClick={resetRotation}
            title="Reset Sphere Orientation"
            data-cursor="hover"
          >
            <RotateCcw size={14} />
            <span>RESET AXIS</span>
          </button>
        </div>
      </div>
    </section>
  );
};
