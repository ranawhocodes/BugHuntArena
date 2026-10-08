import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRandomCuratedPuzzle, requestBugPuzzle } from '../../src/ai/generator';
import { validatePuzzle } from '../../src/content/validator';

describe('AI Bug Generator & Resilient Fallback (Brick 11)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getRandomCuratedPuzzle returns a valid puzzle matching requested language', () => {
    const pyPuzzle = getRandomCuratedPuzzle('python');
    expect(pyPuzzle.language).toBe('python');
    expect(validatePuzzle(pyPuzzle).valid).toBe(true);

    const jsPuzzle = getRandomCuratedPuzzle('javascript');
    expect(jsPuzzle.language).toBe('javascript');
    expect(validatePuzzle(jsPuzzle).valid).toBe(true);
  });

  it('requestBugPuzzle falls back gracefully to curated bank when network fails', async () => {
    // Mock fetch rejection
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network offline')));

    const res = await requestBugPuzzle('python', 1);
    expect(res.puzzle).toBeDefined();
    expect(res.isAiGenerated).toBe(false);
    expect(res.puzzle.language).toBe('python');
    expect(validatePuzzle(res.puzzle).valid).toBe(true);
  });

  it('requestBugPuzzle returns AI puzzle when server provides valid response', async () => {
    const sampleAiPuzzle = getRandomCuratedPuzzle('python');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          fallback: false,
          puzzle: sampleAiPuzzle,
        }),
      }),
    );

    const res = await requestBugPuzzle('python', 1);
    expect(res.puzzle).toBeDefined();
    expect(res.isAiGenerated).toBe(true);
  });
});
