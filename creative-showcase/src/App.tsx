import React, { useState, useEffect } from 'react';
import './styles/design-system.css';
import { CustomCursor } from './components/CustomCursor';
import { FloatingDashboard } from './components/FloatingDashboard';
import { HeroSection } from './components/HeroSection';
import { KineticMarquee } from './components/KineticMarquee';
import { StatsGrid } from './components/StatsGrid';
import { HorizontalScroller } from './components/HorizontalScroller';
import { SpatialSphereCanvas, SPATIAL_PROJECTS, type SpatialProject } from './components/SpatialSphereCanvas';
import { InteractiveCodeLab } from './components/InteractiveCodeLab';
import { LongFormStory } from './components/LongFormStory';
import { ProcessTimeline } from './components/ProcessTimeline';
import { FAQAccordion } from './components/FAQAccordion';
import { CinematicFooter } from './components/CinematicFooter';
import { ProjectModal } from './components/ProjectModal';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedProject, setSelectedProject] = useState<SpatialProject | null>(null);

  // Smooth navigation to anchors
  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInspectProjectById = (id: string) => {
    const proj = SPATIAL_PROJECTS.find((p) => p.id === id) || SPATIAL_PROJECTS[0];
    setSelectedProject(proj);
  };

  // Section observer to update active nav state
  useEffect(() => {
    const sectionIds = ['hero', 'work', 'spatial', 'lab', 'story', 'process', 'faq', 'contact'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="creative-app-root">
      {/* Context-Aware Custom Cursor */}
      <CustomCursor />

      {/* Floating Telemetry & Navigation Dashboard */}
      <FloatingDashboard
        onNavigate={scrollTo}
        activeSection={activeSection}
      />

      <main>
        {/* 01. Hero Opening Experience */}
        <HeroSection
          onExploreWork={() => scrollTo('work')}
          onExploreSpatial={() => scrollTo('spatial')}
        />

        {/* 02. High-Frequency Kinetic Marquee */}
        <KineticMarquee />

        {/* 03. Quantified Outcomes & Verification Grid */}
        <StatsGrid />

        {/* 04. Horizontal Sequence Showcase */}
        <HorizontalScroller
          onInspectProject={handleInspectProjectById}
        />

        {/* 05. Spatial 3D Sphere Interactive Canvas */}
        <SpatialSphereCanvas
          onSelectProject={(proj) => setSelectedProject(proj)}
        />

        {/* 06. Interactive Physics & Shader Lab */}
        <InteractiveCodeLab />

        {/* 07. Long-Form Product & Engineering Dossier */}
        <LongFormStory />

        {/* 08. Four-Phase Methodology & Architecture */}
        <ProcessTimeline />

        {/* 09. Frequently Asked Inquiries */}
        <FAQAccordion />
      </main>

      {/* 10. Cinematic Magnetic Footer */}
      <CinematicFooter />

      {/* Modal Inspector */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default App;
