import { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { QuizItem } from '../lib/types';
import { useTilt, useRipple, useSwipe, useInteractiveConfetti } from '../hooks/useInteractive';

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
  const [exiting, setExiting] = useState(false);
  const [choiceHover, setChoiceHover] = useState<number | null>(null);
  const choiceRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Interactive hooks
  const tilt = useTilt(6);
  const { ripples, addRipple } = useRipple();
  useSwipe(() => {
    if (state === 'answered') {
      setExiting(true);
      setTimeout(onNext, 300);
    }
  }, state === 'answered');
  useInteractiveConfetti(state === 'answered' && isCorrect);

  const choices = useMemo(() => {
    const arr = [...item.verb.choices];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [item.verb.id]);

  // Reset exiting state on new question
  useEffect(() => {
    setExiting(false);
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
          setExiting(true);
          setTimeout(onNext, 300);
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

  // Magnetic hover for choice buttons
  const handleChoiceMouseMove = (e: React.MouseEvent, idx: number) => {
    const el = choiceRefs.current[idx];
    if (!el || state !== 'question') return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.08;
    const dy = (e.clientY - cy) * 0.12;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    el.style.transition = 'transform 0.1s ease-out';
    setChoiceHover(idx);
  };

  const handleChoiceMouseLeave = (idx: number) => {
    const el = choiceRefs.current[idx];
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
    el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    setChoiceHover(null);
  };

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
    <div className={exiting ? 'animate-card-exit' : 'animate-fade-scale'}>
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

      {/* Verb card with tilt */}
      <div
        ref={tilt.ref}
        className="relative mb-8 p-5 border"
        style={{
          ...tilt.style,
          borderColor: 'var(--color-surface-border)',
          background: 'var(--color-surface-raised)',
          transformStyle: 'preserve-3d',
        }}
      >
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
            className="absolute top-4 right-4 animate-xp-float"
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

      {/* Choices with spring animation + magnetic hover + ripple */}
      <div className="space-y-3 mb-8">
        {choices.map((choice, i) => {
          let borderColor = 'var(--color-surface-border)';
          let bg = 'var(--color-surface-raised)';
          let labelColor = 'var(--color-text-dim)';
          let extraClass = '';

          if (state === 'answered') {
            if (i === correctIdx) {
              borderColor = 'var(--color-correct)';
              bg = 'var(--color-correct-bg)';
              labelColor = 'var(--color-correct)';
              extraClass = 'animate-correct-pulse';
            } else if (i === selectedChoice && !isCorrect) {
              borderColor = 'var(--color-wrong)';
              bg = 'var(--color-wrong-bg)';
              labelColor = 'var(--color-wrong)';
              extraClass = 'animate-crack';
            }
          }

          const isHovered = choiceHover === i && state === 'question';

          return (
            <button
              key={i}
              ref={el => { choiceRefs.current[i] = el; }}
              onClick={(e) => {
                if (state !== 'question') return;
                addRipple(e);
                onAnswer(i, choices);
              }}
              onMouseMove={(e) => handleChoiceMouseMove(e, i)}
              onMouseLeave={() => handleChoiceMouseLeave(i)}
              disabled={state === 'answered'}
              className={`animate-spring-in squish-press ${extraClass} w-full flex items-center gap-4 border p-4 text-left relative overflow-hidden ${
                state === 'answered' ? 'cursor-default' : 'cursor-pointer'
              }`}
              style={{
                borderColor: isHovered ? 'var(--color-accent)' : borderColor,
                background: bg,
                animationDelay: `${i * 0.06}s`,
                boxShadow: isHovered ? '0 0 20px rgba(232, 255, 71, 0.08)' : 'none',
              }}
            >
              {/* Ripple effects */}
              {ripples.map(r => (
                <span
                  key={r.id}
                  className="ripple-circle"
                  style={{ left: r.x, top: r.y }}
                />
              ))}

              <span
                className="text-xs w-6 text-center flex-shrink-0"
                style={{ fontFamily: 'var(--font-mono)', color: isHovered ? 'var(--color-accent)' : labelColor }}
              >
                <span className="uppercase">{CHOICE_LABELS[i]}</span>
                <span className="ml-0.5 opacity-40" style={{ fontSize: '0.6rem' }}>{CHOICE_KEYS[i]}</span>
              </span>
              <span className="text-base relative z-10">{choice}</span>
            </button>
          );
        })}
      </div>

      {/* Combo energy bar on right edge */}
      {combo >= 1 && state === 'question' && (
        <div
          className="fixed right-0 bottom-0 w-1 transition-all duration-500 ease-out"
          style={{
            height: `${Math.min(combo * 16, 80)}%`,
            background: `linear-gradient(to top, var(--color-accent), ${combo >= 4 ? 'var(--color-correct)' : 'var(--color-accent-dim)'})`,
            opacity: 0.4 + combo * 0.1,
          }}
        >
          {combo >= 3 && <div className="w-full h-full energy-bar-glow" style={{ background: 'inherit' }} />}
        </div>
      )}

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
            onClick={() => { setExiting(true); setTimeout(onNext, 300); }}
            className="w-full py-4 text-center tracking-wider uppercase transition-all cursor-pointer border-0 hover:tracking-[0.25em] squish-press"
            style={{
              fontFamily: 'var(--font-mono)',
              background: 'var(--color-accent)',
              color: 'var(--color-surface)',
              fontSize: '0.875rem',
            }}
          >
            Next <span className="opacity-40 text-xs ml-1">Enter</span>
            <span className="ml-3 opacity-30 animate-swipe-hint inline-block">←</span>
          </button>
        </div>
      )}
    </div>
  );
}
