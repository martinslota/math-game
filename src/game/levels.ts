import { evaluateExpression, fractionToKey } from './fractionMath';
import type { Expression, Fraction, Operation } from '../types';

const LEVEL_COUNT = 10;
export const PROBLEMS_PER_LEVEL = 3;

type LevelDifficulty = {
  denominatorOptions: number[];
  maxWhole: number;
  operations: Operation[];
  allowNegative: boolean;
};

const LEVEL_DIFFICULTIES: LevelDifficulty[] = [
  { operations: ['+'], denominatorOptions: [1, 2, 3, 4], maxWhole: 4, allowNegative: false },
  { operations: ['+'], denominatorOptions: [2, 3, 4, 5, 6], maxWhole: 5, allowNegative: false },
  { operations: ['-'], denominatorOptions: [2, 3, 4, 6], maxWhole: 5, allowNegative: false },
  { operations: ['+', '-'], denominatorOptions: [2, 3, 4, 5, 6, 8], maxWhole: 6, allowNegative: false },
  { operations: ['×'], denominatorOptions: [2, 3, 4, 5, 6, 8, 10], maxWhole: 6, allowNegative: false },
  { operations: ['÷'], denominatorOptions: [2, 3, 4, 5, 6, 8, 10], maxWhole: 7, allowNegative: false },
  { operations: ['×', '÷'], denominatorOptions: [2, 3, 4, 5, 6, 8, 10, 12], maxWhole: 8, allowNegative: false },
  { operations: ['+', '-', '×'], denominatorOptions: [2, 3, 4, 5, 6, 8, 10, 12], maxWhole: 9, allowNegative: true },
  { operations: ['-', '×', '÷'], denominatorOptions: [2, 3, 4, 5, 6, 8, 10, 12], maxWhole: 10, allowNegative: true },
  { operations: ['+', '-', '×', '÷'], denominatorOptions: [2, 3, 4, 5, 6, 8, 10, 12], maxWhole: 12, allowNegative: true }
];

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T,>(values: readonly T[]): T => values[randomInt(0, values.length - 1)];

const createFraction = (difficulty: LevelDifficulty): Fraction => {
  const denominator = pick(difficulty.denominatorOptions);
  const magnitude = randomInt(1, difficulty.maxWhole * denominator);
  const sign = difficulty.allowNegative && Math.random() < 0.35 ? -1 : 1;

  return {
    numerator: magnitude * sign,
    denominator
  };
};

const buildExpression = (difficulty: LevelDifficulty): Expression => {
  const operation = pick(difficulty.operations);

  const left = createFraction(difficulty);
  let right = createFraction(difficulty);

  if (operation === '÷') {
    while (right.numerator === 0) {
      right = createFraction(difficulty);
    }
  }

  return { left, right, operation };
};

const buildLevel = (difficulty: LevelDifficulty): Expression[] => {
  const expressions: Expression[] = [];
  const seen = new Set<string>();

  while (expressions.length < PROBLEMS_PER_LEVEL) {
    const candidate = buildExpression(difficulty);
    const answer = evaluateExpression(candidate);
    const key = `${fractionToKey(candidate.left)} ${candidate.operation} ${fractionToKey(candidate.right)} = ${fractionToKey(answer)}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    expressions.push(candidate);
  }

  return expressions;
};

export const buildLevelExpressions = (): Expression[][] => LEVEL_DIFFICULTIES.map((difficulty) => buildLevel(difficulty));

export const totalLevels = LEVEL_COUNT;
