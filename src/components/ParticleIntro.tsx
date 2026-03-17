import type { Particle } from '../lib/types';

interface ParticleIntroProps {
  particle: Particle;
  verbCount: number;
  onStart: () => void;
}

/**
 * Each particle gets a visual MICRO-STORY animation.
 * No text needed — the motion itself conveys the meaning.
 */
function ParticleAnimation({ particleId }: { particleId: string }) {
  const S = 'var(--color-accent)';
  const D = 'var(--color-text-dim)';

  const animations: Record<string, React.ReactNode> = {
    // UP: A glass filling with liquid, then a plant sprouting above it
    up: (
      <svg viewBox="0 0 240 240" className="w-full h-full">
        {/* Glass outline */}
        <path d="M 80 60 L 80 180 L 160 180 L 160 60" fill="none" stroke={D} strokeWidth="2" opacity="0.3" />
        {/* Liquid filling up */}
        <rect x="82" y="180" width="76" height="0" fill={S} opacity="0.25">
          <animate attributeName="height" from="0" to="118" dur="2s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
          <animate attributeName="y" from="180" to="62" dur="2s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
        </rect>
        {/* Bubbles rising inside */}
        {[95, 120, 140].map((x, i) => (
          <circle key={i} cx={x} cy="170" r="3" fill={S} opacity="0">
            <animate attributeName="cy" from="170" to="70" dur="1.8s" begin={`${0.5 + i * 0.4}s`} fill="freeze" />
            <animate attributeName="opacity" values="0;0.5;0" dur="1.8s" begin={`${0.5 + i * 0.4}s`} fill="freeze" />
          </circle>
        ))}
        {/* Overflow splash */}
        <circle cx="100" cy="58" r="0" fill={S} opacity="0">
          <animate attributeName="r" from="0" to="4" dur="0.3s" begin="2.2s" fill="freeze" />
          <animate attributeName="cy" from="58" to="40" dur="0.5s" begin="2.2s" fill="freeze" />
          <animate attributeName="opacity" values="0;0.6;0" dur="0.7s" begin="2.2s" fill="freeze" />
        </circle>
        <circle cx="135" cy="58" r="0" fill={S} opacity="0">
          <animate attributeName="r" from="0" to="3" dur="0.3s" begin="2.4s" fill="freeze" />
          <animate attributeName="cy" from="58" to="35" dur="0.5s" begin="2.4s" fill="freeze" />
          <animate attributeName="opacity" values="0;0.5;0" dur="0.7s" begin="2.4s" fill="freeze" />
        </circle>
      </svg>
    ),

    // OUT: A closed box opens, light rays burst out
    out: (
      <svg viewBox="0 0 240 240" className="w-full h-full">
        {/* Box */}
        <rect x="80" y="90" width="80" height="70" fill="none" stroke={D} strokeWidth="2" opacity="0.4" />
        {/* Lid opening */}
        <line x1="80" y1="90" x2="120" y2="90" stroke={S} strokeWidth="2">
          <animate attributeName="x2" values="120;120;80" dur="1.5s" fill="freeze" keyTimes="0;0.5;1" />
          <animate attributeName="y2" values="90;90;50" dur="1.5s" fill="freeze" keyTimes="0;0.5;1" />
        </line>
        <line x1="120" y1="90" x2="160" y2="90" stroke={S} strokeWidth="2">
          <animate attributeName="x1" values="120;120;160" dur="1.5s" fill="freeze" keyTimes="0;0.5;1" />
          <animate attributeName="y1" values="90;90;50" dur="1.5s" fill="freeze" keyTimes="0;0.5;1" />
        </line>
        {/* Light rays bursting out */}
        {[
          { x1: 120, y1: 85, x2: 120, y2: 30, d: 0 },
          { x1: 120, y1: 85, x2: 70, y2: 45, d: 0.1 },
          { x1: 120, y1: 85, x2: 170, y2: 45, d: 0.15 },
          { x1: 120, y1: 85, x2: 50, y2: 70, d: 0.2 },
          { x1: 120, y1: 85, x2: 190, y2: 70, d: 0.25 },
        ].map((ray, i) => (
          <line key={i} x1={ray.x1} y1={ray.y1} x2={ray.x1} y2={ray.y1} stroke={S} strokeWidth="1.5" opacity="0" strokeLinecap="round">
            <animate attributeName="x2" from={ray.x1} to={ray.x2} dur="0.5s" begin={`${1.2 + ray.d}s`} fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
            <animate attributeName="y2" from={ray.y1} to={ray.y2} dur="0.5s" begin={`${1.2 + ray.d}s`} fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
            <animate attributeName="opacity" values="0;0.7;0.3" dur="0.8s" begin={`${1.2 + ray.d}s`} fill="freeze" />
          </line>
        ))}
        {/* Glow */}
        <circle cx="120" cy="90" r="0" fill={S} opacity="0">
          <animate attributeName="r" from="0" to="20" dur="0.6s" begin="1.2s" fill="freeze" />
          <animate attributeName="opacity" values="0;0.15;0.05" dur="1s" begin="1.2s" fill="freeze" />
        </circle>
      </svg>
    ),

    // OFF: A plug being pulled from a socket
    off: (
      <svg viewBox="0 0 240 240" className="w-full h-full">
        {/* Socket (wall plate) */}
        <rect x="130" y="80" width="50" height="80" rx="5" fill="none" stroke={D} strokeWidth="2" opacity="0.4" />
        <circle cx="145" cy="110" r="5" fill="none" stroke={D} strokeWidth="1.5" opacity="0.3" />
        <circle cx="165" cy="110" r="5" fill="none" stroke={D} strokeWidth="1.5" opacity="0.3" />
        {/* Plug (moves away) */}
        <g>
          <rect x="90" y="95" width="40" height="50" rx="4" fill={S} opacity="0.3">
            <animate attributeName="x" values="90;90;30" dur="2s" fill="freeze" keyTimes="0;0.4;1" calcMode="spline" keySplines="0.16 1 0.3 1;0.16 1 0.3 1" />
            <animate attributeName="opacity" values="0.3;0.3;0.15" dur="2s" fill="freeze" keyTimes="0;0.4;1" />
          </rect>
          {/* Prongs */}
          <line x1="115" y1="108" x2="130" y2="108" stroke={S} strokeWidth="3" strokeLinecap="round">
            <animate attributeName="x1" values="115;115;55" dur="2s" fill="freeze" keyTimes="0;0.4;1" calcMode="spline" keySplines="0.16 1 0.3 1;0.16 1 0.3 1" />
            <animate attributeName="x2" values="130;130;70" dur="2s" fill="freeze" keyTimes="0;0.4;1" calcMode="spline" keySplines="0.16 1 0.3 1;0.16 1 0.3 1" />
          </line>
          <line x1="115" y1="132" x2="130" y2="132" stroke={S} strokeWidth="3" strokeLinecap="round">
            <animate attributeName="x1" values="115;115;55" dur="2s" fill="freeze" keyTimes="0;0.4;1" calcMode="spline" keySplines="0.16 1 0.3 1;0.16 1 0.3 1" />
            <animate attributeName="x2" values="130;130;70" dur="2s" fill="freeze" keyTimes="0;0.4;1" calcMode="spline" keySplines="0.16 1 0.3 1;0.16 1 0.3 1" />
          </line>
        </g>
        {/* Spark when disconnecting */}
        <circle cx="130" cy="120" r="0" fill={S} opacity="0">
          <animate attributeName="r" values="0;8;0" dur="0.3s" begin="0.8s" fill="freeze" />
          <animate attributeName="opacity" values="0;0.8;0" dur="0.3s" begin="0.8s" fill="freeze" />
        </circle>
      </svg>
    ),

    // DOWN: Rain drops falling, pooling at bottom
    down: (
      <svg viewBox="0 0 240 240" className="w-full h-full">
        {/* Rain drops */}
        {[
          { x: 80, d: 0 }, { x: 110, d: 0.3 }, { x: 140, d: 0.15 },
          { x: 95, d: 0.6 }, { x: 155, d: 0.45 }, { x: 125, d: 0.75 },
        ].map((drop, i) => (
          <g key={i}>
            <line x1={drop.x} y1="30" x2={drop.x} y2="45" stroke={S} strokeWidth="2" strokeLinecap="round" opacity="0">
              <animate attributeName="opacity" values="0;0.5;0" dur="1s" begin={`${drop.d}s`} repeatCount="3" />
              <animate attributeName="y1" from="30" to="170" dur="1s" begin={`${drop.d}s`} repeatCount="3" calcMode="spline" keySplines="0.4 0 1 1" />
              <animate attributeName="y2" from="45" to="185" dur="1s" begin={`${drop.d}s`} repeatCount="3" calcMode="spline" keySplines="0.4 0 1 1" />
            </line>
          </g>
        ))}
        {/* Pool forming at bottom */}
        <ellipse cx="120" cy="190" rx="0" ry="0" fill={S} opacity="0.2">
          <animate attributeName="rx" from="0" to="60" dur="2.5s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
          <animate attributeName="ry" from="0" to="8" dur="2.5s" fill="freeze" />
        </ellipse>
        {/* Ground line */}
        <line x1="40" y1="195" x2="200" y2="195" stroke={D} strokeWidth="1" opacity="0.2" />
      </svg>
    ),

    // ON: A light switch flipping, light staying on
    on: (
      <svg viewBox="0 0 240 240" className="w-full h-full">
        {/* Switch plate */}
        <rect x="95" y="70" width="50" height="100" rx="6" fill="none" stroke={D} strokeWidth="2" opacity="0.3" />
        {/* Switch toggle */}
        <rect x="105" y="110" width="30" height="25" rx="3" fill={S} opacity="0.4">
          <animate attributeName="y" values="110;80" dur="0.4s" begin="0.8s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
          <animate attributeName="opacity" values="0.4;0.8" dur="0.4s" begin="0.8s" fill="freeze" />
        </rect>
        {/* Glow radiating (light on) */}
        <circle cx="120" cy="120" r="0" fill={S} opacity="0">
          <animate attributeName="r" from="0" to="80" dur="1s" begin="1s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
          <animate attributeName="opacity" values="0;0.08;0.04" dur="1.5s" begin="1s" fill="freeze" />
        </circle>
        {/* Continuous pulse to show "stays on" */}
        <circle cx="120" cy="120" r="40" fill="none" stroke={S} strokeWidth="1" opacity="0">
          <animate attributeName="opacity" values="0;0.2;0" dur="2s" begin="1.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="40;60" dur="2s" begin="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),

    // AWAY: A person waving goodbye, shrinking into distance
    away: (
      <svg viewBox="0 0 240 240" className="w-full h-full">
        {/* Perspective lines (road) */}
        <line x1="60" y1="200" x2="120" y2="80" stroke={D} strokeWidth="1" opacity="0.15" />
        <line x1="180" y1="200" x2="120" y2="80" stroke={D} strokeWidth="1" opacity="0.15" />
        {/* Figure walking away (circle = head, line = body) */}
        <g>
          <circle cx="120" cy="140" r="8" fill={S} opacity="0.6">
            <animate attributeName="cy" from="140" to="90" dur="2.5s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
            <animate attributeName="r" from="8" to="3" dur="2.5s" fill="freeze" />
            <animate attributeName="opacity" from="0.6" to="0.1" dur="2.5s" fill="freeze" />
          </circle>
          <line x1="120" y1="148" x2="120" y2="175" stroke={S} strokeWidth="2" opacity="0.5" strokeLinecap="round">
            <animate attributeName="y1" from="148" to="93" dur="2.5s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
            <animate attributeName="y2" from="175" to="105" dur="2.5s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
            <animate attributeName="opacity" from="0.5" to="0.05" dur="2.5s" fill="freeze" />
          </line>
        </g>
        {/* Waving hand (small arc near head) */}
        <path d="M 128 135 Q 138 125 133 115" fill="none" stroke={S} strokeWidth="1.5" strokeLinecap="round" opacity="0">
          <animate attributeName="opacity" values="0;0.5;0.5;0" dur="2.5s" fill="freeze" keyTimes="0;0.1;0.6;1" />
        </path>
        {/* Footprints left behind */}
        {[170, 160, 150].map((y, i) => (
          <ellipse key={i} cx={118 + (i % 2 ? 5 : -5)} cy={y} rx="3" ry="1.5" fill={S} opacity="0">
            <animate attributeName="opacity" values="0;0.2;0.1" dur="2s" begin={`${i * 0.3}s`} fill="freeze" />
          </ellipse>
        ))}
      </svg>
    ),

    // INTO: A key going into a lock, door opening
    into: (
      <svg viewBox="0 0 240 240" className="w-full h-full">
        {/* Door frame */}
        <rect x="110" y="50" width="70" height="150" fill="none" stroke={D} strokeWidth="2" opacity="0.3" />
        {/* Keyhole */}
        <circle cx="170" cy="125" r="6" fill="none" stroke={D} strokeWidth="1.5" opacity="0.4" />
        <line x1="170" y1="131" x2="170" y2="140" stroke={D} strokeWidth="1.5" opacity="0.4" />
        {/* Key moving toward lock */}
        <g>
          <circle cx="60" cy="125" r="4" fill={S} opacity="0.6">
            <animate attributeName="cx" values="60;60;160" dur="1.5s" fill="freeze" keyTimes="0;0.3;1" calcMode="spline" keySplines="0.16 1 0.3 1;0.16 1 0.3 1" />
          </circle>
          <line x1="60" y1="125" x2="40" y2="125" stroke={S} strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
            <animate attributeName="x1" values="60;60;160" dur="1.5s" fill="freeze" keyTimes="0;0.3;1" calcMode="spline" keySplines="0.16 1 0.3 1;0.16 1 0.3 1" />
            <animate attributeName="x2" values="40;40;140" dur="1.5s" fill="freeze" keyTimes="0;0.3;1" calcMode="spline" keySplines="0.16 1 0.3 1;0.16 1 0.3 1" />
          </line>
        </g>
        {/* Door swinging open after key enters */}
        <line x1="110" y1="50" x2="110" y2="200" stroke={S} strokeWidth="2" opacity="0">
          <animate attributeName="opacity" from="0" to="0.4" dur="0.3s" begin="1.6s" fill="freeze" />
          <animate attributeName="x2" from="110" to="80" dur="0.5s" begin="1.6s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
        </line>
      </svg>
    ),

    // THROUGH: Arrow hitting wall, pushing through, emerging other side
    through: (
      <svg viewBox="0 0 240 240" className="w-full h-full">
        {/* Wall */}
        <rect x="105" y="50" width="30" height="140" fill={D} opacity="0.15" />
        <line x1="105" y1="50" x2="105" y2="190" stroke={D} strokeWidth="2" opacity="0.3" />
        <line x1="135" y1="50" x2="135" y2="190" stroke={D} strokeWidth="2" opacity="0.3" />
        {/* Arrow: approach → impact → pierce through */}
        <circle cx="40" cy="120" r="6" fill={S} opacity="0.6">
          <animate attributeName="cx" values="40;100;120;200" dur="2.5s" fill="freeze" keyTimes="0;0.35;0.55;1" calcMode="spline" keySplines="0.4 0 1 1;0.16 1 0.3 1;0.16 1 0.3 1" />
        </circle>
        {/* Impact cracks in wall */}
        {[
          { x1: 105, y1: 120, x2: 95, y2: 108 },
          { x1: 105, y1: 120, x2: 92, y2: 130 },
          { x1: 105, y1: 120, x2: 98, y2: 118 },
        ].map((crack, i) => (
          <line key={i} x1={crack.x1} y1={crack.y1} x2={crack.x1} y2={crack.y1} stroke={S} strokeWidth="1" opacity="0">
            <animate attributeName="x2" from={crack.x1} to={crack.x2} dur="0.2s" begin="0.85s" fill="freeze" />
            <animate attributeName="y2" from={crack.y1} to={crack.y2} dur="0.2s" begin="0.85s" fill="freeze" />
            <animate attributeName="opacity" values="0;0.5;0.2" dur="0.5s" begin="0.85s" fill="freeze" />
          </line>
        ))}
        {/* Trail after emerging */}
        <line x1="140" y1="120" x2="140" y2="120" stroke={S} strokeWidth="1" opacity="0" strokeDasharray="3,4">
          <animate attributeName="x2" from="140" to="195" dur="0.8s" begin="1.5s" fill="freeze" />
          <animate attributeName="opacity" values="0;0.3" dur="0.3s" begin="1.5s" fill="freeze" />
        </line>
      </svg>
    ),

    // OVER: A ball bouncing over a wall
    over: (
      <svg viewBox="0 0 240 240" className="w-full h-full">
        {/* Wall/obstacle */}
        <rect x="105" y="100" width="30" height="90" fill={D} opacity="0.15" />
        <line x1="105" y1="100" x2="135" y2="100" stroke={D} strokeWidth="2" opacity="0.3" />
        <line x1="105" y1="100" x2="105" y2="190" stroke={D} strokeWidth="1" opacity="0.2" />
        <line x1="135" y1="100" x2="135" y2="190" stroke={D} strokeWidth="1" opacity="0.2" />
        {/* Ground */}
        <line x1="30" y1="190" x2="210" y2="190" stroke={D} strokeWidth="1" opacity="0.2" />
        {/* Ball arc */}
        <circle cx="50" cy="180" r="8" fill={S} opacity="0.5">
          <animate attributeName="cx" values="50;120;190" dur="2s" fill="freeze" calcMode="linear" />
          <animate attributeName="cy" values="180;50;180" dur="2s" fill="freeze" calcMode="spline" keySplines="0.33 0 0.67 1;0.33 0 0.67 1" />
        </circle>
        {/* Arc trail */}
        <path d="M 50 180 Q 120 10 190 180" fill="none" stroke={S} strokeWidth="1" strokeDasharray="200" strokeDashoffset="200" opacity="0.2">
          <animate attributeName="stroke-dashoffset" from="200" to="0" dur="2s" fill="freeze" />
        </path>
        {/* Shadow on landing */}
        <ellipse cx="190" cy="192" rx="0" ry="0" fill={S} opacity="0">
          <animate attributeName="rx" from="0" to="12" dur="0.3s" begin="1.9s" fill="freeze" />
          <animate attributeName="ry" from="0" to="3" dur="0.3s" begin="1.9s" fill="freeze" />
          <animate attributeName="opacity" values="0;0.15" dur="0.3s" begin="1.9s" fill="freeze" />
        </ellipse>
      </svg>
    ),

    // BACK: Boomerang arc — throw, curve, return to hand
    back: (
      <svg viewBox="0 0 240 240" className="w-full h-full">
        {/* Hand (origin point) */}
        <circle cx="50" cy="150" r="6" fill={S} opacity="0.3" />
        <line x1="50" y1="156" x2="50" y2="180" stroke={S} strokeWidth="2" opacity="0.2" strokeLinecap="round" />
        {/* Boomerang path (out then back) */}
        <path d="M 50 150 Q 200 40 200 120 Q 200 200 50 150" fill="none" stroke={S} strokeWidth="1" strokeDasharray="400" strokeDashoffset="400" opacity="0.15">
          <animate attributeName="stroke-dashoffset" from="400" to="0" dur="3s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
        </path>
        {/* Boomerang object */}
        <g>
          <rect x="48" y="146" width="12" height="4" rx="2" fill={S} opacity="0.7">
            <animateMotion dur="3s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" rotate="auto">
              <mpath href="#boomerangPath" />
            </animateMotion>
          </rect>
        </g>
        <path id="boomerangPath" d="M 0 0 Q 150 -110 150 -30 Q 150 50 0 0" fill="none" stroke="none" />
        {/* Catch flash */}
        <circle cx="50" cy="150" r="0" fill={S} opacity="0">
          <animate attributeName="r" values="0;15;0" dur="0.4s" begin="2.8s" fill="freeze" />
          <animate attributeName="opacity" values="0;0.3;0" dur="0.4s" begin="2.8s" fill="freeze" />
        </circle>
      </svg>
    ),
  };

  return (
    <div className="w-56 h-56 mx-auto my-4">
      {animations[particleId] || animations.up}
    </div>
  );
}

export function ParticleIntro({ particle, verbCount, onStart }: ParticleIntroProps) {
  return (
    <div className="pt-6">
      {/* Particle name — huge, with Japanese as co-star */}
      <div className="opacity-0 animate-reveal text-center mb-2">
        <h1
          className="text-8xl italic leading-none"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}
        >
          {particle.id}
        </h1>
        <p
          className="text-xl mt-3"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {particle.core_meaning_ja}
        </p>
      </div>

      {/* Animation — the visual story */}
      <div className="opacity-0 animate-reveal stagger-1">
        <ParticleAnimation particleId={particle.id} />
      </div>

      {/* Sense patterns — Japanese-first, larger text */}
      <div className="opacity-0 animate-reveal stagger-2 mb-8">
        <div className="space-y-1">
          {particle.senses.map((sense) => (
            <div
              key={sense.id}
              className="flex items-center gap-4 px-4 py-3"
              style={{ borderBottom: '1px solid var(--color-surface-border)' }}
            >
              <span
                className="text-base flex-shrink-0"
                style={{ color: 'var(--color-text)' }}
              >
                {sense.label}
              </span>
              <span
                className="text-xs ml-auto"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-dim)' }}
              >
                {sense.label_en}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Start button — inviting, not cold */}
      <div className="opacity-0 animate-reveal stagger-3">
        <button
          onClick={onStart}
          className="group w-full cursor-pointer border-0 bg-transparent p-0"
        >
          <div
            className="w-full py-5 text-center transition-all duration-300 group-hover:tracking-[0.1em] group-active:scale-[0.98]"
            style={{
              fontFamily: 'var(--font-body)',
              background: 'var(--color-accent)',
              color: 'var(--color-surface)',
              fontSize: '1.1rem',
              fontWeight: 500,
            }}
          >
            {verbCount}問にチャレンジ
          </div>
        </button>
      </div>
    </div>
  );
}
