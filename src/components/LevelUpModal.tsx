import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
  levelName: string;
  onDismiss: () => void;
}

export function LevelUpModal({ levelName, onDismiss }: LevelUpModalProps) {
  useEffect(() => {
    // Big confetti burst
    const end = Date.now() + 1500;
    const frame = () => {
      confetti({
        particleCount: 3,
        spread: 55,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: ['#e8ff47', '#47ffb2', '#ff9f43', '#fff'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-6 animate-level-bg"
      style={{ background: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onDismiss}
    >
      <div
        className="animate-level-enter text-center max-w-sm w-full p-10"
        style={{ background: 'var(--color-surface-raised)', border: '1px solid var(--color-accent)' }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="text-xs uppercase tracking-[0.3em] mb-4"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
        >
          Level Up
        </div>

        <h2
          className="text-5xl italic mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          {levelName}
        </h2>

        <div className="w-16 h-[3px] mx-auto my-6" style={{ background: 'var(--color-accent)' }} />

        <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
          新しいレベルに到達しました
        </p>

        <button
          onClick={onDismiss}
          className="w-full py-3 text-xs uppercase tracking-[0.2em] cursor-pointer border-0 transition-all hover:tracking-[0.3em] active:scale-[0.98]"
          style={{
            fontFamily: 'var(--font-mono)',
            background: 'var(--color-accent)',
            color: 'var(--color-surface)',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
