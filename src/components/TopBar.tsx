import { ThemeToggle } from './ThemeToggle';
import type { Route } from '../app/router';
import './TopBar.css';

export interface TopBarProps {
  currentRoute: Route;
  onNavigate: (route: Route) => void;
  streakDays?: number;
  level?: number;
  xp?: number;
  bugBits?: number;
}

export function TopBar({
  currentRoute,
  onNavigate,
  streakDays = 0,
  level = 1,
  bugBits = 50,
}: TopBarProps) {
  return (
    <header className="bha-topbar" role="banner">
      <div className="bha-topbar__inner">
        {/* Left: Brand */}
        <div className="bha-topbar__left">
          <button
            type="button"
            className="bha-topbar__logo"
            onClick={() => onNavigate('/')}
            aria-label="Bug Hunt Arena — Home"
          >
            <span className="bha-topbar__logo-icon" aria-hidden="true">
              🐛
            </span>
            <span className="bha-topbar__logo-title">Bug Hunt Arena</span>
          </button>
        </div>

        {/* Center: Stat Badges */}
        <div className="bha-topbar__stats" aria-label="Player stats summary">
          <div
            className="bha-stat-pill bha-stat-pill--streak"
            title={`${streakDays} Day Streak`}
            aria-label={`${streakDays} Day Streak`}
          >
            <span className="bha-stat-pill__icon" aria-hidden="true">🔥</span>
            <span className="bha-stat-pill__val">{streakDays}</span>
          </div>

          <div
            className="bha-stat-pill bha-stat-pill--level"
            title={`Level ${level}`}
            aria-label={`Level ${level}`}
          >
            <span className="bha-stat-pill__icon" aria-hidden="true">⭐</span>
            <span className="bha-stat-pill__val">Lv.{level}</span>
          </div>

          <div
            className="bha-stat-pill bha-stat-pill--bits"
            title={`${bugBits} Bug Bits`}
            aria-label={`${bugBits} Bug Bits`}
          >
            <span className="bha-stat-pill__icon" aria-hidden="true">🪙</span>
            <span className="bha-stat-pill__val">{bugBits}</span>
          </div>
        </div>

        {/* Right: Navigation + Theme Toggle */}
        <div className="bha-topbar__right">
          <nav className="bha-topbar__nav" aria-label="Main navigation">
            <button
              type="button"
              className={`bha-topbar__nav-link ${
                currentRoute === '/play' ? 'bha-topbar__nav-link--active' : ''
              }`}
              onClick={() => onNavigate('/play')}
              aria-current={currentRoute === '/play' ? 'page' : undefined}
            >
              <span aria-hidden="true">⚔️</span> Arena
            </button>
            <button
              type="button"
              className={`bha-topbar__nav-link ${
                currentRoute === '/daily' ? 'bha-topbar__nav-link--active' : ''
              }`}
              onClick={() => onNavigate('/daily')}
              aria-current={currentRoute === '/daily' ? 'page' : undefined}
            >
              <span aria-hidden="true">📅</span> Daily
            </button>
            <button
              type="button"
              className={`bha-topbar__nav-link ${
                currentRoute === '/pet' ? 'bha-topbar__nav-link--active' : ''
              }`}
              onClick={() => onNavigate('/pet')}
              aria-current={currentRoute === '/pet' ? 'page' : undefined}
            >
              <span aria-hidden="true">🐾</span> Pet
            </button>
            <button
              type="button"
              className={`bha-topbar__nav-link ${
                currentRoute === '/profile' ? 'bha-topbar__nav-link--active' : ''
              }`}
              onClick={() => onNavigate('/profile')}
              aria-current={currentRoute === '/profile' ? 'page' : undefined}
            >
              <span aria-hidden="true">👤</span> Profile
            </button>
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
