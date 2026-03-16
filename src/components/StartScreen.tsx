interface StartScreenProps {
  newCount: number;
  reviewCount: number;
  onStart: () => void;
}

export function StartScreen({ newCount, reviewCount, onStart }: StartScreenProps) {
  const total = newCount + reviewCount;

  return (
    <div className="pt-8">
      {/* Big editorial heading */}
      <div className="opacity-0 animate-reveal mb-12">
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

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-10 opacity-0 animate-reveal stagger-2">
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
        <div className="opacity-0 animate-reveal stagger-3">
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
        <div className="opacity-0 animate-reveal stagger-3 text-center py-8">
          <div
            className="text-5xl italic mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Complete.
          </div>
          <p
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            明日また新しい句動詞が待っています
          </p>
        </div>
      )}
    </div>
  );
}
