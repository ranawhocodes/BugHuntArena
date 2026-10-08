import { useEffect } from 'react';
import { useRouter } from './router';
import type { Route } from './router';
import { AppStateProvider, useAppState } from './AppState';
import { calculateLevel } from '../engine/engine';
import { TopBar } from '../components/TopBar';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { AboutScreen } from '../screens/About/AboutScreen';
import { ArenaScreen } from '../screens/Arena/ArenaScreen';

/** Screen titles for document.title updates per spec Section 6.6 */
const SCREEN_TITLES: Record<Route, string> = {
  '/': 'Bug Hunt Arena — Hunt Bugs. Level Up.',
  '/play': 'Arena — Bug Hunt Arena',
  '/daily': 'Daily Hunt — Bug Hunt Arena',
  '/profile': 'Profile — Bug Hunt Arena',
  '/pet': 'Pet Den — Bug Hunt Arena',
  '/about': 'About — Bug Hunt Arena',
};

/** Placeholder screen component for screens still under construction */
function PlaceholderScreen({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="screen" style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-4)' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-3)' }} aria-hidden="true">
        {icon}
      </div>
      <h1 tabIndex={-1} style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
        {title}
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-lg)' }}>
        {subtitle}
      </p>
    </div>
  );
}

function AppContent() {
  const { route, navigate } = useRouter();
  const { state } = useAppState();

  const levelInfo = calculateLevel(state.xp);

  // Update document title on route change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = SCREEN_TITLES[route] || SCREEN_TITLES['/'];
    }
  }, [route]);

  return (
    <div className="app-shell" data-theme="dark">
      {/* Skip link for accessibility per spec Section 6.6 */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <TopBar
        currentRoute={route}
        onNavigate={navigate}
        streakDays={state.streakDays}
        level={levelInfo.level}
        bugBits={state.bugBits}
      />

      <main id="main-content" role="main">
        {route === '/' && <HomeScreen onNavigate={navigate} />}
        {route === '/play' && <ArenaScreen />}
        {route === '/daily' && (
          <PlaceholderScreen
            title="Daily Hunt"
            subtitle="Today's 3-puzzle challenge arriving in Brick 9..."
            icon="📅"
          />
        )}
        {route === '/profile' && (
          <PlaceholderScreen
            title="Hunter Profile"
            subtitle="Bug Dex, statistics & achievement badges arriving in Brick 10..."
            icon="👤"
          />
        )}
        {route === '/pet' && (
          <PlaceholderScreen
            title="Pet Den"
            subtitle="Your interactive SVG pet companion arriving in Brick 8..."
            icon="🐾"
          />
        )}
        {route === '/about' && <AboutScreen />}
      </main>

      <footer role="contentinfo">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="footer-link"
          >
            Home
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => navigate('/about')}
            className="footer-link"
          >
            About & Shortcuts
          </button>
          <span>•</span>
          <a
            href="https://github.com/ranawhocodes/BugHuntArena"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub Repo
          </a>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}
