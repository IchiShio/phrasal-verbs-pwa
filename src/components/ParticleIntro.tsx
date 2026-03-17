import type { Particle } from '../lib/types';

interface ParticleIntroProps {
  particle: Particle;
  verbCount: number;
  onStart: () => void;
}

function ParticleAnimation({ particleId }: { particleId: string }) {
  // Abstract geometric SVG animations per particle
  const animations: Record<string, React.ReactNode> = {
    up: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Rising bar */}
        <rect x="90" y="180" width="20" height="0" fill="var(--color-accent)" opacity="0.3">
          <animate attributeName="height" from="0" to="140" dur="1.5s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
          <animate attributeName="y" from="180" to="40" dur="1.5s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
        </rect>
        {/* Arrow */}
        <line x1="100" y1="180" x2="100" y2="40" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="140" strokeDashoffset="140">
          <animate attributeName="stroke-dashoffset" from="140" to="0" dur="1.2s" fill="freeze" begin="0.3s" calcMode="spline" keySplines="0.16 1 0.3 1" />
        </line>
        <polygon points="100,25 90,45 110,45" fill="var(--color-accent)" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="1.2s" />
        </polygon>
      </svg>
    ),
    out: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Expanding circles */}
        {[30, 50, 70, 90].map((r, i) => (
          <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0">
            <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="r" from="10" to={r} dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.16 1 0.3 1" />
          </circle>
        ))}
        <circle cx="100" cy="100" r="6" fill="var(--color-accent)" />
      </svg>
    ),
    off: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Line being cut */}
        <line x1="30" y1="100" x2="85" y2="100" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="55" strokeDashoffset="55">
          <animate attributeName="stroke-dashoffset" from="55" to="0" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
        </line>
        <line x1="115" y1="100" x2="170" y2="100" stroke="var(--color-accent)" strokeWidth="2" opacity="0.3" strokeDasharray="55" strokeDashoffset="55">
          <animate attributeName="stroke-dashoffset" from="55" to="0" dur="0.8s" fill="freeze" begin="0.5s" calcMode="spline" keySplines="0.16 1 0.3 1" />
          <animate attributeName="opacity" from="0.6" to="0.15" dur="1s" fill="freeze" begin="1s" />
        </line>
        {/* Gap indicator */}
        <rect x="88" y="92" width="24" height="16" fill="var(--color-surface)" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="1s" />
        </rect>
        <line x1="92" y1="92" x2="108" y2="108" stroke="var(--color-wrong)" strokeWidth="1.5" opacity="0">
          <animate attributeName="opacity" from="0" to="0.6" dur="0.3s" fill="freeze" begin="1.2s" />
        </line>
      </svg>
    ),
    down: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Descending line + arrow */}
        <line x1="100" y1="30" x2="100" y2="160" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="130" strokeDashoffset="130">
          <animate attributeName="stroke-dashoffset" from="130" to="0" dur="1.2s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
        </line>
        <polygon points="100,175 90,155 110,155" fill="var(--color-accent)" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="1s" />
        </polygon>
        {/* Settling line */}
        <line x1="50" y1="175" x2="150" y2="175" stroke="var(--color-accent)" strokeWidth="1" opacity="0">
          <animate attributeName="opacity" from="0" to="0.4" dur="0.5s" fill="freeze" begin="1.2s" />
        </line>
      </svg>
    ),
    on: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Continuous flowing dots */}
        {[0, 1, 2, 3, 4].map(i => (
          <circle key={i} cx="0" cy="100" r="4" fill="var(--color-accent)" opacity="0.6">
            <animate attributeName="cx" from="30" to="170" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.16 1 0.3 1" />
            <animate attributeName="opacity" values="0;0.8;0.8;0" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {/* Base line */}
        <line x1="30" y1="100" x2="170" y2="100" stroke="var(--color-accent)" strokeWidth="0.5" opacity="0.2" />
      </svg>
    ),
    away: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Object moving away and shrinking */}
        <rect x="80" y="85" width="30" height="30" fill="var(--color-accent)" opacity="0.8">
          <animate attributeName="x" from="80" to="200" dur="1.5s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
          <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" fill="freeze" />
          <animate attributeName="width" from="30" to="8" dur="1.5s" fill="freeze" />
          <animate attributeName="height" from="30" to="8" dur="1.5s" fill="freeze" />
        </rect>
        {/* Origin dot */}
        <circle cx="95" cy="100" r="3" fill="var(--color-accent)" opacity="0.3" />
        {/* Trail */}
        <line x1="95" y1="100" x2="170" y2="100" stroke="var(--color-accent)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.2" />
      </svg>
    ),
    into: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Arrow entering a box */}
        <rect x="80" y="60" width="80" height="80" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.3" />
        <circle cx="30" cy="100" r="6" fill="var(--color-accent)">
          <animate attributeName="cx" from="30" to="120" dur="1s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
        </circle>
        {/* Impact ring */}
        <circle cx="120" cy="100" r="0" fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0">
          <animate attributeName="r" from="0" to="25" dur="0.5s" fill="freeze" begin="0.8s" />
          <animate attributeName="opacity" from="0.5" to="0" dur="0.5s" fill="freeze" begin="0.8s" />
        </circle>
      </svg>
    ),
    through: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Arrow passing through a barrier */}
        <rect x="90" y="40" width="20" height="120" fill="var(--color-accent)" opacity="0.1" />
        <line x1="30" y1="100" x2="170" y2="100" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="140" strokeDashoffset="140">
          <animate attributeName="stroke-dashoffset" from="140" to="0" dur="1.5s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
        </line>
        <polygon points="175,100 160,93 160,107" fill="var(--color-accent)" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="1.3s" />
        </polygon>
      </svg>
    ),
    over: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Arc over obstacle */}
        <rect x="85" y="100" width="30" height="40" fill="var(--color-accent)" opacity="0.15" />
        <path d="M 40 140 Q 100 20 160 140" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray="200" strokeDashoffset="200">
          <animate attributeName="stroke-dashoffset" from="200" to="0" dur="1.5s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
        </path>
        <circle cx="40" cy="140" r="4" fill="var(--color-accent)" opacity="0.5" />
      </svg>
    ),
    back: (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Arrow going right then bouncing back */}
        <line x1="60" y1="100" x2="150" y2="100" stroke="var(--color-accent)" strokeWidth="1" opacity="0.2" strokeDasharray="90" strokeDashoffset="90">
          <animate attributeName="stroke-dashoffset" from="90" to="0" dur="0.6s" fill="freeze" />
        </line>
        <circle cx="60" cy="100" r="6" fill="var(--color-accent)">
          <animate attributeName="cx" values="60;150;60" dur="2s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1;0.16 1 0.3 1" />
        </circle>
        {/* Return arrow */}
        <polygon points="55,100 68,93 68,107" fill="var(--color-accent)" opacity="0">
          <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" begin="1.8s" />
        </polygon>
      </svg>
    ),
  };

  return (
    <div className="w-48 h-48 mx-auto">
      {animations[particleId] || animations.up}
    </div>
  );
}

export function ParticleIntro({ particle, verbCount, onStart }: ParticleIntroProps) {
  return (
    <div className="pt-4">
      {/* Particle name — huge */}
      <div className="opacity-0 animate-reveal text-center mb-6">
        <p
          className="text-[10px] uppercase tracking-[0.3em] mb-3"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
        >
          Particle
        </p>
        <h1
          className="text-7xl italic"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}
        >
          {particle.id}
        </h1>
        <p
          className="text-sm mt-2 italic"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-muted)' }}
        >
          {particle.core_meaning}
        </p>
      </div>

      {/* Animation */}
      <div className="opacity-0 animate-reveal stagger-1 mb-8">
        <ParticleAnimation particleId={particle.id} />
      </div>

      {/* Sense patterns */}
      <div className="opacity-0 animate-reveal stagger-2 mb-8">
        <div
          className="text-[10px] uppercase tracking-[0.2em] mb-4"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
        >
          Patterns
        </div>
        <div className="border" style={{ borderColor: 'var(--color-surface-border)' }}>
          {particle.senses.map((sense) => (
            <div
              key={sense.id}
              className="flex items-start gap-3 p-3 border-b last:border-b-0"
              style={{ borderColor: 'var(--color-surface-border)' }}
            >
              <span
                className="text-[10px] uppercase tracking-wider mt-0.5 flex-shrink-0 w-20"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}
              >
                {sense.label_en}
              </span>
              <div>
                <div className="text-sm" style={{ color: 'var(--color-text)' }}>
                  {sense.label}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-dim)' }}>
                  {sense.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start button */}
      <div className="opacity-0 animate-reveal stagger-3">
        <button
          onClick={onStart}
          className="group w-full cursor-pointer border-0 bg-transparent p-0"
        >
          <div
            className="w-full py-5 text-center text-sm tracking-wider uppercase transition-all duration-300 group-hover:tracking-[0.3em] group-active:scale-[0.98]"
            style={{
              fontFamily: 'var(--font-mono)',
              background: 'var(--color-accent)',
              color: 'var(--color-surface)',
            }}
          >
            Challenge — {verbCount}
          </div>
        </button>
      </div>
    </div>
  );
}
