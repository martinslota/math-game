import { describe, expect, it } from 'vitest';
import { evaluateExpression, parseFriendlyFractionInput } from './fractionMath';

describe('parseFriendlyFractionInput', () => {
  it('parses mixed numbers', () => {
    expect(parseFriendlyFractionInput('2 1/2')).toEqual({ numerator: 5, denominator: 2 });
    expect(parseFriendlyFractionInput('-2 1/2')).toEqual({ numerator: -5, denominator: 2 });
  });

  it('parses decimals and fractions', () => {
    expect(parseFriendlyFractionInput('0.25')).toEqual({ numerator: 1, denominator: 4 });
    expect(parseFriendlyFractionInput('6/8')).toEqual({ numerator: 3, denominator: 4 });
  });

  it('returns null for invalid input', () => {
    expect(parseFriendlyFractionInput('')).toBeNull();
    expect(parseFriendlyFractionInput('2/0')).toBeNull();
    expect(parseFriendlyFractionInput('abc')).toBeNull();
  });
});

describe('evaluateExpression', () => {
  it('computes fraction operations and simplifies', () => {
    expect(
      evaluateExpression({
        left: { numerator: 1, denominator: 2 },
        right: { numerator: 3, denominator: 4 },
        operation: '+'
      })
    ).toEqual({ numerator: 5, denominator: 4 });

    expect(
      evaluateExpression({
        left: { numerator: 6, denominator: 10 },
        right: { numerator: 3, denominator: 5 },
        operation: '÷'
      })
    ).toEqual({ numerator: 1, denominator: 1 });
  });
});
