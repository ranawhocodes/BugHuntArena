import { useRouter } from './router';
import type { Route } from './router';

/** Screen titles for document.title updates per spec Section 6.6 */
const SCREEN_TITLES: Record<Route, string> = {
  '/': 'Bug Hunt Arena — Hunt Bugs. Level Up.',
  '/play': 'Arena — Bug Hunt Arena',
  '/daily': 'Daily Hunt — Bug Hunt Arena',
  '/profile': 'Profile — Bug Hunt Arena',
  '/pet': 'Pet Den — Bug Hunt Arena',
  '/about': 'About — Bug Hunt Arena',
};

/** Placeholder screen component */
function PlaceholderScreen({ title }: { title: string }) {
  return (
    <div className="screen">
      <h1 tabIndex={-1}>{title}</h1>
      <p>Coming soon...</p>
    </div>
  );
}

export function App() {
  const { route, navigate } = useRouter();

  // Update document title on route change
  document.title = SCREEN_TITLES[route];

  return (
    <div className="app-shell" data-theme="dark">
      {/* Skip link for accessibility per spec Section 6.6 */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="top-bar" role="banner">
        <button
          className="logo-btn"
          onClick={() => navigate('/')}
          aria-label="Bug Hunt Arena — Home"
        >
          <span className="logo-icon" aria-hidden="true">🐛</span>
          <span className="logo-text">Bug Hunt Arena</span>
        </button>

        <nav className="top-nav" aria-label="Main navigation">
          <button
            onClick={() => navigate('/daily')}
            aria-current={route === '/daily' ? 'page' : undefined}
            className="nav-btn"
          >
            🔥 Daily
          </button>
          <button
            onClick={() => navigate('/profile')}
            aria-current={route === '/profile' ? 'page' : undefined}
            className="nav-btn"
          >
            👤 Profile
          </button>
          <button
            onClick={() => navigate('/pet')}
            aria-current={route === '/pet' ? 'page' : undefined}
            className="nav-btn"
          >
            🐾 Pet
          </button>
        </nav>
      </header>

      <main id="main-content" role="main">
        {route === '/' && <PlaceholderScreen title="Home" />}
        {route === '/play' && <PlaceholderScreen title="Arena" />}
        {route === '/daily' && <PlaceholderScreen title="Daily Hunt" />}
        {route === '/profile' && <PlaceholderScreen title="Profile" />}
        {route === '/pet' && <PlaceholderScreen title="Pet Den" />}
        {route === '/about' && <PlaceholderScreen title="About" />}
      </main>

      <footer role="contentinfo">
        <button
          onClick={() => navigate('/about')}
          className="footer-link"
        >
          About
        </button>
      </footer>
    </div>
  );
}
