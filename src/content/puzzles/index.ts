import { PYTHON_PUZZLES } from './python';
import { JAVASCRIPT_PUZZLES } from './javascript';
import type { BugPuzzle, Language } from '../types';

export const ALL_PUZZLES: BugPuzzle[] = [...PYTHON_PUZZLES, ...JAVASCRIPT_PUZZLES];

export function getPuzzleById(id: string): BugPuzzle | undefined {
  return ALL_PUZZLES.find((p) => p.id === id);
}

export function getPuzzlesByLanguage(language: Language): BugPuzzle[] {
  return ALL_PUZZLES.filter((p) => p.language === language);
}

export function getAllPuzzles(): BugPuzzle[] {
  return ALL_PUZZLES;
}
