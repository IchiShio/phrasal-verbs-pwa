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
}

export function DailyComplete({ results, sessionXP, streak, totalXP }: DailyCompleteProps) {
  const correctCount = results.filter(r => r.correct).length;
  const accuracy = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

  const shareText = [
    `Phrasal Verbs Daily — Day ${streak}`,
    `${correctCount}/${results.length} correct (${accuracy}%)`,
    `+${sessionXP} XP (total: ${totalXP})`,
    '',
    results.map(r => `${r.correct ? '○' : '×'} ${r.verb}`).join('\n'),
  ].join('\n');

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {}
  };

  return (
    <div className="pt-8">
      {/* Editorial completion heading */}
      <div className="opacity-0 animate-reveal mb-10">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-3"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
        >
          Session Complete
        </p>
        <h1
          className="text-5xl italic leading-[1.1]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Well{' '}
          <span style={{ color: 'var(--color-accent)' }}>done.</span>
        </h1>
        <div className="w-12 h-[3px] mt-4" style={{ background: 'var(--color-accent)' }} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-px mb-8 opacity-0 animate-reveal stagger-2" style={{ background: 'var(--color-surface-border)' }}>
        <div className="p-4 text-center" style={{ background: 'var(--color-surface-raised)' }}>
          <div
            className="text-2xl mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-correct)' }}
          >
            {correctCount}/{results.length}
          </div>
          <div
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
          >
            Correct
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
            className="text-[10px] uppercase tracking-[0.2em]"
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
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
          >
            Streak
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

      {/* Copy button */}
      <div className="opacity-0 animate-reveal stagger-4">
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
          className="text-center mt-5 text-sm italic"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-dim)' }}
        >
          See you tomorrow.
        </p>
      </div>
    </div>
  );
}
