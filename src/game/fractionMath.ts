import type { Expression, Fraction, Operation } from '../types';

const OPERATION_WORDS: Record<string, Operation> = {
  '+': '+',
  '-': '-',
  x: '×',
  X: '×',
  '*': '×',
  times: '×',
  '×': '×',
  '/': '÷',
  '÷': '÷',
  div: '÷',
  divide: '÷'
};

const gcd = (a: number, b: number): number => {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }

  return x || 1;
};

export const simplifyFraction = (fraction: Fraction): Fraction => {
  if (fraction.denominator === 0) {
    throw new Error('Denominator cannot be zero.');
  }

  const sign = fraction.denominator < 0 ? -1 : 1;
  const numerator = fraction.numerator * sign;
  const denominator = fraction.denominator * sign;
  const commonDivisor = gcd(numerator, denominator);

  return {
    numerator: numerator / commonDivisor,
    denominator: denominator / commonDivisor
  };
};

export const fractionToKey = (fraction: Fraction): string => {
  const normalized = simplifyFraction(fraction);
  return `${normalized.numerator}/${normalized.denominator}`;
};

const add = (left: Fraction, right: Fraction): Fraction => ({
  numerator: left.numerator * right.denominator + right.numerator * left.denominator,
  denominator: left.denominator * right.denominator
});

const subtract = (left: Fraction, right: Fraction): Fraction => ({
  numerator: left.numerator * right.denominator - right.numerator * left.denominator,
  denominator: left.denominator * right.denominator
});

const multiply = (left: Fraction, right: Fraction): Fraction => ({
  numerator: left.numerator * right.numerator,
  denominator: left.denominator * right.denominator
});

const divide = (left: Fraction, right: Fraction): Fraction => {
  if (right.numerator === 0) {
    throw new Error('Cannot divide by zero fraction.');
  }

  return {
    numerator: left.numerator * right.denominator,
    denominator: left.denominator * right.numerator
  };
};

export const evaluateExpression = ({ left, right, operation }: Expression): Fraction => {
  const rawResult =
    operation === '+'
      ? add(left, right)
      : operation === '-'
        ? subtract(left, right)
        : operation === '×'
          ? multiply(left, right)
          : divide(left, right);

  return simplifyFraction(rawResult);
};

export const parseFriendlyFractionInput = (value: string): Fraction | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = trimmed
    .replace(/,/g, '.')
    .replace(/\s+/g, ' ')
    .replace(/−/g, '-')
    .trim();

  const mixedNumberMatch = normalized.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixedNumberMatch) {
    const whole = Number(mixedNumberMatch[1]);
    const numerator = Number(mixedNumberMatch[2]);
    const denominator = Number(mixedNumberMatch[3]);

    if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) {
      return null;
    }

    const sign = whole < 0 ? -1 : 1;
    return simplifyFraction({
      numerator: whole * denominator + sign * numerator,
      denominator
    });
  }

  const simpleFractionMatch = normalized.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if (simpleFractionMatch) {
    const numerator = Number(simpleFractionMatch[1]);
    const denominator = Number(simpleFractionMatch[2]);

    if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) {
      return null;
    }

    return simplifyFraction({ numerator, denominator });
  }

  if (/^-?\d+(\.\d+)?$/.test(normalized)) {
    const asNumber = Number(normalized);
    if (!Number.isFinite(asNumber)) {
      return null;
    }

    if (Number.isInteger(asNumber)) {
      return { numerator: asNumber, denominator: 1 };
    }

    const decimalPart = normalized.split('.')[1] ?? '';
    const denominator = 10 ** decimalPart.length;
    const numerator = Math.round(asNumber * denominator);
    return simplifyFraction({ numerator, denominator });
  }

  return null;
};

export const parseOperationInput = (value: string): Operation | null => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  return OPERATION_WORDS[normalized] ?? null;
};
