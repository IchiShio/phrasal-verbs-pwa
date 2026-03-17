import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playPerfect } from '../lib/sound';

interface QuizResult {
  verb: string;
  meaning_ja: string;
  correct: boolean;
}

interface DailyCompleteProps {
  results: QuizResult[];
  sessionXP: number;
  streak: number;
  totalXP: number;
  maxCombo: number;
  onAnotherSet: () => void;
}

export function DailyComplete({ results, sessionXP, streak, totalXP, maxCombo, onAnotherSet }: DailyCompleteProps) {
  const correctCount = results.filter(r => r.correct).length;
  const accuracy = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;
  const isPerfect = correctCount === results.length && results.length > 0;

  useEffect(() => {
    if (isPerfect) {
      playPerfect();
      // Sustained confetti for perfect
      const end = Date.now() + 2000;
      const frame = () => {
        confetti({
          particleCount: 2,
          spread: 100,
          origin: { x: Math.random(), y: Math.random() * 0.3 },
          colors: ['#e8ff47', '#47ffb2', '#ff9f43', '#fff'],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [isPerfect]);

  const shareText = [
    `Phrasal Verbs Daily — Day ${streak}`,
    `${correctCount}/${results.length} correct (${accuracy}%)`,
    isPerfect ? 'PERFECT SESSION!' : '',
    maxCombo >= 3 ? `Max combo: x${maxCombo}` : '',
    `+${sessionXP} XP (total: ${totalXP})`,
    '',
    results.map(r => `${r.correct ? '○' : '×'} ${r.verb}`).join('\n'),
  ].filter(Boolean).join('\n');

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {}
  };

  return (
    <div className="pt-8">
      {/* Perfect banner */}
      {isPerfect && (
        <div className="opacity-0 animate-reveal mb-6 relative overflow-hidden p-6 text-center"
          style={{ border: '1px solid var(--color-accent)', background: 'rgba(232, 255, 71, 0.03)' }}
        >
          <span className="absolute top-2 left-4 text-lg animate-sparkle" style={{ color: 'var(--color-accent)' }}>*</span>
          <span className="absolute top-4 right-6 text-sm animate-sparkle animate-sparkle-delay" style={{ color: 'var(--color-correct)' }}>*</span>
          <span className="absolute bottom-3 left-8 text-xs animate-sparkle animate-sparkle-delay-2" style={{ color: 'var(--color-streak)' }}>*</span>
          <div
            className="text-xs uppercase tracking-[0.3em] mb-2"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
          >
            Perfect Session
          </div>
          <div
            className="text-3xl italic"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}
          >
            Flawless.
          </div>
        </div>
      )}

      {/* Heading */}
      <div className="opacity-0 animate-reveal mb-10">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-3"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
        >
          Session Complete
        </p>
        {!isPerfect && (
          <>
            <h1
              className="text-5xl italic leading-[1.1]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Well{' '}
              <span style={{ color: 'var(--color-accent)' }}>done.</span>
            </h1>
            <div className="w-12 h-[3px] mt-4" style={{ background: 'var(--color-accent)' }} />
          </>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-px mb-8 opacity-0 animate-reveal stagger-2" style={{ background: 'var(--color-surface-border)' }}>
        <div className="p-4 text-center" style={{ background: 'var(--color-surface-raised)' }}>
          <div
            className="text-2xl mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-correct)' }}
          >
            {correctCount}/{results.length}
          </div>
          <div
            className="text-[10px] uppercase tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
          >
            Score
          </div>
        </div>
        <div className="p-4 text-center" style={{ background: 'var(--color-surface-raised)' }}>
          <div
            className="text-2xl mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}
          >
            +{sessionXP}
          </div>
          <div
            className="text-[10px] uppercase tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
          >
            XP
          </div>
        </div>
        <div className="p-4 text-center" style={{ background: 'var(--color-surface-raised)' }}>
          <div
            className="text-2xl mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-streak)' }}
          >
            {streak}
          </div>
          <div
            className="text-[10px] uppercase tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
          >
            Streak
          </div>
        </div>
        <div className="p-4 text-center" style={{ background: 'var(--color-surface-raised)' }}>
          <div
            className="text-2xl mb-1"
            style={{ fontFamily: 'var(--font-display)', color: maxCombo >= 3 ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
          >
            x{maxCombo}
          </div>
          <div
            className="text-[10px] uppercase tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
          >
            Combo
          </div>
        </div>
      </div>

      {/* Verb results list */}
      <div className="opacity-0 animate-reveal stagger-3 mb-8">
        <div
          className="text-xs uppercase tracking-[0.2em] mb-4"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
        >
          Today's Verbs
        </div>
        <div className="border" style={{ borderColor: 'var(--color-surface-border)' }}>
          {results.map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0"
              style={{ borderColor: 'var(--color-surface-border)' }}
            >
              <span
                className="w-4 text-center text-xs"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: r.correct ? 'var(--color-correct)' : 'var(--color-wrong)',
                }}
              >
                {r.correct ? '○' : '×'}
              </span>
              <span className="font-medium text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                {r.verb}
              </span>
              <span className="text-xs ml-auto" style={{ color: 'var(--color-text-dim)' }}>
                {r.meaning_ja}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="opacity-0 animate-reveal stagger-4 space-y-3">
        {/* Another set button */}
        <button
          onClick={onAnotherSet}
          className="w-full py-4 text-center tracking-wider uppercase transition-all cursor-pointer border-0 hover:tracking-[0.25em] active:scale-[0.98]"
          style={{
            fontFamily: 'var(--font-mono)',
            background: 'var(--color-accent)',
            color: 'var(--color-surface)',
            fontSize: '0.875rem',
          }}
        >
          Particle Map
        </button>

        {/* Copy */}
        <button
          onClick={copyShare}
          className="w-full py-3 text-center text-xs uppercase tracking-[0.2em] transition-all cursor-pointer border hover:bg-[var(--color-surface-hover)] active:scale-[0.98]"
          style={{
            fontFamily: 'var(--font-mono)',
            borderColor: 'var(--color-surface-border)',
            background: 'var(--color-surface-raised)',
            color: 'var(--color-text-muted)',
          }}
        >
          Copy Results
        </button>

        <p
          className="text-center mt-3 text-sm italic"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-dim)' }}
        >
          See you tomorrow.
        </p>
      </div>
    </div>
  );
}
