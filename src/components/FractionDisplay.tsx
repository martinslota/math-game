import type { Fraction } from '../types';
import { simplifyFraction } from '../game/fractionMath';

type FractionDisplayProps = {
  value: Fraction;
};

export const FractionDisplay = ({ value }: FractionDisplayProps) => {
  const fraction = simplifyFraction(value);

  if (fraction.denominator === 1) {
    return <span className="whole-number">{fraction.numerator}</span>;
  }

  const absNumerator = Math.abs(fraction.numerator);
  const whole = Math.trunc(absNumerator / fraction.denominator);
  const remainder = absNumerator % fraction.denominator;
  const isNegative = fraction.numerator < 0;

  return (
    <span className="fraction-wrapper" aria-label={`${fraction.numerator}/${fraction.denominator}`}>
      {isNegative && <span className="sign">-</span>}
      {whole > 0 && <span className="whole-number">{whole}</span>}
      {remainder > 0 && (
        <span className="fraction" role="math">
          <span className="numerator">{remainder}</span>
          <span className="fraction-bar" />
          <span className="denominator">{fraction.denominator}</span>
        </span>
      )}
      {remainder === 0 && whole === 0 && <span className="whole-number">0</span>}
    </span>
  );
};
