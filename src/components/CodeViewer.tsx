import React, { useRef } from 'react';
import type { Language } from '../content/types';
import { tokenizeLine } from '../highlight/tokenizer';
import './CodeViewer.css';

export interface CodeViewerProps {
  code: string;
  language: Language;
  selectedLine?: number | null; // 1-indexed
  highlightedLine?: number | null; // 1-indexed (e.g. correct line found)
  wrongLine?: number | null; // 1-indexed (flashing error line)
  onSelectLine?: (lineNumber: number) => void;
  disabled?: boolean;
}

export function CodeViewer({
  code,
  language,
  selectedLine,
  highlightedLine,
  wrongLine,
  onSelectLine,
  disabled = false,
}: CodeViewerProps) {
  const lines = code.split('\n');
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, lineNum: number) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectLine?.(lineNum);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.min(lines.length - 1, lineNum);
      lineRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = Math.max(0, lineNum - 2);
      lineRefs.current[prevIndex]?.focus();
    }
  };

  return (
    <div
      className={`bha-code-viewer ${disabled ? 'bha-code-viewer--disabled' : ''}`}
      role="region"
      aria-label={`${language} code snippet editor`}
    >
      <div className="bha-code-viewer__header">
        <span className="bha-code-viewer__lang">{language}</span>
        <span className="bha-code-viewer__hint">
          {disabled ? 'Inspection Mode' : 'Click or press Enter on the line with the bug'}
        </span>
      </div>

      <div className="bha-code-viewer__body" role="group">
        {lines.map((rawLine, idx) => {
          const lineNum = idx + 1;
          const isSelected = selectedLine === lineNum;
          const isHighlighted = highlightedLine === lineNum;
          const isWrong = wrongLine === lineNum;
          const tokens = tokenizeLine(rawLine, language);

          return (
            <div
              key={lineNum}
              ref={(el) => {
                lineRefs.current[idx] = el;
              }}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-label={`Line ${lineNum}: ${rawLine || 'empty line'}`}
              aria-pressed={isSelected}
              className={`bha-code-line ${isSelected ? 'bha-code-line--selected' : ''} ${
                isHighlighted ? 'bha-code-line--highlighted' : ''
              } ${isWrong ? 'bha-code-line--wrong' : ''}`}
              onClick={() => !disabled && onSelectLine?.(lineNum)}
              onKeyDown={(e) => handleKeyDown(e, lineNum)}
            >
              <span className="bha-code-line__num" aria-hidden="true">
                {lineNum}
              </span>
              <span className="bha-code-line__content">
                {tokens.length === 0 ? (
                  '\u00A0'
                ) : (
                  tokens.map((token, tIdx) => (
                    <span
                      key={tIdx}
                      className={`tok tok--${token.type}`}
                    >
                      {token.text}
                    </span>
                  ))
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
