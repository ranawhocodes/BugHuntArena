import { useState, useEffect, useCallback } from 'react';

/** Supported hash routes */
export type Route = '/' | '/play' | '/daily' | '/profile' | '/pet' | '/about';

const VALID_ROUTES: Route[] = ['/', '/play', '/daily', '/profile', '/pet', '/about'];

/** Parse the current hash into a Route, defaulting to '/' */
function parseHash(): Route {
  const hash = window.location.hash.replace('#', '') || '/';
  return VALID_ROUTES.includes(hash as Route) ? (hash as Route) : '/';
}

/**
 * Lightweight hash router hook.
 * Returns the current route and a navigate function.
 * Per spec Section 7.1: ~50 lines, no router library.
 */
export function useRouter(): { route: Route; navigate: (to: Route) => void } {
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

  const navigate = useCallback((to: Route) => {
    window.location.hash = `#${to}`;
  }, []);

  return { route, navigate };
}
