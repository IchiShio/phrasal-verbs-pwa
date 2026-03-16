import { getLevelInfo } from '../lib/types';

interface HeaderProps {
  streak: number;
  totalXP: number;
}

export function Header({ streak, totalXP }: HeaderProps) {
  const { level, nextLevel, progress, levelIndex } = getLevelInfo(totalXP);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)]/95 backdrop-blur-md border-b border-[var(--color-surface-border)]">
      <div className="max-w-lg mx-auto flex items-center justify-between px-5 py-3">
        {/* Streak */}
        <div className="flex items-center gap-2">
          <span
            className="text-lg inline-block"
            style={{ animation: streak > 1 ? 'streak-flame 1.5s ease-in-out infinite' : 'none' }}
          >
            🔥
          </span>
          <span
            className="font-mono text-lg tracking-tight"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-streak)' }}
          >
            {streak}
          </span>
        </div>

        {/* Level */}
        <div className="flex-1 mx-5">
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-xs uppercase tracking-[0.15em]"
              style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              Lv.{levelIndex + 1}
            </span>
            <span
              className="text-xs italic"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-muted)' }}
            >
              {level.name}
              {nextLevel && <span style={{ color: 'var(--color-text-dim)' }}> → {nextLevel.name}</span>}
            </span>
          </div>
          <div className="h-[3px] bg-[var(--color-surface-border)] overflow-hidden">
            <div
              className="h-full transition-all duration-700 ease-out"
              style={{
                width: `${progress * 100}%`,
                background: 'var(--color-accent)',
              }}
            />
          </div>
        </div>

        {/* XP */}
        <div
          className="text-xs tracking-wider"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent-dim)' }}
        >
          {totalXP}<span style={{ color: 'var(--color-text-dim)' }}>xp</span>
        </div>
      </div>
    </header>
  );
}
