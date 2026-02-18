import { useEffect, useMemo, useState } from 'react';
import { FractionDisplay } from './components/FractionDisplay';
import { buildLevelExpressions, totalLevels } from './game/levels';
import { evaluateExpression, fractionToKey, parseFriendlyFractionInput } from './game/fractionMath';
import { useGameAudio } from './audio';
import type { GamePhase } from './types';

const HIGH_SCORE_KEY = 'fraction-quest-high-score';

const readStoredHighScore = (): number => {
  const score = window.localStorage.getItem(HIGH_SCORE_KEY);
  if (!score) {
    return 0;
  }

  const numericScore = Number(score);
  return Number.isInteger(numericScore) && numericScore >= 0 ? numericScore : 0;
};

export const App = () => {
  const [phase, setPhase] = useState<GamePhase>('landing');
  const [lives, setLives] = useState(3);
  const [levelIndex, setLevelIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [highScore, setHighScore] = useState(0);
  const [expressions, setExpressions] = useState(() => buildLevelExpressions());
  const { isMuted, toggleMuted, playEffect, startMusic, stopMusic } = useGameAudio();

  useEffect(() => {
    setHighScore(readStoredHighScore());
  }, []);

  const currentExpression = expressions[levelIndex];

  const moveToLanding = () => {
    playEffect('click');
    setPhase('landing');
    stopMusic();
  };

  const startGame = () => {
    setExpressions(buildLevelExpressions());
    setPhase('playing');
    setLives(3);
    setLevelIndex(0);
    setAnswerInput('');
    setFeedback('');
    playEffect('start');
    startMusic();
  };

  const finishGame = (newPhase: Extract<GamePhase, 'won' | 'lost'>, finalLevel: number) => {
    setPhase(newPhase);

    const score = finalLevel;
    if (score > highScore) {
      setHighScore(score);
      window.localStorage.setItem(HIGH_SCORE_KEY, String(score));
    }

    if (newPhase === 'won') {
      playEffect('win');
    } else {
      playEffect('lose');
    }

    stopMusic();
  };

  const submitAnswer = () => {
    if (!currentExpression) {
      return;
    }

    const parsedAnswer = parseFriendlyFractionInput(answerInput);
    if (!parsedAnswer) {
      playEffect('wrong');
      setFeedback('Please enter a whole number, decimal, fraction (a/b), or mixed number (2 1/3).');
      return;
    }

    const expectedAnswer = evaluateExpression(currentExpression);
    const isCorrect = fractionToKey(parsedAnswer) === fractionToKey(expectedAnswer);

    if (isCorrect) {
      playEffect('correct');
      const nextLevel = levelIndex + 1;
      if (nextLevel >= totalLevels) {
        finishGame('won', totalLevels);
        setFeedback('Amazing! You solved all 10 levels!');
      } else {
        setLevelIndex(nextLevel);
        setAnswerInput('');
        setFeedback('Correct! Next level!');
      }
      return;
    }

    playEffect('wrong');
    const remainingLives = lives - 1;
    setLives(remainingLives);
    setFeedback('Not quite! Try the next challenge.');
    setAnswerInput('');

    if (remainingLives <= 0) {
      finishGame('lost', levelIndex);
    }
  };

  const content = useMemo(() => {
    if (phase === 'landing') {
      return (
        <div className="card landing-card">
          <h1>Fraction Quest</h1>
          <p className="subtitle">A bright math adventure through 10 levels of whole numbers and fractions.</p>
          <p className="high-score">High Score: <strong>{highScore}</strong> / {totalLevels}</p>
          <button type="button" className="primary-button" data-testid="start-game" onClick={startGame}>
            Start Adventure
          </button>
        </div>
      );
    }

    if (phase === 'won' || phase === 'lost') {
      return (
        <div className="card landing-card">
          <h1>{phase === 'won' ? 'You Win! 🎉' : 'Game Over 🐻'}</h1>
          <p className="subtitle">
            {phase === 'won'
              ? 'You conquered all levels with powerful math skills.'
              : `You reached level ${levelIndex + 1}. Dust off and try again!`}
          </p>
          <p className="high-score">High Score: <strong>{highScore}</strong> / {totalLevels}</p>
          <button type="button" className="primary-button" data-testid="play-again" onClick={startGame}>
            Play Again
          </button>
          <button type="button" className="secondary-button" onClick={moveToLanding}>
            Back to Landing Page
          </button>
        </div>
      );
    }

    if (!currentExpression) {
      return null;
    }

    return (
      <div className="card game-card">
        <div className="game-header">
          <p className="level-pill" data-testid="level-indicator">Level {levelIndex + 1} / {totalLevels}</p>
          <p className="lives" data-testid="lives-indicator">Lives: {'❤️'.repeat(lives)}</p>
        </div>

        <p className="instruction">Compute the result:</p>
        <div className="expression" role="math" aria-label="fraction expression">
          <FractionDisplay value={currentExpression.left} />
          <span className="operation">{currentExpression.operation}</span>
          <FractionDisplay value={currentExpression.right} />
          <span className="operation">=</span>
          <span className="question-mark">?</span>
        </div>

        <label htmlFor="answer-input" className="input-label">Your answer</label>
        <input
          id="answer-input"
          className="answer-input"
          value={answerInput}
          onChange={(event) => setAnswerInput(event.target.value)}
          placeholder="Examples: 5, 3/4, 1 1/2, 0.25"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              submitAnswer();
            }
          }}
        />

        <button type="button" className="primary-button" data-testid="check-answer" onClick={submitAnswer}>
          Check Answer
        </button>

        {feedback && <p className="feedback">{feedback}</p>}
      </div>
    );
  }, [answerInput, currentExpression, feedback, highScore, levelIndex, lives, phase]);

  return (
    <main className="app-shell">
      <div className="bg-bubble bubble-a" />
      <div className="bg-bubble bubble-b" />
      <div className="bg-bubble bubble-c" />
      <button
        type="button"
        className="audio-toggle"
        aria-label={isMuted ? 'Enable sound' : 'Mute sound'}
        onClick={toggleMuted}
      >
        {isMuted ? '🔇 Sound Off' : '🔊 Sound On'}
      </button>
      {content}
    </main>
  );
};
