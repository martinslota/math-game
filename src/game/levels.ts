import { evaluateExpression, fractionToKey } from './fractionMath';
import type { Expression, Fraction, Operation } from '../types';

const LEVEL_COUNT = 10;

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pick = <T,>(values: readonly T[]): T => values[randomInt(0, values.length - 1)];

const createFraction = (maxWhole: number, denominatorOptions: number[]): Fraction => {
  const denominator = pick(denominatorOptions);
  const signedNumerator = randomInt(1, maxWhole * denominator);

  return {
    numerator: signedNumerator,
    denominator
  };
};

const buildExpression = (level: number): Expression => {
  const operations: Operation[] = ['+', '-', '×', '÷'];
  const operation = level <= 2 ? pick(['+', '-'] as const) : pick(operations);
  const denominatorOptions = level <= 3 ? [1, 2, 3, 4] : [2, 3, 4, 5, 6, 8, 10, 12];
  const maxWhole = Math.min(4 + level, 12);

  const left = createFraction(maxWhole, denominatorOptions);
  let right = createFraction(maxWhole, denominatorOptions);

  if (operation === '÷') {
    while (right.numerator === 0) {
      right = createFraction(maxWhole, denominatorOptions);
    }
  }

  return { left, right, operation };
};

export const buildLevelExpressions = (): Expression[] => {
  const expressions: Expression[] = [];
  const seen = new Set<string>();

  while (expressions.length < LEVEL_COUNT) {
    const levelNumber = expressions.length + 1;
    const candidate = buildExpression(levelNumber);
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

export const totalLevels = LEVEL_COUNT;
