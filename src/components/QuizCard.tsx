import { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type { QuizItem } from '../lib/types';

interface QuizCardProps {
  item: QuizItem;
  index: number;
  total: number;
  selectedChoice: number | null;
  isCorrect: boolean;
  xpGained: number;
  combo: number;
  state: 'question' | 'answered';
  onAnswer: (choiceIndex: number, choices: string[]) => void;
  onNext: () => void;
}

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];
const CHOICE_KEYS = ['1', '2', '3', '4'];

export function QuizCard({
  item, index, total, selectedChoice, isCorrect, xpGained, combo,
  state, onAnswer, onNext,
}: QuizCardProps) {
  const [showXP, setShowXP] = useState(false);

  const choices = useMemo(() => {
    const arr = [...item.verb.choices];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [item.verb.id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (state === 'question') {
        const idx = CHOICE_KEYS.indexOf(e.key);
        if (idx !== -1 && idx < choices.length) {
          onAnswer(idx, choices);
        }
      } else if (state === 'answered') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNext();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state, choices, onAnswer, onNext]);

  useEffect(() => {
    if (state === 'answered' && isCorrect) {
      confetti({
        particleCount: 40 + combo * 15,
        spread: 50 + combo * 10,
        origin: { y: 0.65 },
        colors: ['#e8ff47', '#47ffb2', '#ff9f43'],
      });
      setShowXP(true);
      const t = setTimeout(() => setShowXP(false), 1000);
      return () => clearTimeout(t);
    }
  }, [state, isCorrect, combo]);

  const correctIdx = choices.indexOf(item.verb.choices[0]);

  const highlighted = (verb: string, example: string) => {
    const regex = new RegExp(`(${verb.replace(/\s+/g, '\\s+')})`, 'gi');
    const parts = example.split(regex);
    return parts.map((part, i) =>
      regex.test(part)
        ? <span key={i} className="accent-line" style={{ color: 'var(--color-accent)' }}>{part}</span>
        : <span key={i}>{part}</span>
    );
  };

  return (
    <div className="animate-fade-scale">
      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs uppercase tracking-[0.2em]"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
        >
          {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-3">
          {combo >= 2 && state === 'question' && (
            <span
              className="text-xs tracking-wider"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
            >
              x{combo} combo
            </span>
          )}
          {item.isReview && (
            <span
              className="text-xs uppercase tracking-[0.15em] px-2 py-0.5"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-streak)',
                border: '1px solid var(--color-streak)',
              }}
            >
              Review
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-px mb-8" style={{ background: 'var(--color-surface-border)' }}>
        <div
          className="h-px transition-all duration-500 ease-out"
          style={{
            width: `${((index + 1) / total) * 100}%`,
            background: 'var(--color-accent)',
          }}
        />
      </div>

      {/* Verb card */}
      <div className="relative mb-8">
        <h2
          className="text-4xl italic mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {item.verb.verb}
        </h2>
        <p
          className="text-lg leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {highlighted(item.verb.verb, item.verb.example)}
        </p>
        {state === 'answered' && (
          <p
            className="mt-3 text-sm animate-reveal"
            style={{ color: 'var(--color-text-dim)', fontFamily: 'var(--font-body)' }}
          >
            {item.verb.example_ja}
          </p>
        )}
        {showXP && xpGained > 0 && (
          <div
            className="absolute top-0 right-0 animate-xp-float"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <span className="text-lg font-bold" style={{ color: 'var(--color-correct)' }}>+{xpGained}</span>
            {combo > 1 && (
              <span className="text-xs ml-1" style={{ color: 'var(--color-accent)' }}>x{combo}</span>
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px mb-6" style={{ background: 'var(--color-surface-border)' }} />

      {/* Choices */}
      <div className="space-y-3 mb-8">
        {choices.map((choice, i) => {
          let borderColor = 'var(--color-surface-border)';
          let bg = 'var(--color-surface-raised)';
          let labelColor = 'var(--color-text-dim)';
          let extra = '';

          if (state === 'answered') {
            if (i === correctIdx) {
              borderColor = 'var(--color-correct)';
              bg = 'var(--color-correct-bg)';
              labelColor = 'var(--color-correct)';
            } else if (i === selectedChoice && !isCorrect) {
              borderColor = 'var(--color-wrong)';
              bg = 'var(--color-wrong-bg)';
              labelColor = 'var(--color-wrong)';
              extra = 'animate-shake';
            }
          }

          return (
            <button
              key={i}
              onClick={() => state === 'question' && onAnswer(i, choices)}
              disabled={state === 'answered'}
              className={`choice-btn ${extra} w-full flex items-center gap-4 border p-4 text-left transition-all ${
                state === 'answered' ? 'cursor-default' : 'cursor-pointer'
              }`}
              style={{ borderColor, background: bg }}
            >
              <span
                className="text-xs w-6 text-center flex-shrink-0"
                style={{ fontFamily: 'var(--font-mono)', color: labelColor }}
              >
                <span className="uppercase">{CHOICE_LABELS[i]}</span>
                <span className="ml-0.5 opacity-40" style={{ fontSize: '0.6rem' }}>{CHOICE_KEYS[i]}</span>
              </span>
              <span className="text-base">{choice}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback + Next */}
      {state === 'answered' && (
        <div className="animate-reveal">
          <div
            className="text-center mb-6 text-sm uppercase tracking-[0.15em]"
            style={{
              fontFamily: 'var(--font-mono)',
              color: isCorrect ? 'var(--color-correct)' : 'var(--color-wrong)',
            }}
          >
            {isCorrect ? 'Correct' : `Incorrect — ${item.verb.choices[0]}`}
          </div>
          <button
            onClick={onNext}
            className="w-full py-4 text-center tracking-wider uppercase transition-all cursor-pointer border-0 hover:tracking-[0.25em] active:scale-[0.98]"
            style={{
              fontFamily: 'var(--font-mono)',
              background: 'var(--color-accent)',
              color: 'var(--color-surface)',
              fontSize: '0.875rem',
            }}
          >
            Next <span className="opacity-40 text-xs ml-1">Enter</span>
          </button>
        </div>
      )}
    </div>
  );
}
