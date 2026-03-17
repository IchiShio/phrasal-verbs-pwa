import type { Particle, ParticleProgress } from '../lib/types';

interface ParticleMapProps {
  particles: Particle[];
  progressMap: Map<string, ParticleProgress>;
  recommendedId: string;
  streak: number;
  onSelect: (id: string) => void;
}

export function ParticleMap({ particles, progressMap, recommendedId, streak, onSelect }: ParticleMapProps) {
  const totalLearned = Array.from(progressMap.values()).reduce((s, p) => s + p.learnedVerbs, 0);
  const totalVerbs = Array.from(progressMap.values()).reduce((s, p) => s + p.totalVerbs, 0);

  return (
    <div className="pt-6">
      {/* Header */}
      <div className="opacity-0 animate-reveal mb-8">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-3"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
        >
          {totalLearned}/{totalVerbs} verbs · {streak > 0 ? `🔥 ${streak}d` : ''}
        </p>
        <h1
          className="text-5xl leading-[1.05]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="italic">Particle</span>{' '}
          <span style={{ color: 'var(--color-accent)' }}>Map</span>
        </h1>
        <div className="w-12 h-[3px] mt-4" style={{ background: 'var(--color-accent)' }} />
      </div>

      {/* Recommended */}
      {recommendedId && (
        <div className="opacity-0 animate-reveal stagger-1 mb-6">
          <button
            onClick={() => onSelect(recommendedId)}
            className="w-full text-left p-5 border cursor-pointer transition-all hover:border-[var(--color-accent)] active:scale-[0.98] group"
            style={{
              borderColor: 'var(--color-accent)',
              background: 'rgba(232, 255, 71, 0.03)',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[10px] uppercase tracking-[0.25em]"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
              >
                Today's Particle
              </span>
              <span
                className="text-xs"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
              >
                →
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span
                className="text-4xl italic group-hover:tracking-wider transition-all"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}
              >
                {recommendedId.toUpperCase()}
              </span>
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {particles.find(p => p.id === recommendedId)?.core_meaning_ja}
              </span>
            </div>
            {(() => {
              const prog = progressMap.get(recommendedId);
              if (!prog) return null;
              const pct = prog.totalVerbs > 0 ? (prog.learnedVerbs / prog.totalVerbs) * 100 : 0;
              return (
                <div className="mt-3">
                  <div className="h-px" style={{ background: 'var(--color-surface-border)' }}>
                    <div className="h-px" style={{ width: `${pct}%`, background: 'var(--color-accent)' }} />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}>
                      {prog.learnedVerbs}/{prog.totalVerbs}
                    </span>
                    {prog.reviewDue > 0 && (
                      <span className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-streak)' }}>
                        {prog.reviewDue} review
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}
          </button>
        </div>
      )}

      {/* Particle grid */}
      <div className="opacity-0 animate-reveal stagger-2">
        <div className="grid grid-cols-2 gap-px" style={{ background: 'var(--color-surface-border)' }}>
          {particles.map((particle) => {
            const prog = progressMap.get(particle.id);
            const pct = prog && prog.totalVerbs > 0 ? (prog.learnedVerbs / prog.totalVerbs) * 100 : 0;
            const isRecommended = particle.id === recommendedId;

            return (
              <button
                key={particle.id}
                onClick={() => onSelect(particle.id)}
                className="text-left p-4 cursor-pointer transition-all hover:bg-[var(--color-surface-hover)] active:scale-[0.98] group"
                style={{ background: 'var(--color-surface-raised)' }}
              >
                <div
                  className="text-2xl italic mb-1 group-hover:tracking-wider transition-all"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: isRecommended ? 'var(--color-accent)' : 'var(--color-text)',
                  }}
                >
                  {particle.id}
                </div>
                <div
                  className="text-[10px] mb-3 leading-tight"
                  style={{ color: 'var(--color-text-dim)' }}
                >
                  {particle.core_meaning_ja}
                </div>
                {/* Progress line */}
                <div className="h-px" style={{ background: 'var(--color-surface-border)' }}>
                  <div
                    className="h-px transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: pct >= 100 ? 'var(--color-correct)' : 'var(--color-accent)',
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}>
                    {prog ? `${prog.learnedVerbs}/${prog.totalVerbs}` : '0'}
                  </span>
                  {prog && prog.reviewDue > 0 && (
                    <span className="text-[9px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-streak)' }}>
                      {prog.reviewDue}↻
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
