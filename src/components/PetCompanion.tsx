import type { PetState } from '../storage/schema';
import './PetCompanion.css';

export type PetMood = 'idle' | 'happy' | 'thinking' | 'alert' | 'sleepy';

export interface PetCompanionProps {
  species?: PetState['species'];
  stage?: PetState['stage'];
  mood?: PetMood;
  cosmetic?: PetState['cosmetic'];
  size?: number; // pixel width/height (default 120)
  onClick?: () => void;
  speechText?: string | null;
}

export function PetCompanion({
  species = 'fire_beetle',
  stage = 1,
  mood = 'idle',
  cosmetic = null,
  size = 120,
  onClick,
  speechText,
}: PetCompanionProps) {
  // Primary brand palette by species
  const palette = {
    fire_beetle: {
      primary: '#ff6200',
      secondary: '#ffaa00',
      glow: 'rgba(255, 98, 0, 0.4)',
      accent: '#ff2200',
    },
    byte_moth: {
      primary: '#00d2ff',
      secondary: '#0077ff',
      glow: 'rgba(0, 210, 255, 0.4)',
      accent: '#99eaff',
    },
    glitch_hound: {
      primary: '#bf55ec',
      secondary: '#9b59b6',
      glow: 'rgba(191, 85, 236, 0.4)',
      accent: '#ff4d8d',
    },
  }[species];

  return (
    <div
      className={`bha-pet-wrapper bha-pet--${mood} bha-pet--${species} bha-pet--stage-${stage}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      role={onClick ? 'button' : 'img'}
      tabIndex={onClick ? 0 : -1}
      aria-label={`${species.replace('_', ' ')} companion pet in ${mood} mood`}
      style={{ width: size, height: size }}
    >
      {/* Speech bubble if provided */}
      {speechText && (
        <div className="bha-pet__speech" role="status" aria-live="polite">
          <span className="bha-pet__speech-arrow" aria-hidden="true" />
          {speechText}
        </div>
      )}

      <svg
        viewBox="0 0 100 100"
        className="bha-pet-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={`pet-glow-${species}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={palette.glow} />
          </filter>
          <linearGradient id={`pet-body-grad-${species}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.secondary} />
            <stop offset="100%" stopColor={palette.primary} />
          </linearGradient>
        </defs>

        {/* Aura for Stage 3 & 4 */}
        {stage >= 3 && (
          <circle
            cx="50"
            cy="52"
            r={stage === 4 ? 42 : 38}
            fill="none"
            stroke={palette.primary}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="bha-pet__aura"
            opacity="0.6"
          />
        )}

        {/* SPECIES SPECIFIC RENDERING */}
        {species === 'fire_beetle' && (
          <g filter={`url(#pet-glow-${species})`}>
            {/* Legs */}
            <path d="M 28 50 Q 15 45 12 55" stroke={palette.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 28 60 Q 14 62 10 70" stroke={palette.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 72 50 Q 85 45 88 55" stroke={palette.accent} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 72 60 Q 86 62 90 70" stroke={palette.accent} strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Antennae */}
            <path d="M 42 28 Q 30 14 24 16" stroke={palette.secondary} strokeWidth="2.5" fill="none" strokeLinecap="round" className="bha-antenna bha-antenna--left" />
            <circle cx="24" cy="16" r="3" fill={palette.secondary} />
            <path d="M 58 28 Q 70 14 76 16" stroke={palette.secondary} strokeWidth="2.5" fill="none" strokeLinecap="round" className="bha-antenna bha-antenna--right" />
            <circle cx="76" cy="16" r="3" fill={palette.secondary} />

            {/* Wings / Carapace */}
            <ellipse cx="50" cy="56" rx="26" ry="24" fill={`url(#pet-body-grad-${species})`} />
            <line x1="50" y1="36" x2="50" y2="78" stroke={palette.accent} strokeWidth="2" opacity="0.6" />

            {/* Shell spots */}
            <circle cx="40" cy="50" r="3.5" fill={palette.accent} opacity="0.8" />
            <circle cx="60" cy="50" r="3.5" fill={palette.accent} opacity="0.8" />
            <circle cx="43" cy="65" r="3" fill={palette.accent} opacity="0.8" />
            <circle cx="57" cy="65" r="3" fill={palette.accent} opacity="0.8" />

            {/* Head */}
            <ellipse cx="50" cy="34" rx="16" ry="12" fill={palette.accent} />
          </g>
        )}

        {species === 'byte_moth' && (
          <g filter={`url(#pet-glow-${species})`}>
            {/* Moth Wings */}
            <path d="M 50 48 Q 20 20 12 40 Q 15 70 50 60 Z" fill={`url(#pet-body-grad-${species})`} opacity="0.85" className="bha-wing bha-wing--left" />
            <path d="M 50 48 Q 80 20 88 40 Q 85 70 50 60 Z" fill={`url(#pet-body-grad-${species})`} opacity="0.85" className="bha-wing bha-wing--right" />

            {/* Antennae */}
            <path d="M 46 28 Q 36 10 28 12" stroke={palette.secondary} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 54 28 Q 64 10 72 12" stroke={palette.secondary} strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Fuzzy Body */}
            <ellipse cx="50" cy="52" rx="12" ry="22" fill={palette.accent} />
            <ellipse cx="50" cy="32" rx="14" ry="11" fill={palette.primary} />
          </g>
        )}

        {species === 'glitch_hound' && (
          <g filter={`url(#pet-glow-${species})`}>
            {/* Hound Ears */}
            <polygon points="32,32 20,14 42,24" fill={palette.accent} />
            <polygon points="68,32 80,14 58,24" fill={palette.accent} />

            {/* Body */}
            <ellipse cx="50" cy="62" rx="22" ry="18" fill={`url(#pet-body-grad-${species})`} />

            {/* Head */}
            <circle cx="50" cy="38" r="18" fill={palette.primary} />

            {/* Wagging tail */}
            <path d="M 30 66 Q 16 70 14 58" stroke={palette.accent} strokeWidth="4" fill="none" strokeLinecap="round" className="bha-tail" />
          </g>
        )}

        {/* EYES (React to mood) */}
        {mood === 'sleepy' ? (
          <g stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round">
            <path d="M 40 35 Q 45 40 50 35" />
            <path d="M 55 35 Q 60 40 65 35" />
          </g>
        ) : mood === 'happy' ? (
          <g stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M 40 36 Q 45 30 50 36" />
            <path d="M 55 36 Q 60 30 65 36" />
          </g>
        ) : (
          <g fill="#ffffff">
            <circle cx="44" cy="34" r={mood === 'alert' ? 5 : 4} />
            <circle cx="56" cy="34" r={mood === 'alert' ? 5 : 4} />
            <circle cx="45" cy="33" r="1.5" fill="#040814" />
            <circle cx="57" cy="33" r="1.5" fill="#040814" />
          </g>
        )}

        {/* Cheeks */}
        {(mood === 'happy' || mood === 'idle') && (
          <g fill="#ff4d8d" opacity="0.6">
            <circle cx="38" cy="40" r="3" />
            <circle cx="62" cy="40" r="3" />
          </g>
        )}

        {/* COSMETICS */}
        {cosmetic === 'hat' && (
          <g className="bha-pet-hat">
            <ellipse cx="50" cy="22" rx="18" ry="4" fill="#3a1c71" />
            <polygon points="38,22 50,2 62,22" fill="#d76d77" />
            <circle cx="50" cy="3" r="2.5" fill="#ffaf7b" />
          </g>
        )}

        {cosmetic === 'glasses' && (
          <g className="bha-pet-glasses" stroke="#3ddcff" strokeWidth="2.5" fill="rgba(61, 220, 255, 0.25)">
            <circle cx="44" cy="34" r="7" />
            <circle cx="56" cy="34" r="7" />
            <line x1="51" y1="34" x2="49" y2="34" />
          </g>
        )}

        {cosmetic === 'crown' && (
          <g className="bha-pet-crown" fill="#ffd700" stroke="#b38f00" strokeWidth="1">
            <polygon points="36,22 36,12 43,17 50,10 57,17 64,12 64,22" />
            <circle cx="50" cy="11" r="1.5" fill="#ff4d8d" />
          </g>
        )}
      </svg>
    </div>
  );
}
