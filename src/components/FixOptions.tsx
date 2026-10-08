import { useEffect } from 'react';
import type { FixOption } from '../content/types';
import './FixOptions.css';

export interface FixOptionsProps {
  options: FixOption[];
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function FixOptions({
  options,
  selectedOptionId,
  onSelectOption,
  onSubmit,
  disabled = false,
}: FixOptionsProps) {
  // Listen for keyboard keys 1, 2, 3, 4 and Enter
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (options[idx]) {
          e.preventDefault();
          onSelectOption(options[idx].id);
        }
      } else if (e.key === 'Enter' && selectedOptionId) {
        e.preventDefault();
        onSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, selectedOptionId, onSelectOption, onSubmit, disabled]);

  return (
    <div className="bha-fix-options" role="radiogroup" aria-label="Select the correct fix">
      <div className="bha-fix-options__header">
        <h3 className="bha-fix-options__title">Step 2: Choose the Correct Fix</h3>
        <span className="bha-fix-options__shortcut-hint">Press keys 1–4 or Enter</span>
      </div>

      <div className="bha-fix-options__list">
        {options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;
          const keyNumber = idx + 1;

          return (
            <div
              key={option.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={disabled ? -1 : 0}
              className={`bha-fix-option ${isSelected ? 'bha-fix-option--selected' : ''}`}
              onClick={() => !disabled && onSelectOption(option.id)}
              onKeyDown={(e) => {
                if (disabled) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectOption(option.id);
                }
              }}
            >
              <div className="bha-fix-option__badge">
                <span className="bha-fix-option__key">{keyNumber}</span>
              </div>
              <div className="bha-fix-option__content">
                <code className="bha-fix-option__code">{option.codeReplacement.trim()}</code>
              </div>
              <div className="bha-fix-option__radio" aria-hidden="true">
                <span className={`radio-circle ${isSelected ? 'radio-circle--checked' : ''}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
