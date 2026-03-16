interface StartScreenProps {
  newCount: number;
  reviewCount: number;
  streak: number;
  totalLearned: number;
  totalVerbs: number;
  onStart: () => void;
}

const STREAK_MILESTONES: Record<number, string> = {
  3: '3日連続！調子が出てきた',
  7: '1週間達成！習慣になってきた',
  14: '2週間！もう止まれない',
  30: '1ヶ月！あなたは本物だ',
  50: '50日！伝説の領域',
  100: '100日！語学マスターの証',
};

function getStreakMessage(streak: number): string | null {
  const milestones = Object.keys(STREAK_MILESTONES).map(Number).sort((a, b) => b - a);
  for (const m of milestones) {
    if (streak >= m) return STREAK_MILESTONES[m];
  }
  return null;
}

export function StartScreen({ newCount, reviewCount, streak, totalLearned, totalVerbs, onStart }: StartScreenProps) {
  const total = newCount + reviewCount;
  const masteryPct = totalVerbs > 0 ? Math.round((totalLearned / totalVerbs) * 100) : 0;
  const streakMsg = getStreakMessage(streak);

  // SVG ring
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (masteryPct / 100) * circumference;

  return (
    <div className="pt-8">
      {/* Editorial heading */}
      <div className="opacity-0 animate-reveal mb-8">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-4"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
        >
          Today's Session
        </p>
        <h1
          className="text-5xl leading-[1.1] mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="italic">Phrasal</span>{' '}
          <span style={{ color: 'var(--color-accent)' }}>Verbs</span>
        </h1>
        <div className="w-12 h-[3px] mt-4" style={{ background: 'var(--color-accent)' }} />
      </div>

      {/* Streak milestone */}
      {streakMsg && streak >= 3 && (
        <div
          className="opacity-0 animate-reveal stagger-1 mb-6 p-4 text-center animate-milestone"
          style={{
            border: '1px solid var(--color-streak)',
            background: 'rgba(255, 159, 67, 0.05)',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-lg">🔥</span>
            <span
              className="text-2xl"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-streak)' }}
            >
              {streak} days
            </span>
          </div>
          <p
            className="text-xs"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-streak)' }}
          >
            {streakMsg}
          </p>
        </div>
      )}

      {/* Mastery ring + Stats */}
      <div className="opacity-0 animate-reveal stagger-2 flex items-center gap-6 mb-8">
        {/* Progress ring */}
        <div className="flex-shrink-0 relative">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle
              cx="48" cy="48" r={radius}
              fill="none"
              stroke="var(--color-surface-border)"
              strokeWidth="3"
            />
            <circle
              cx="48" cy="48" r={radius}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="3"
              strokeLinecap="butt"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="animate-ring"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '48px 48px' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-lg"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}
            >
              {masteryPct}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1">
          <div className="mb-2">
            <span
              className="text-3xl"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
            >
              {totalLearned}
            </span>
            <span className="text-sm ml-1" style={{ color: 'var(--color-text-dim)' }}>/ {totalVerbs}</span>
          </div>
          <p
            className="text-xs uppercase tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
          >
            Verbs learned
          </p>
        </div>
      </div>

      {/* New / Review counts */}
      <div className="grid grid-cols-2 gap-3 mb-8 opacity-0 animate-reveal stagger-3">
        <div
          className="border p-5"
          style={{ borderColor: 'var(--color-surface-border)', background: 'var(--color-surface-raised)' }}
        >
          <div
            className="text-4xl font-light mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}
          >
            {newCount}
          </div>
          <div
            className="text-xs uppercase tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
          >
            New
          </div>
        </div>
        <div
          className="border p-5"
          style={{ borderColor: 'var(--color-surface-border)', background: 'var(--color-surface-raised)' }}
        >
          <div
            className="text-4xl font-light mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-streak)' }}
          >
            {reviewCount}
          </div>
          <div
            className="text-xs uppercase tracking-[0.15em]"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
          >
            Review
          </div>
        </div>
      </div>

      {/* Start button */}
      {total > 0 ? (
        <div className="opacity-0 animate-reveal stagger-4">
          <button
            onClick={onStart}
            className="group w-full relative cursor-pointer border-0 bg-transparent p-0"
          >
            <div
              className="w-full py-5 text-center text-lg tracking-wider uppercase transition-all duration-300 group-hover:tracking-[0.3em] group-active:scale-[0.98]"
              style={{
                fontFamily: 'var(--font-mono)',
                background: 'var(--color-accent)',
                color: 'var(--color-surface)',
              }}
            >
              Start — {total}
            </div>
          </button>
          <div
            className="text-center mt-4 text-xs italic"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-dim)' }}
          >
            毎日の積み重ねが力になる
          </div>
        </div>
      ) : (
        <div className="opacity-0 animate-reveal stagger-4 text-center py-8">
          <div
            className="text-5xl italic mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Complete.
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            明日また新しい句動詞が待っています
          </p>
        </div>
      )}
    </div>
  );
}
