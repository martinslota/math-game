import { describe, expect, it } from 'vitest';
import { PROBLEMS_PER_LEVEL, buildLevelExpressions, totalLevels } from './levels';

describe('buildLevelExpressions', () => {
  it('creates multiple problems per level', () => {
    const levels = buildLevelExpressions();

    expect(levels).toHaveLength(totalLevels);
    levels.forEach((level) => {
      expect(level).toHaveLength(PROBLEMS_PER_LEVEL);
    });
  });

  it('progressively unlocks harder operation mixes', () => {
    const levels = buildLevelExpressions();

    const level1Operations = new Set(levels[0].map((problem) => problem.operation));
    const level6Operations = new Set(levels[5].map((problem) => problem.operation));
    const level10Operations = new Set(levels[9].map((problem) => problem.operation));

    expect(level1Operations).toEqual(new Set(['+']));
    expect(level6Operations).toEqual(new Set(['÷']));
    expect(level10Operations.size).toBeGreaterThanOrEqual(2);
  });
});
