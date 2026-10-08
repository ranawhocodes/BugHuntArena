import { describe, it, expect } from 'vitest';
import { ALL_PUZZLES, getPuzzleById, getPuzzlesByLanguage } from '../../src/content/puzzles';
import { validatePuzzle } from '../../src/content/validator';
import { MAX_CODE_LINE_LENGTH } from '../../src/engine/constants';
import type { Difficulty, FixOption } from '../../src/content/types';

describe('Puzzle Bank & Validator (Brick 2)', () => {
  it('contains exactly 24 verified puzzles (12 Python, 12 JavaScript)', () => {
    expect(ALL_PUZZLES.length).toBe(24);
    const pythonPuzzles = getPuzzlesByLanguage('python');
    const jsPuzzles = getPuzzlesByLanguage('javascript');
    expect(pythonPuzzles.length).toBe(12);
    expect(jsPuzzles.length).toBe(12);
  });

  it('every puzzle passes strict schema validation without errors', () => {
    ALL_PUZZLES.forEach((puzzle) => {
      const result = validatePuzzle(puzzle);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  it('all puzzle IDs are unique', () => {
    const ids = new Set<string>();
    ALL_PUZZLES.forEach((p) => {
      expect(ids.has(p.id)).toBe(false);
      ids.add(p.id);
    });
  });

  it('all creature IDs are unique', () => {
    const creatureIds = new Set<string>();
    ALL_PUZZLES.forEach((p) => {
      expect(creatureIds.has(p.creature.id)).toBe(false);
      creatureIds.add(p.creature.id);
    });
  });

  it('no puzzle code lines exceed MAX_CODE_LINE_LENGTH', () => {
    ALL_PUZZLES.forEach((p) => {
      const lines = p.buggyCode.split('\n');
      lines.forEach((line) => {
        expect(line.length).toBeLessThanOrEqual(MAX_CODE_LINE_LENGTH);
      });
    });
  });

  it('getPuzzleById finds existing puzzles and returns undefined for unknown', () => {
    expect(getPuzzleById('py-01-off-by-one')).toBeDefined();
    expect(getPuzzleById('js-01-loose-equality')).toBeDefined();
    expect(getPuzzleById('non-existent-id')).toBeUndefined();
  });

  it('correct option replacement produces valid fixed code for all 24 puzzles', () => {
    ALL_PUZZLES.forEach((p) => {
      const correctOpt = p.options.find((o) => o.id === p.correctOptionId);
      expect(correctOpt).toBeDefined();
      const lines = p.buggyCode.split('\n');
      lines[p.bugLineNumber - 1] = correctOpt!.codeReplacement;
      const fixedCode = lines.join('\n');
      expect(fixedCode).not.toEqual(p.buggyCode);
      expect(fixedCode.length).toBeGreaterThan(0);
    });
  });

  it('validator flags invalid puzzle properties', () => {
    const invalidPuzzle = {
      ...ALL_PUZZLES[0],
      id: 'INVALID ID WITH SPACES',
      difficulty: 99 as unknown as Difficulty,
      buggyCode: 'a\nb', // less than 3 lines
      options: [] as unknown as [FixOption, FixOption, FixOption, FixOption],
    };
    const res = validatePuzzle(invalidPuzzle);
    expect(res.valid).toBe(false);
    expect(res.errors.length).toBeGreaterThanOrEqual(3);
  });
});

