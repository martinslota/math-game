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
    return (
      <math className="fraction-expression" aria-label={`${fraction.numerator}`}>
        <mn>{fraction.numerator}</mn>
      </math>
    );
  }

  const { denominator, isNegative, numeratorRemainder, wholePart } = toMixedParts(value);

  return (
    <math className="fraction-expression" aria-label={`${fraction.numerator}/${fraction.denominator}`}>
      <mrow>
        {isNegative && <mo>−</mo>}
        {wholePart > 0 && <mn>{wholePart}</mn>}
        {numeratorRemainder > 0 && (
          <mfrac>
            <mn>{numeratorRemainder}</mn>
            <mn>{denominator}</mn>
          </mfrac>
        )}
        {numeratorRemainder === 0 && wholePart === 0 && <mn>0</mn>}
      </mrow>
    </math>
  );
};
