const ctx = () => {
  const c = new (window.AudioContext || (window as any).webkitAudioContext)();
  return c;
};

function play(fn: (c: AudioContext) => void) {
  try { fn(ctx()); } catch {}
}

export function playCorrect() {
  play(c => {
    // Rising chime — two notes
    const g = c.createGain();
    g.gain.setValueAtTime(0.15, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.4);
    g.connect(c.destination);

    const o1 = c.createOscillator();
    o1.type = 'sine';
    o1.frequency.setValueAtTime(523, c.currentTime); // C5
    o1.connect(g);
    o1.start(c.currentTime);
    o1.stop(c.currentTime + 0.15);

    const o2 = c.createOscillator();
    o2.type = 'sine';
    o2.frequency.setValueAtTime(784, c.currentTime + 0.1); // G5
    const g2 = c.createGain();
    g2.gain.setValueAtTime(0.15, c.currentTime + 0.1);
    g2.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.5);
    g2.connect(c.destination);
    o2.connect(g2);
    o2.start(c.currentTime + 0.1);
    o2.stop(c.currentTime + 0.4);
  });
}

export function playWrong() {
  play(c => {
    const g = c.createGain();
    g.gain.setValueAtTime(0.12, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, c.currentTime + 0.3);
    g.connect(c.destination);

    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(200, c.currentTime);
    o.frequency.linearRampToValueAtTime(150, c.currentTime + 0.2);
    o.connect(g);
    o.start(c.currentTime);
    o.stop(c.currentTime + 0.25);
  });
}

export function playCombo() {
  play(c => {
    // Quick ascending arpeggio
    [523, 659, 784, 1047].forEach((freq, i) => {
      const g = c.createGain();
      const t = c.currentTime + i * 0.06;
      g.gain.setValueAtTime(0.1, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      g.connect(c.destination);
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, t);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.15);
    });
  });
}

export function playLevelUp() {
  play(c => {
    // Triumphant fanfare
    const notes = [523, 659, 784, 1047, 784, 1047];
    notes.forEach((freq, i) => {
      const g = c.createGain();
      const t = c.currentTime + i * 0.1;
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
      g.connect(c.destination);
      const o = c.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq, t);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.3);
    });
  });
}

export function playPerfect() {
  play(c => {
    // Sparkle sound
    [1047, 1319, 1568, 2093, 1568, 2093].forEach((freq, i) => {
      const g = c.createGain();
      const t = c.currentTime + i * 0.08;
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
      g.connect(c.destination);
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, t);
      o.connect(g);
      o.start(t);
      o.stop(t + 0.25);
    });
  });
}

export function vibrate(pattern: number | number[]) {
  try { navigator.vibrate?.(pattern); } catch {}
}
