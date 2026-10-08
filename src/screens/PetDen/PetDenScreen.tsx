import { useState } from 'react';
import { useAppState } from '../../app/AppState';
import { PetCompanion } from '../../components/PetCompanion';
import type { PetMood } from '../../components/PetCompanion';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import './PetDenScreen.css';

export function PetDenScreen() {
  const { state, feedPet, strokePet, setPetCosmetic } = useAppState();
  const { pet, bugBits } = state;

  const [mood, setMood] = useState<PetMood>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Helper to trigger reaction
  const triggerReaction = (newMood: PetMood, msg: string) => {
    setMood(newMood);
    setFeedback(msg);
    setTimeout(() => {
      setMood('idle');
    }, 2500);
  };

  const handleFeed = () => {
    const res = feedPet();
    if (res.success) {
      triggerReaction('happy', res.message);
    } else {
      triggerReaction('alert', res.message);
    }
  };

  const handleStroke = () => {
    const res = strokePet();
    if (res.success) {
      triggerReaction('happy', res.message);
    } else {
      triggerReaction('sleepy', res.message);
    }
  };

  const handlePetTap = () => {
    const tips = [
      'Bugs can run, but they cannot hide from us!',
      'Always check the array bounds first!',
      'Watch out for mutable default arguments in Python!',
      'Triple equals (===) is a developer best friend!',
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    triggerReaction('thinking', randomTip);
  };

  return (
    <div className="bha-pet-den screen">
      <header className="bha-pet-den__header">
        <Badge variant="accent" size="md">Companion Sanctuary</Badge>
        <h1 className="bha-pet-den__title">The Pet Den</h1>
        <p className="bha-pet-den__subtitle">
          Feed, groom, and evolve your cyber companion as you conquer bugs in the Arena.
        </p>
      </header>

      {/* Main Pet Display Stage */}
      <Card variant="glass" padding="lg" className="bha-pet-stage">
        <div className="bha-pet-stage__showcase">
          <PetCompanion
            species={pet.species}
            stage={pet.stage}
            mood={mood}
            cosmetic={pet.cosmetic}
            size={180}
            onClick={handlePetTap}
            speechText={feedback}
          />
        </div>

        <div className="bha-pet-stage__meta">
          <div className="bha-pet-stage__title-row">
            <h2 className="bha-pet-stage__name">{pet.name}</h2>
            <Badge variant="primary" size="sm">
              Stage {pet.stage} • {pet.species.replace('_', ' ')}
            </Badge>
          </div>

          {/* Happiness Progress Bar */}
          <div className="bha-meter" aria-label={`Happiness: ${pet.happiness} percent`}>
            <div className="bha-meter__header">
              <span className="bha-meter__label">Happiness</span>
              <span className="bha-meter__val">❤️ {pet.happiness}%</span>
            </div>
            <div className="bha-meter__bar">
              <div
                className="bha-meter__fill"
                style={{ width: `${pet.happiness}%` }}
              />
            </div>
          </div>

          {/* Quick Pet Actions */}
          <div className="bha-pet-actions">
            <Button
              variant="primary"
              size="md"
              onClick={handleFeed}
              icon={<span aria-hidden="true">🍖</span>}
              disabled={bugBits < 5}
            >
              Feed (5 Bits)
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleStroke}
              icon={<span aria-hidden="true">👋</span>}
              disabled={pet.strokesToday >= 3}
            >
              Stroke ({pet.strokesToday}/3)
            </Button>
          </div>
        </div>
      </Card>

      {/* Wardrobe & Cosmetics Selector */}
      <section className="bha-wardrobe" aria-labelledby="wardrobe-title">
        <h2 id="wardrobe-title" className="bha-wardrobe__title">
          Cosmetics & Accessories
        </h2>
        <div className="bha-wardrobe__grid">
          <Card
            variant={pet.cosmetic === null ? 'highlight' : 'interactive'}
            padding="sm"
            className="bha-cosmetic-card"
            onClick={() => setPetCosmetic(null)}
          >
            <span className="bha-cosmetic-card__icon" aria-hidden="true">🚫</span>
            <span className="bha-cosmetic-card__name">None</span>
          </Card>

          <Card
            variant={pet.cosmetic === 'hat' ? 'highlight' : 'interactive'}
            padding="sm"
            className="bha-cosmetic-card"
            onClick={() => setPetCosmetic('hat')}
          >
            <span className="bha-cosmetic-card__icon" aria-hidden="true">🎩</span>
            <span className="bha-cosmetic-card__name">Wizard Hat</span>
          </Card>

          <Card
            variant={pet.cosmetic === 'glasses' ? 'highlight' : 'interactive'}
            padding="sm"
            className="bha-cosmetic-card"
            onClick={() => setPetCosmetic('glasses')}
          >
            <span className="bha-cosmetic-card__icon" aria-hidden="true">👓</span>
            <span className="bha-cosmetic-card__name">Cyber Visor</span>
          </Card>

          <Card
            variant={pet.cosmetic === 'crown' ? 'highlight' : 'interactive'}
            padding="sm"
            className="bha-cosmetic-card"
            onClick={() => setPetCosmetic('crown')}
          >
            <span className="bha-cosmetic-card__icon" aria-hidden="true">👑</span>
            <span className="bha-cosmetic-card__name">Slayer Crown</span>
          </Card>
        </div>
      </section>
    </div>
  );
}
