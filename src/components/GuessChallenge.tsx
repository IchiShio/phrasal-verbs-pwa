import { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type { QuizItem, Particle } from '../lib/types';
import { useTilt, useRipple, useSwipe, useInteractiveConfetti } from '../hooks/useInteractive';

interface GuessChallengeProps {
  item: QuizItem;
  particle: Particle;
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

export function GuessChallenge({
  item, particle, index, total, selectedChoice, isCorrect, xpGained, combo,
  state, onAnswer, onNext,
}: GuessChallengeProps) {
  const [showXP, setShowXP] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  const tilt = useTilt(4);
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

  useEffect(() => { setExiting(false); setShowExplain(false); }, [item.verb.id]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (state === 'question') {
        const idx = CHOICE_KEYS.indexOf(e.key);
        if (idx !== -1 && idx < choices.length) onAnswer(idx, choices);
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
      confetti({ particleCount: 40 + combo * 15, spread: 50 + combo * 10, origin: { y: 0.65 }, colors: ['#e8ff47', '#47ffb2', '#ff9f43'] });
      setShowXP(true);
      const t = setTimeout(() => setShowXP(false), 1000);
      return () => clearTimeout(t);
    }
  }, [state, isCorrect, combo]);

  // Show explain after answer
  useEffect(() => {
    if (state === 'answered') {
      const t = setTimeout(() => setShowExplain(true), 400);
      return () => clearTimeout(t);
    }
  }, [state]);

  const correctIdx = choices.indexOf(item.verb.choices[0]);

  // Blank the phrasal verb in the scene
  const blankedScene = useMemo(() => {
    const verb = item.verb.verb;
    const regex = new RegExp(verb.replace(/\s+/g, '\\s+'), 'gi');
    return item.verb.scene.replace(regex, '___');
  }, [item.verb]);

  // Find the sense label
  const senseInfo = particle.senses.find(s => s.id === item.verb.sense);

  return (
    <div className={exiting ? 'animate-card-exit' : 'animate-fade-scale'}>
      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}>
          {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-3">
          {combo >= 2 && state === 'question' && (
            <span className="text-xs tracking-wider" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
              x{combo}
            </span>
          )}
          {item.isReview && (
            <span className="text-xs uppercase tracking-[0.15em] px-2 py-0.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-streak)', border: '1px solid var(--color-streak)' }}>
              Review
            </span>
          )}
        </div>
      </div>

      <div className="h-px mb-6" style={{ background: 'var(--color-surface-border)' }}>
        <div className="h-px transition-all duration-500" style={{ width: `${((index + 1) / total) * 100}%`, background: 'var(--color-accent)' }} />
      </div>

      {/* Scene (the story with blanked verb) */}
      <div
        ref={tilt.ref}
        className="relative mb-5 p-5 border-l-[3px]"
        style={{
          ...tilt.style,
          borderColor: 'var(--color-accent)',
          background: 'var(--color-surface-raised)',
        }}
      >
        <p className="text-lg leading-[1.8]" style={{ color: 'var(--color-text)' }}>
          {blankedScene}
        </p>
        {showXP && xpGained > 0 && (
          <div className="absolute top-3 right-3 animate-xp-float" style={{ fontFamily: 'var(--font-mono)' }}>
            <span className="text-lg font-bold" style={{ color: 'var(--color-correct)' }}>+{xpGained}</span>
            {combo > 1 && <span className="text-xs ml-1" style={{ color: 'var(--color-accent)' }}>x{combo}</span>}
          </div>
        )}
      </div>

      {/* Verb + particle hint — more inviting layout */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-3xl italic" style={{ fontFamily: 'var(--font-display)' }}>
            {item.verb.verb}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--color-accent)' }}>
            {particle.id.toUpperCase()}
          </span>
          <span className="text-sm" style={{ color: 'var(--color-text-dim)' }}>
            → {senseInfo?.label || particle.core_meaning_ja}
          </span>
        </div>
      </div>

      {/* 4 choices */}
      <div className="space-y-3 mb-6">
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

          return (
            <button
              key={i}
              onClick={(e) => { if (state !== 'question') return; addRipple(e); onAnswer(i, choices); }}
              disabled={state === 'answered'}
              className={`animate-spring-in squish-press ${extraClass} w-full flex items-center gap-4 border p-4 text-left relative overflow-hidden ${state === 'answered' ? 'cursor-default' : 'cursor-pointer'}`}
              style={{ borderColor, background: bg, animationDelay: `${i * 0.06}s` }}
            >
              {ripples.map(r => <span key={r.id} className="ripple-circle" style={{ left: r.x, top: r.y }} />)}
              <span className="text-xs w-6 text-center flex-shrink-0" style={{ fontFamily: 'var(--font-mono)', color: labelColor }}>
                <span className="uppercase">{CHOICE_LABELS[i]}</span>
                <span className="ml-0.5 opacity-40" style={{ fontSize: '0.6rem' }}>{CHOICE_KEYS[i]}</span>
              </span>
              <span className="text-lg relative z-10">{choice}</span>
            </button>
          );
        })}
      </div>

      {/* Particle explanation (post-answer) */}
      {state === 'answered' && showExplain && (
        <div className="animate-reveal mb-6 p-5 border-t-2" style={{ borderColor: 'var(--color-accent)', background: 'var(--color-surface-raised)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
              {particle.id.toUpperCase()}
            </span>
            {senseInfo && (
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                → {senseInfo.label}
              </span>
            )}
          </div>
          <p className="text-base leading-relaxed mb-3" style={{ color: 'var(--color-text)' }}>
            {item.verb.particle_explain}
          </p>
          {/* Scene translation — prominent */}
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            {item.verb.scene_ja}
          </p>
        </div>
      )}

      {/* Feedback + Next */}
      {state === 'answered' && (
        <div className={showExplain ? '' : 'animate-reveal'}>
          <div className="text-center mb-4 text-sm uppercase tracking-[0.15em]" style={{
            fontFamily: 'var(--font-mono)',
            color: isCorrect ? 'var(--color-correct)' : 'var(--color-wrong)',
          }}>
            {isCorrect ? '正解！' : `不正解 — ${item.verb.choices[0]}`}
          </div>
          <button
            onClick={() => { setExiting(true); setTimeout(onNext, 300); }}
            className="w-full py-4 text-center tracking-wider uppercase transition-all cursor-pointer border-0 hover:tracking-[0.25em] squish-press"
            style={{ fontFamily: 'var(--font-mono)', background: 'var(--color-accent)', color: 'var(--color-surface)', fontSize: '0.875rem' }}
          >
            Next <span className="opacity-40 text-xs ml-1">Enter</span>
            <span className="ml-3 opacity-30 animate-swipe-hint inline-block">←</span>
          </button>
        </div>
      )}

      {/* Combo energy bar */}
      {combo >= 1 && state === 'question' && (
        <div className="fixed right-0 bottom-0 w-1 transition-all duration-500" style={{
          height: `${Math.min(combo * 16, 80)}%`,
          background: `linear-gradient(to top, var(--color-accent), ${combo >= 4 ? 'var(--color-correct)' : 'var(--color-accent-dim)'})`,
          opacity: 0.4 + combo * 0.1,
        }} />
      )}
    </div>
  );
}
