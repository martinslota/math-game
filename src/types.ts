export type Fraction = {
  numerator: number;
  denominator: number;
};

export type Operation = '+' | '-' | '×' | '÷';

export type Expression = {
  left: Fraction;
  right: Fraction;
  operation: Operation;
};

export type GamePhase = 'landing' | 'playing' | 'won' | 'lost';
