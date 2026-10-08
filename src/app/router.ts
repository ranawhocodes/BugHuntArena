import { useState, useEffect, useCallback } from 'react';

/** Supported hash routes */
export type Route = '/' | '/play' | '/daily' | '/profile' | '/pet' | '/about';

const VALID_ROUTES: Route[] = ['/', '/play', '/daily', '/profile', '/pet', '/about'];

/** Parse the current hash into a Route, defaulting to '/' */
function parseHash(): Route {
  const rawHash = window.location.hash.replace('#', '') || '/';
  const path = rawHash.split('?')[0];
  return VALID_ROUTES.includes(path as Route) ? (path as Route) : '/';
}

/**
 * Lightweight hash router hook.
 * Returns the current route and a navigate function.
 * Per spec Section 7.1: ~50 lines, no router library.
 */
export function useRouter(): {
  route: Route;
  navigate: (to: Route, query?: Record<string, string>) => void;
} {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onHashChange = () => {
      const newRoute = parseHash();
      setRoute(newRoute);

      // Move focus to main heading on route change per spec Section 6.6
      requestAnimationFrame(() => {
        const heading = document.querySelector('main h1, main [role="heading"]');
        if (heading instanceof HTMLElement) {
          heading.focus();
        }
      });
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((to: Route, query?: Record<string, string>) => {
    if (query && Object.keys(query).length > 0) {
      const q = new URLSearchParams(query).toString();
      window.location.hash = `#${to}?${q}`;
    } else {
      window.location.hash = `#${to}`;
    }
  }, []);

  return { route, navigate };
}
