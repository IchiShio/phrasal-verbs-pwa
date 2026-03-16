import { useState, useEffect } from 'react';

interface ComboDisplayProps {
  combo: number;
  isCorrect: boolean;
  answered: boolean;
}

const COMBO_LABELS = [
  '', '', '',
  'Nice!',
  'Great!',
  'Amazing!',
  'On Fire!',
  'Unstoppable!',
  'LEGENDARY!',
];

export function ComboDisplay({ combo, isCorrect, answered }: ComboDisplayProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (answered && isCorrect && combo >= 2) {
      setExiting(false);
      setVisible(true);
      const t = setTimeout(() => {
        setExiting(true);
        setTimeout(() => setVisible(false), 300);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [answered, isCorrect, combo]);

  if (!visible) return null;

  const label = COMBO_LABELS[Math.min(combo, COMBO_LABELS.length - 1)] || `x${combo}`;
  const size = Math.min(combo, 6);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none">
      <div className={exiting ? 'animate-combo-out' : 'animate-combo-in'}>
        <div className="text-center">
          <div
            className="font-bold"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: `${1.5 + size * 0.3}rem`,
              color: 'var(--color-accent)',
              textShadow: '0 0 30px rgba(232, 255, 71, 0.4)',
            }}
          >
            x{combo}
          </div>
          {label && (
            <div
              className="text-sm uppercase tracking-[0.2em] mt-1"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-correct)',
              }}
            >
              {label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
