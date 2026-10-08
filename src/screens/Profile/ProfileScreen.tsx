import { useMemo } from 'react';
import { useAppState } from '../../app/AppState';
import { useAuth } from '../../auth/AuthContext';
import { ALL_PUZZLES } from '../../content/puzzles';
import { calculateLevel } from '../../engine/engine';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import './ProfileScreen.css';

interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export function ProfileScreen() {
  const { state } = useAppState();
  const { user } = useAuth();
  const { xp, bugBits, streakDays, capturedCreatureIds, completedPuzzleIds } = state;

  const hunterName = state.playerName || (user?.user_metadata?.name as string | undefined)?.trim() || 'Hunter';
  const levelInfo = calculateLevel(xp);

  // Collect all 24 distinct bug creatures from the puzzle bank
  const allCreatures = useMemo(() => {
    const seen = new Set<string>();
    return ALL_PUZZLES.map((p) => p.creature).filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, []);

  // Compute 10 Achievement Badges
  const badges: AchievementBadge[] = useMemo(() => {
    const solvedPython = completedPuzzleIds.some((id) => id.startsWith('py-'));
    const solvedJs = completedPuzzleIds.some((id) => id.startsWith('js-'));

    return [
      {
        id: 'badge-welcome',
        name: 'First Step',
        description: 'Joined Bug Hunt Arena',
        icon: '🌱',
        unlocked: true,
      },
      {
        id: 'badge-first-hunt',
        name: 'First Blood',
        description: 'Squashed your first bug',
        icon: '⚔️',
        unlocked: completedPuzzleIds.length >= 1,
      },
      {
        id: 'badge-clean-catch',
        name: 'Sniper',
        description: 'Solved a bug with 0 hints and 0 wrong lines',
        icon: '🎯',
        unlocked: Object.values(state.categoryStats).some((s) => (s?.cleanCatches ?? 0) > 0),
      },
      {
        id: 'badge-streak-3',
        name: 'Spark',
        description: 'Achieved a 3-day active hunt streak',
        icon: '🔥',
        unlocked: streakDays >= 3,
      },
      {
        id: 'badge-streak-7',
        name: 'Inferno',
        description: 'Achieved a 7-day active hunt streak',
        icon: '⚡',
        unlocked: streakDays >= 7,
      },
      {
        id: 'badge-polyglot',
        name: 'Polyglot',
        description: 'Squashed bugs in both Python and JavaScript',
        icon: '🌐',
        unlocked: solvedPython && solvedJs,
      },
      {
        id: 'badge-pet-lover',
        name: 'Best Friend',
        description: 'Groomed and fed your companion pet',
        icon: '🐾',
        unlocked: state.pet.strokesToday > 0 || state.pet.happiness > 80,
      },
      {
        id: 'badge-dex-5',
        name: 'Collector',
        description: 'Trapped 5 unique bug creatures in Bug Dex',
        icon: '📦',
        unlocked: capturedCreatureIds.length >= 5,
      },
      {
        id: 'badge-dex-12',
        name: 'Master Hunter',
        description: 'Trapped 12 unique bug creatures in Bug Dex',
        icon: '🏆',
        unlocked: capturedCreatureIds.length >= 12,
      },
      {
        id: 'badge-level-5',
        name: 'Arena Legend',
        description: 'Attained Hunter Rank Level 5',
        icon: '👑',
        unlocked: levelInfo.level >= 5,
      },
    ];
  }, [completedPuzzleIds, streakDays, state.categoryStats, state.pet, capturedCreatureIds, levelInfo.level]);

  return (
    <div className="bha-profile screen">
      {/* Hunter Overview Card */}
      <Card variant="glass" padding="lg" className="bha-hunter-card">
        <div className="bha-hunter-card__avatar" aria-hidden="true">
          🧙‍♂️
        </div>
        <div className="bha-hunter-card__info">
          <div className="bha-hunter-card__title-row">
            <div className="bha-hunter-card__header-text">
              <h1 className="bha-hunter-card__title">{hunterName}</h1>
              <p className="bha-hunter-card__rank-subtitle">{levelInfo.title}</p>
            </div>
            <Badge variant="primary" size="md">
              Level {levelInfo.level}
            </Badge>
          </div>

          <div className="bha-hunter-card__stats-grid">
            <div className="bha-hunter-stat">
              <span className="bha-hunter-stat__label">Total XP</span>
              <span className="bha-hunter-stat__val">{xp}</span>
            </div>
            <div className="bha-hunter-stat">
              <span className="bha-hunter-stat__label">Bug Bits</span>
              <span className="bha-hunter-stat__val">🪙 {bugBits}</span>
            </div>
            <div className="bha-hunter-stat">
              <span className="bha-hunter-stat__label">Daily Streak</span>
              <span className="bha-hunter-stat__val">🔥 {streakDays} Days</span>
            </div>
            <div className="bha-hunter-stat">
              <span className="bha-hunter-stat__label">Creatures Trapped</span>
              <span className="bha-hunter-stat__val">
                🐛 {capturedCreatureIds.length}/{allCreatures.length}
              </span>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bha-level-progress">
            <div className="bha-level-progress__header">
              <span>Next Rank: Level {levelInfo.level + 1}</span>
              <span>{levelInfo.progressPercent}%</span>
            </div>
            <div className="bha-level-progress__bar">
              <div
                className="bha-level-progress__fill"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Badges Section */}
      <section className="bha-profile-section" aria-labelledby="badges-title">
        <div className="bha-profile-section__header">
          <h2 id="badges-title">Hunter Badges</h2>
          <span className="bha-profile-section__count">
            {badges.filter((b) => b.unlocked).length}/{badges.length} Unlocked
          </span>
        </div>
        <div className="bha-badges-grid">
          {badges.map((badge) => (
            <Card
              key={badge.id}
              variant={badge.unlocked ? 'glass' : 'default'}
              padding="sm"
              className={`bha-badge-card ${badge.unlocked ? 'bha-badge-card--unlocked' : 'bha-badge-card--locked'}`}
            >
              <div className="bha-badge-card__icon" aria-hidden="true">
                {badge.icon}
              </div>
              <div className="bha-badge-card__meta">
                <span className="bha-badge-card__name">{badge.name}</span>
                <span className="bha-badge-card__desc">{badge.description}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Bug Dex Section */}
      <section className="bha-profile-section" aria-labelledby="dex-title">
        <div className="bha-profile-section__header">
          <h2 id="dex-title">The Bug Dex</h2>
          <span className="bha-profile-section__count">
            {capturedCreatureIds.length}/{allCreatures.length} Captured
          </span>
        </div>
        <div className="bha-dex-grid">
          {allCreatures.map((creature) => {
            const isCaptured = capturedCreatureIds.includes(creature.id);

            return (
              <Card
                key={creature.id}
                variant={isCaptured ? 'glass' : 'default'}
                padding="sm"
                className={`bha-dex-card ${isCaptured ? 'bha-dex-card--captured' : 'bha-dex-card--locked'}`}
              >
                <div className="bha-dex-card__avatar" aria-hidden="true">
                  {isCaptured ? creature.avatarEmoji : '🔒'}
                </div>
                <div className="bha-dex-card__info">
                  <div className="bha-dex-card__header">
                    <span className="bha-dex-card__name">
                      {isCaptured ? creature.name : '??? (Undiscovered)'}
                    </span>
                    {isCaptured && (
                      <Badge variant="accent" size="sm">
                        {creature.rarity}
                      </Badge>
                    )}
                  </div>
                  <span className="bha-dex-card__lore">
                    {isCaptured ? creature.description : 'Squash this creature in the Arena to unlock.'}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
