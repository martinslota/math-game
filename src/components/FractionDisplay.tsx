import type { Fraction } from '../types';
import { simplifyFraction } from '../game/fractionMath';

type FractionDisplayProps = {
  value: Fraction;
};

type RenderedFractionParts = {
  denominator: number;
  isNegative: boolean;
  numeratorRemainder: number;
  wholePart: number;
};

const toMixedParts = (value: Fraction): RenderedFractionParts => {
  const fraction = simplifyFraction(value);
  const absoluteNumerator = Math.abs(fraction.numerator);

  return {
    denominator: fraction.denominator,
    isNegative: fraction.numerator < 0,
    numeratorRemainder: absoluteNumerator % fraction.denominator,
    wholePart: Math.trunc(absoluteNumerator / fraction.denominator)
  };
};

export const FractionDisplay = ({ value }: FractionDisplayProps) => {
  const fraction = simplifyFraction(value);

  if (fraction.denominator === 1) {
    return <span className="whole-number">{fraction.numerator}</span>;
  }

  const { denominator, isNegative, numeratorRemainder, wholePart } = toMixedParts(value);

  return (
    <span className="fraction-expression" aria-label={`${fraction.numerator}/${fraction.denominator}`}>
      {isNegative && <span className="sign">−</span>}
      {wholePart > 0 && <span className="whole-number">{wholePart}</span>}
      {numeratorRemainder > 0 && (
        <span className="fraction" role="math" aria-hidden="true">
          <span className="numerator">{numeratorRemainder}</span>
          <span className="fraction-bar" />
          <span className="denominator">{denominator}</span>
        </span>
      )}
      {numeratorRemainder === 0 && wholePart === 0 && <span className="whole-number">0</span>}
    </span>
  );
};
